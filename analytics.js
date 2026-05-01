// ============================================
// Reading Archive — Analytics Dashboard
// ============================================
// Access: analytics.html?u=curator_x7z9q
// Reads: analytics/events/*, readStatus, registeredUsers, userSubmissions

(function () {
    'use strict';

    // ── Auth gate ──────────────────────────────────────────────────────────────
    const params = new URLSearchParams(window.location.search);
    const token = params.get('u');
    const CURATOR_TOKEN_EXPECTED = 'curator_x7z9q';

    if (token !== CURATOR_TOKEN_EXPECTED) {
        document.getElementById('auth-gate').classList.remove('hidden');
        return; // stop all further execution
    }
    document.getElementById('dashboard').classList.remove('hidden');

    // ── Helpers ────────────────────────────────────────────────────────────────
    function isoDate(d) {
        // Returns YYYY-MM-DD for a Date object
        return d.toISOString().slice(0, 10);
    }

    function last30Days() {
        const days = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            days.push(isoDate(d));
        }
        return days;
    }

    function shortDate(iso) {
        // "2025-04-15" → "Apr 15"
        const [, m, d] = iso.split('-');
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[parseInt(m, 10) - 1] + ' ' + parseInt(d, 10);
    }

    function timeAgo(ts) {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return s + 's ago';
        if (s < 3600) return Math.floor(s / 60) + 'm ago';
        if (s < 86400) return Math.floor(s / 3600) + 'h ago';
        return Math.floor(s / 86400) + 'd ago';
    }

    function fmtNum(n) {
        if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
        return String(n);
    }

    function esc(str) {
        return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function eventLabel(ev) {
        const map = {
            page_view:      '👀 Page view',
            catalog_enter:  '📖 Entered catalog',
            category_view:  '📂 Category opened',
            article_open:   '📄 Article opened',
            reaction_set:   '❤️ Reaction added',
            reaction_remove:'💔 Reaction removed',
            user_register:  '🙋 New user registered',
            article_submit: '✍️ Article submitted',
        };
        return map[ev] || ev;
    }

    function reactionEmoji(r) {
        if (r === 'liked') return '❤️';
        if (r === 'neutral') return '🤔';
        if (r === 'disliked') return '👎';
        return r || '?';
    }

    // Firebase has two formats: old plain string "liked", new object { reaction: "liked", ... }
    function normalizeReaction(v) {
        if (!v) return null;
        if (typeof v === 'string') return v;          // legacy format
        return v.reaction || null;                     // current format
    }

    // Article title stored in the reaction object (new format only)
    function reactionTitle(v) {
        if (!v || typeof v === 'string') return null;
        return v.title || null;
    }

    function categoryLabel(key) {
        const map = {
            'mind-society': 'Mind & Society',
            'money-markets': 'Money & Markets',
            'science-future': 'Science & Future',
            'power-politics': 'Power & Politics',
            'life-reflections': 'Life & Reflections',
            'user-submissions': 'User Submissions',
        };
        return map[key] || key;
    }

    // Chart.js default style helpers
    const PALETTE = [
        '#b07d62', '#c49a7f', '#8c6248', '#d9b99a', '#5e3f28',
        '#e8d5c4', '#a07050', '#7a5038', '#e0c4aa', '#6b4230',
    ];
    Chart.defaults.font.family = "'Georgia', 'Times New Roman', serif";
    Chart.defaults.color = '#5a4a3a';

    // ── Data buckets ───────────────────────────────────────────────────────────
    let allEvents = [];      // flat array of every event object (with .date injected)
    let readStatus = {};     // { articleId: { userName: { reaction, title, ... } } }
    let registeredUsers = {};
    let userSubmissions = {};
    let anonLabels = {};     // { anonId: "friendly label" }

    // Return the display label for a user ID (falls back to raw ID)
    function getLabel(uid) {
        if (!uid) return 'anon';
        return anonLabels[uid] || uid;
    }

    // ── Fetch everything in parallel ──────────────────────────────────────────
    const days = last30Days();

    // Fetch 30 days of analytics events
    const eventFetches = days.map(day =>
        database.ref('analytics/events/' + day).once('value').then(snap => {
            const val = snap.val();
            if (!val) return [];
            return Object.values(val).map(ev => ({ ...ev, date: day }));
        })
    );

    Promise.all([
        Promise.all(eventFetches),
        database.ref('readStatus').once('value'),
        database.ref('registeredUsers').once('value'),
        database.ref('userSubmissions').once('value'),
        database.ref('anonLabels').once('value'),
    ]).then(([eventDays, rsSnap, ruSnap, usSnap, alSnap]) => {
        allEvents = eventDays.flat().sort((a, b) => (a.ts || 0) - (b.ts || 0));
        readStatus = rsSnap.val() || {};
        registeredUsers = ruSnap.val() || {};
        userSubmissions = usSnap.val() || {};
        anonLabels = alSnap.val() || {};

        renderAll();
        setupLiveFeed();
        setupAnonLabelsListener();

        const now = new Date();
        document.getElementById('dash-updated').textContent =
            'Updated ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }).catch(err => {
        console.error('Analytics load error:', err);
        document.getElementById('dash-updated').textContent = 'Error loading data';
    });

    // ── Master render ──────────────────────────────────────────────────────────
    function renderAll() {
        renderStats();
        renderActivityChart();
        renderTopArticles();
        renderCategoryChart();
        renderReactionsTable();
        renderUsersTable();
        renderSubmissionsTable();
        renderEventTypeChart();
        populateUserFilter();
        renderRecentFeed();
        renderAnonLabelsTable();
    }

    // ── Stats Cards ────────────────────────────────────────────────────────────
    function renderStats() {
        const grid = document.getElementById('stats-grid');

        const pageViews   = allEvents.filter(e => e.ev === 'page_view').length;
        const articleOpens= allEvents.filter(e => e.ev === 'article_open').length;
        const catViews    = allEvents.filter(e => e.ev === 'category_view').length;

        // Unique visitors: distinct 'u' values across all events
        const uniqueU = new Set(allEvents.map(e => e.u).filter(Boolean));
        const uniqueVisitors = uniqueU.size;

        // Total reactions in Firebase (not just last 30d)
        let totalReactions = 0;
        Object.values(readStatus).forEach(article => {
            totalReactions += Object.keys(article).length;
        });

        const numUsers = Object.keys(registeredUsers).length;
        const numSubmissions = Object.keys(userSubmissions).length;

        // Device breakdown (only events that have the dev field — added recently)
        const evWithDev = allEvents.filter(e => e.dev);
        const mobileCount  = evWithDev.filter(e => e.dev === 'm').length;
        const desktopCount = evWithDev.filter(e => e.dev === 'd').length;
        const totalDev = mobileCount + desktopCount;
        const mobilePct  = totalDev > 0 ? Math.round((mobileCount  / totalDev) * 100) : null;
        const desktopPct = totalDev > 0 ? Math.round((desktopCount / totalDev) * 100) : null;
        const deviceSub = totalDev > 0
            ? `📱 ${fmtNum(mobileCount)} · 💻 ${fmtNum(desktopCount)}`
            : 'no device data yet';

        const stats = [
            { label: 'Page Views (30d)',      value: fmtNum(pageViews),     icon: '👀', sub: 'landing page loads' },
            { label: 'Unique Visitors (30d)', value: fmtNum(uniqueVisitors),icon: '🧑‍💻', sub: 'distinct user keys' },
            { label: 'Article Opens (30d)',   value: fmtNum(articleOpens),  icon: '📄', sub: 'articles read' },
            { label: 'Category Views (30d)',  value: fmtNum(catViews),      icon: '📂', sub: 'category entries' },
            { label: 'Total Reactions',       value: fmtNum(totalReactions),icon: '❤️', sub: 'in Firebase' },
            { label: 'Registered Users',      value: fmtNum(numUsers),      icon: '🙋', sub: numSubmissions + ' submissions' },
            { label: 'Mobile (30d)',          value: mobilePct !== null ? mobilePct + '%' : '—', icon: '📱', sub: deviceSub },
        ];

        grid.innerHTML = stats.map(s => `
            <div class="stat-card">
                <div class="stat-icon">${s.icon}</div>
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
                <div class="stat-sub">${s.sub}</div>
            </div>
        `).join('');
    }

    // ── 30-Day Activity Chart ──────────────────────────────────────────────────
    function renderActivityChart() {
        // Count events per day per type
        const dayMap = {};
        days.forEach(d => { dayMap[d] = { page_view: 0, article_open: 0, reaction_set: 0, other: 0 }; });

        allEvents.forEach(ev => {
            const d = ev.date;
            if (!dayMap[d]) return;
            if (ev.ev === 'page_view')    dayMap[d].page_view++;
            else if (ev.ev === 'article_open')  dayMap[d].article_open++;
            else if (ev.ev === 'reaction_set')  dayMap[d].reaction_set++;
            else dayMap[d].other++;
        });

        const labels = days.map(shortDate);
        const pageData    = days.map(d => dayMap[d].page_view);
        const articleData = days.map(d => dayMap[d].article_open);
        const reactData   = days.map(d => dayMap[d].reaction_set);

        new Chart(document.getElementById('activity-chart'), {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Page Views',
                        data: pageData,
                        backgroundColor: 'rgba(176,125,98,0.75)',
                        borderRadius: 3,
                    },
                    {
                        label: 'Article Opens',
                        data: articleData,
                        backgroundColor: 'rgba(140,98,72,0.75)',
                        borderRadius: 3,
                    },
                    {
                        label: 'Reactions',
                        data: reactData,
                        backgroundColor: 'rgba(217,185,154,0.75)',
                        borderRadius: 3,
                    },
                ],
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { stacked: true, grid: { display: false }, ticks: { maxTicksLimit: 10 } },
                    y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(90,74,58,0.1)' }, ticks: { precision: 0 } },
                },
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { callbacks: { title: items => items[0].label } },
                },
            },
        });
    }

    // ── Top Articles ───────────────────────────────────────────────────────────
    function renderTopArticles() {
        const opens = {};
        allEvents.filter(e => e.ev === 'article_open').forEach(e => {
            const key = (e.d && e.d.id) ? e.d.id : (e.d && e.d.title) ? e.d.title : 'unknown';
            const title = (e.d && e.d.title) ? e.d.title : key;
            if (!opens[key]) opens[key] = { title, count: 0 };
            opens[key].count++;
        });

        const sorted = Object.values(opens).sort((a, b) => b.count - a.count).slice(0, 15);
        const el = document.getElementById('top-articles-table');

        if (!sorted.length) {
            el.innerHTML = '<div class="table-empty">No article opens recorded yet.</div>';
            return;
        }

        const maxCount = sorted[0].count || 1;
        el.innerHTML = `
            <table class="data-table">
                <thead><tr><th>#</th><th>Article</th><th>Opens</th><th></th></tr></thead>
                <tbody>
                    ${sorted.map((row, i) => `
                        <tr>
                            <td class="rank">${i + 1}</td>
                            <td class="article-title-cell">${esc(row.title)}</td>
                            <td class="count-cell">${row.count}</td>
                            <td class="bar-cell">
                                <div class="mini-bar" style="width:${Math.round((row.count / maxCount) * 100)}%"></div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ── Category Chart ─────────────────────────────────────────────────────────
    function renderCategoryChart() {
        const catMap = {};
        allEvents.filter(e => e.ev === 'category_view').forEach(e => {
            const cat = (e.d && e.d.cat) ? e.d.cat : 'unknown';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });

        const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
        if (!sorted.length) {
            document.getElementById('category-chart').parentElement.innerHTML =
                '<div class="table-empty" style="padding:2rem">No category views yet.</div>';
            return;
        }

        new Chart(document.getElementById('category-chart'), {
            type: 'doughnut',
            data: {
                labels: sorted.map(([k]) => categoryLabel(k)),
                datasets: [{
                    data: sorted.map(([, v]) => v),
                    backgroundColor: PALETTE.slice(0, sorted.length),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right', labels: { boxWidth: 12, padding: 12 } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.parsed} views` } },
                },
                cutout: '60%',
            },
        });
    }

    // ── Reactions Table ────────────────────────────────────────────────────────
    function renderReactionsTable() {
        const el = document.getElementById('reactions-table');
        const rows = [];

        Object.entries(readStatus).forEach(([articleId, userMap]) => {
            let liked = 0, neutral = 0, disliked = 0, title = articleId;
            Object.values(userMap).forEach(entry => {
                const t = reactionTitle(entry);
                if (t) title = t;
                const r = normalizeReaction(entry);
                if (r === 'liked')    liked++;
                else if (r === 'neutral')  neutral++;
                else if (r === 'disliked') disliked++;
            });
            rows.push({ articleId, title, liked, neutral, disliked,
                total: liked + neutral + disliked });
        });

        rows.sort((a, b) => b.total - a.total);

        if (!rows.length) {
            el.innerHTML = '<div class="table-empty">No reactions recorded yet.</div>';
            return;
        }

        el.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>❤️ Liked</th>
                        <th>🤔 Neutral</th>
                        <th>👎 Disliked</th>
                        <th>Total</th>
                        <th>Who</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <td class="article-title-cell">${esc(row.title)}</td>
                            <td class="count-cell liked-count">${row.liked || '—'}</td>
                            <td class="count-cell">${row.neutral || '—'}</td>
                            <td class="count-cell disliked-count">${row.disliked || '—'}</td>
                            <td class="count-cell"><strong>${row.total}</strong></td>
                            <td class="who-cell">
                                ${Object.entries(readStatus[row.articleId] || {}).map(([u, v]) =>
                                    `<span class="user-pill">${esc(u)} ${reactionEmoji(normalizeReaction(v))}</span>`
                                ).join('')}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ── Users Table ────────────────────────────────────────────────────────────
    function renderUsersTable() {
        const el = document.getElementById('users-table');
        const users = Object.values(registeredUsers);

        if (!users.length) {
            el.innerHTML = '<div class="table-empty">No registered users yet.</div>';
            return;
        }

        // Count reactions per user
        const userReactionCount = {};
        Object.values(readStatus).forEach(articleMap => {
            Object.keys(articleMap).forEach(u => {
                userReactionCount[u] = (userReactionCount[u] || 0) + 1;
            });
        });

        users.sort((a, b) => (b.joinedAt || 0) - (a.joinedAt || 0));

        el.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Name</th><th>One-liner</th><th>Reactions</th><th>Joined</th></tr></thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td><strong>${esc(u.name)}</strong></td>
                            <td class="muted-cell">${esc(u.oneLiner || '—')}</td>
                            <td class="count-cell">${userReactionCount[u.name] || 0}</td>
                            <td class="muted-cell">${u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ── Submissions Table ──────────────────────────────────────────────────────
    function renderSubmissionsTable() {
        const el = document.getElementById('submissions-table');
        const subs = Object.values(userSubmissions);

        if (!subs.length) {
            el.innerHTML = '<div class="table-empty">No user submissions yet.</div>';
            return;
        }

        subs.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));

        el.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Title</th><th>Category</th><th>By</th><th>Date</th></tr></thead>
                <tbody>
                    ${subs.map(s => `
                        <tr>
                            <td>
                                <a href="${esc(s.url)}" target="_blank" rel="noopener" class="article-link">
                                    ${esc(s.title || s.url)}
                                </a>
                            </td>
                            <td class="muted-cell">${esc(categoryLabel(s.category || ''))}</td>
                            <td class="muted-cell">${esc(s.submittedBy || 'Anonymous')}</td>
                            <td class="muted-cell">${s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ── Event Type Breakdown Chart ─────────────────────────────────────────────
    function renderEventTypeChart() {
        const evMap = {};
        allEvents.forEach(e => {
            evMap[e.ev] = (evMap[e.ev] || 0) + 1;
        });

        const sorted = Object.entries(evMap).sort((a, b) => b[1] - a[1]);

        if (!sorted.length) {
            document.getElementById('event-type-chart').parentElement.innerHTML =
                '<div class="table-empty" style="padding:2rem">No events yet.</div>';
            return;
        }

        new Chart(document.getElementById('event-type-chart'), {
            type: 'bar',
            data: {
                labels: sorted.map(([k]) => eventLabel(k)),
                datasets: [{
                    label: 'Count',
                    data: sorted.map(([, v]) => v),
                    backgroundColor: PALETTE.slice(0, sorted.length),
                    borderRadius: 4,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: { beginAtZero: true, grid: { color: 'rgba(90,74,58,0.1)' }, ticks: { precision: 0 } },
                    y: { grid: { display: false } },
                },
                plugins: { legend: { display: false } },
            },
        });
    }

    // One-time flag so filter event listeners are only bound once
    let _filtersSetup = false;

    // ── User filter dropdown ───────────────────────────────────────────────────
    function populateUserFilter() {
        const userSel = document.getElementById('activity-user-filter');
        if (!userSel) return;

        // Save current selection so it survives a rebuild
        const prevVal = userSel.value;

        // Clear all options except the first "All users" placeholder
        while (userSel.options.length > 1) userSel.remove(1);

        // Collect unique user IDs: named users first, then anon keys
        const all = [...new Set(allEvents.map(e => e.u).filter(Boolean))];
        const named = all.filter(u => !u.startsWith('anon-')).sort();
        const anons = all.filter(u => u.startsWith('anon-')).sort();

        [...named, ...anons].forEach(u => {
            const opt = document.createElement('option');
            opt.value = u;
            const lbl = anonLabels[u];
            // Show "Friendly Name  (anon-xxx)" or just the raw ID
            opt.textContent = lbl ? `${lbl}  (${u})` : u;
            userSel.appendChild(opt);
        });

        // Restore previous selection if it still exists
        if (prevVal && [...userSel.options].some(o => o.value === prevVal)) {
            userSel.value = prevVal;
        }

        // Bind change listeners only once
        if (!_filtersSetup) {
            _filtersSetup = true;
            userSel.addEventListener('change', () => renderRecentFeed());
            document.getElementById('activity-device-filter')
                ?.addEventListener('change', () => renderRecentFeed());
        }
    }

    // ── Recent Activity Feed ───────────────────────────────────────────────────
    function renderRecentFeed(liveEvents) {
        const feed = document.getElementById('activity-feed');
        const filterUser   = document.getElementById('activity-user-filter')?.value   || '';
        const filterDevice = document.getElementById('activity-device-filter')?.value || '';

        // Merge allEvents with any incoming live events, deduplicate by ts+ev+u
        const combined = liveEvents
            ? [...allEvents, ...liveEvents.filter(le =>
                !allEvents.some(e => e.ts === le.ts && e.ev === le.ev && e.u === le.u)
              )]
            : allEvents;

        const source = combined
            .slice()
            .sort((a, b) => (b.ts || 0) - (a.ts || 0))
            .filter(ev => (!filterUser   || ev.u   === filterUser))
            .filter(ev => (!filterDevice || ev.dev === filterDevice))
            .slice(0, 60);

        if (!source.length) {
            feed.innerHTML = '<div class="table-empty">No activity matches the selected filters.</div>';
            return;
        }

        feed.innerHTML = source.map(ev => {
            const d = ev.d || {};
            let detail = '';
            if (ev.ev === 'article_open'  && d.title) detail = ` — ${d.title}`;
            else if (ev.ev === 'category_view' && d.cat)  detail = ` — ${categoryLabel(d.cat)}`;
            else if (ev.ev === 'reaction_set'  && d.r)    detail = ` — ${reactionEmoji(d.r)} ${d.title || d.id || ''}`;
            else if (ev.ev === 'user_register' && d.name) detail = ` — ${d.name}`;
            else if (ev.ev === 'article_submit' && d.cat) detail = ` — ${categoryLabel(d.cat)} by ${d.by || '?'}`;

            const deviceIcon = ev.dev === 'm' ? '📱' : ev.dev === 'd' ? '💻' : '';
            const rawUid = ev.u || 'anon';
            const displayUser = getLabel(rawUid);
            // Tooltip shows raw ID if labelled, plus timezone if available
            const tooltipParts = [
                displayUser !== rawUid ? rawUid : '',
                ev.tz || '',
            ].filter(Boolean);
            const tooltip = tooltipParts.length ? ` title="${esc(tooltipParts.join(' · '))}"` : '';

            return `
                <div class="feed-item">
                    <span class="feed-event">${eventLabel(ev.ev)}</span>
                    <span class="feed-detail">${esc(detail)}</span>
                    <span class="feed-meta">
                        ${deviceIcon ? `<span class="feed-device">${deviceIcon}</span>` : ''}
                        <span class="feed-user"${tooltip}>${esc(displayUser)}</span>
                        <span class="feed-time">${ev.ts ? timeAgo(ev.ts) : ev.date || ''}</span>
                    </span>
                </div>
            `;
        }).join('');
    }

    // ── Anon Labels: live listener ─────────────────────────────────────────────
    function setupAnonLabelsListener() {
        database.ref('anonLabels').on('value', (snap) => {
            anonLabels = snap.val() || {};
            // Rebuild dropdown labels and re-render feed — but NOT the label table
            // (to avoid resetting the input fields while Tanmay is typing)
            populateUserFilter();
            renderRecentFeed();
        });
    }

    // ── Name Anonymous Visitors table ──────────────────────────────────────────
    function renderAnonLabelsTable() {
        const el = document.getElementById('anon-labels-table');
        if (!el) return;

        // All unique anon IDs seen in the last 30 days
        const anonIds = [...new Set(
            allEvents.filter(e => e.u && e.u.startsWith('anon-')).map(e => e.u)
        )];

        if (!anonIds.length) {
            el.innerHTML = '<div class="table-empty">No anonymous visitors in the last 30 days.</div>';
            return;
        }

        // Per-ID stats: event count, last seen, devices, timezone
        const idStats = {};
        anonIds.forEach(id => {
            const evs = allEvents.filter(e => e.u === id);
            const lastEv = evs.reduce((a, b) => ((a.ts || 0) > (b.ts || 0) ? a : b), {});
            idStats[id] = {
                count: evs.length,
                lastTs: lastEv.ts || 0,
                devices: [...new Set(evs.map(e => e.dev).filter(Boolean))],
                tz: [...new Set(evs.map(e => e.tz).filter(Boolean))][0] || null,
            };
        });

        // Sort by most recently active
        anonIds.sort((a, b) => (idStats[b].lastTs || 0) - (idStats[a].lastTs || 0));

        el.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Anonymous ID</th>
                        <th>Display name</th>
                        <th>Events</th>
                        <th>Device</th>
                        <th>Timezone</th>
                        <th>Last seen</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${anonIds.map(id => {
                        const s = idStats[id];
                        const devIcons = s.devices.map(d => d === 'm' ? '📱' : '💻').join(' ') || '—';
                        return `
                            <tr>
                                <td class="mono-cell">${esc(id)}</td>
                                <td>
                                    <input class="anon-label-input" type="text"
                                        data-id="${esc(id)}"
                                        value="${esc(anonLabels[id] || '')}"
                                        placeholder="e.g. Himadri's phone" />
                                </td>
                                <td class="count-cell">${s.count}</td>
                                <td class="count-cell">${devIcons}</td>
                                <td class="muted-cell tz-cell">${esc(s.tz || '—')}</td>
                                <td class="muted-cell">${s.lastTs ? timeAgo(s.lastTs) : '—'}</td>
                                <td><button class="anon-save-btn" data-id="${esc(id)}">Save</button></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        // Wire up save buttons
        el.querySelectorAll('.anon-save-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.dataset.id;
                const input = el.querySelector(`.anon-label-input[data-id="${id}"]`);
                if (!input) return;
                const label = input.value.trim();
                const b = this;
                const ref = database.ref('anonLabels/' + id);
                if (label) {
                    ref.set(label).then(() => {
                        b.textContent = 'Saved ✓'; b.classList.add('saved');
                        setTimeout(() => { b.textContent = 'Save'; b.classList.remove('saved'); }, 1800);
                    }).catch(() => { b.textContent = 'Error'; });
                } else {
                    ref.remove().then(() => {
                        b.textContent = 'Cleared';
                        setTimeout(() => { b.textContent = 'Save'; }, 1800);
                    });
                }
            });
        });

        // Save on Enter key
        el.querySelectorAll('.anon-label-input').forEach(input => {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    el.querySelector(`.anon-save-btn[data-id="${this.dataset.id}"]`)?.click();
                }
            });
        });
    }

    // ── Live Feed: subscribe to today's events ─────────────────────────────────
    function setupLiveFeed() {
        const today = isoDate(new Date());

        database.ref('analytics/events/' + today).on('child_added', (snap) => {
            const ev = snap.val();
            if (!ev) return;
            ev.date = today;
            // Avoid duplicates from the initial batch load
            const alreadyLoaded = allEvents.some(e => e.ts === ev.ts && e.ev === ev.ev && e.u === ev.u);
            if (!alreadyLoaded) {
                allEvents.push(ev);
                renderRecentFeed(); // re-render with updated allEvents (no separate liveBuffer needed)
            }
        });
    }

})();
