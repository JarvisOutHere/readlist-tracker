// ==========================================
// FIREBASE INTEGRATION
// ==========================================
// Note: firebase-config.js must be loaded before this file
// It provides: getCurrentUser(), getReadStatusCache(), initReadStatusListener(),
// saveReactionToFirebase(), removeReactionFromFirebase()

// Reactive state for Firebase data
let reactionsCache = {};

// Get current user from magic link
function getActiveUser() {
    return getCurrentUser(); // From firebase-config.js
}


// Is the current session an anonymous guest (no saved login)?
function isGuestUser() {
    const uid = getActiveUser();
    return !!uid && uid.startsWith('anon-');
}

// Human-readable display name for a Firebase user key
function getUserDisplayName(uid) {
    if (!uid) return 'Guest';
    if (uid.startsWith('anon-')) return 'Guest User';
    return uid;
}

// Submitter display label: "Guest" if no login, otherwise their name
function getSubmitterLabel() {
    if (isGuestUser()) return 'Anonymous';
    return getActiveUser();
}

// Update the landing page login button label
function updateLoginButton() {
    const btn = document.getElementById('landing-login-btn');
    if (!btn) return;
    const uid = getActiveUser();
    if (uid && !uid.startsWith('anon-') && uid !== 'Tanmay') {
        btn.textContent = uid;
        btn.classList.add('logged-in');
    } else if (uid && uid.startsWith('anon-')) {
        btn.textContent = 'Login';
        btn.classList.remove('logged-in');
    }
}
// Load reactions from Firebase cache
function loadReactions() {
    const cache = getReadStatusCache();
    // Transform Firebase format to app format
    // Firebase: { itemId: { userName: reactionType } }
    // App expects: { itemId: { user: userName, reaction: reactionType } }
    const transformed = {};

    for (const itemId in cache) {
        const userReactions = cache[itemId];
        // Get current user's reaction for this item
        const currentUserName = getActiveUser();
        if (userReactions[currentUserName]) {
            transformed[itemId] = {
                user: currentUserName,
                reaction: mapFirebaseReactionToApp(userReactions[currentUserName])
            };
        }
    }

    return transformed;
}

// Map Firebase reaction types to app types
function mapFirebaseReactionToApp(firebaseData) {
    // Handle both new object format {reaction: 'liked', ...} and legacy string format 'liked'
    const reactionValue = (typeof firebaseData === 'object' && firebaseData !== null && firebaseData.reaction)
        ? firebaseData.reaction
        : firebaseData;

    // Firebase uses: liked, neutral, disliked
    // App uses: positive, neutral, negative
    const mapping = {
        'liked': 'positive',
        'neutral': 'neutral',
        'disliked': 'negative',
        'positive': 'positive',
        'negative': 'negative'
    };
    return mapping[reactionValue] || reactionValue;
}


// Map app reaction types to Firebase types
function mapAppReactionToFirebase(appReaction) {
    const mapping = {
        'positive': 'liked',
        'neutral': 'neutral',
        'negative': 'disliked'
    };
    return mapping[appReaction] || appReaction;
}

// Get all reactions for all users for an item (for nerd profiles)
function getAllReactionsForItem(itemId) {
    const cache = getReadStatusCache();
    return cache[itemId] || {};
}

// Get item ID for reactions
// IMPORTANT: Uses stable 'id' field if present to prevent data loss when titles change
// Firebase doesn't allow: . $ # [ ] / in path keys
function getItemId(item) {
    // Use stable ID if present (preferred - never changes)
    if (item.id) return item.id;

    // Fallback to legacy title-based ID (for backward compatibility)
    return `${item.title}-${item.author}`
        .replace(/[.$#\[\]\/\:?]/g, '') // Remove Firebase-invalid chars
        .replace(/\s+/g, '-')
        .toLowerCase();
}

// ==========================================
// IMAGE PRELOADING SYSTEM
// ==========================================
// Cache for preloaded images { imagePath: { loaded: boolean, width: number, height: number } }
const imageCache = {};
let preloadingStarted = false;

// Preload all images on app init (called when landing page loads)
function preloadAllImages() {
    if (preloadingStarted) return;
    preloadingStarted = true;

    // Collect all images from all categories
    const allImages = [];
    for (const category in data.articles) {
        data.articles[category].forEach(item => {
            if (item.image) {
                allImages.push(item.image);
            }
        });
    }

    console.log(`Preloading ${allImages.length} images...`);

    allImages.forEach(imagePath => {
        if (imageCache[imagePath]) return; // Already cached

        const img = new Image();
        imageCache[imagePath] = { loaded: false, width: 0, height: 0 };

        img.onload = () => {
            imageCache[imagePath] = {
                loaded: true,
                width: img.naturalWidth,
                height: img.naturalHeight
            };
        };
        img.onerror = () => {
            imageCache[imagePath] = { loaded: true, width: 0, height: 0 };
        };
        img.src = imagePath;
    });
}

// Get cached image dimensions (returns null if not yet loaded)
function getCachedImageDimensions(imagePath) {
    const cached = imageCache[imagePath];
    if (cached && cached.loaded) {
        return { w: cached.width, h: cached.height };
    }
    return null;
}


const data = {
    articles: {
        "interesting-businesses": [
            {
                id: "picturetime-the-balloon-and-the-box-office-tiger-feathers",
                title: "PictureTime: The Balloon And The Box Office",
                author: "Tiger Feathers",
                description: "Inflatable cinema theatres bringing Bollywood to villages that never had a screen.",
                url: "https://www.tigerfeathers.in/p/picturetime-the-balloon-and-the-box",
                image: "images/picturetime.png"
            },
            {
                id: "airbound-delivering-abundance-tiger-feathers",
                title: "Airbound: Delivering Abundance",
                author: "Tiger Feathers",
                description: "A Bangalore startup betting that drone delivery isn't a gimmick but a fundamental reimagining of logistics. If they crack it, one-rupee delivery could change everything.",
                url: "https://www.tigerfeathers.in/p/airbound-delivering-abundance",
                image: "images/airbound.png"
            },
            {
                id: "a16z-the-power-brokers-not-boring",
                title: "a16z: The Power Brokers",
                author: "Not Boring",
                description: "How a venture firm became a cultural and political force. A 16,000-word deep dive into the machine that Marc and Ben built, and what it means to broker power in Silicon Valley.",
                url: "https://www.notboring.co/p/a16z-the-power-brokers",
                image: "images/a16z.png",
                imageBg: "#f5f4f0"
            },
            {
                id: "the-palantirization-of-everything-a16z",
                title: "The Palantirization of Everything",
                author: "a16z",
                description: "It's a very interesting system they have going over there. How do you scale a bespoke solution?",
                url: "https://www.a16z.news/p/the-palantirization-of-everything",
                image: "images/palantirization.png",
                layout: "horizontal"
            }
        ],
        "ai": [
            {
                id: "ai-and-leviathan-part-i-second-best",
                title: "AI and Leviathan: Part I",
                author: "Second Best",
                description: "What happens when intelligence becomes abundant? This series applies institutional economics to AI, asking whether we're heading toward a new state of nature or something stranger still.",
                url: "https://www.secondbest.ca/p/ai-and-leviathan-part-i",
                image: "images/leviathan.png",
                layout: "horizontal-square"
            },
            {
                id: "ai-2027-ai-2027",
                title: "AI 2027",
                author: "AI 2027",
                description: "Watershed moment for my interest in AI.",
                url: "https://ai-2027.com/",
                image: "images/ai2027.png",
                layout: "horizontal-square"
            },
            {
                id: "import-ai-441-my-agents-are-working-are-yours-jack-clark",
                title: "Import AI 441: My Agents Are Working. Are Yours?",
                author: "Jack Clark",
                description: "It feels a little surreal.",
                url: "https://jack-clark.net/2026/01/19/import-ai-441-my-agents-are-working-are-yours/",
                image: "images/import-ai.png"
            },
            {
                id: "agi-ruin-a-list-of-lethalities-eliezer-yudkowsky",
                title: "AGI Ruin: A List of Lethalities",
                author: "Eliezer Yudkowsky",
                description: "If the field of AI alignment had a bible, it would be this.",
                url: "https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities",
                image: "images/agi-ruin.png"
            },
            {
                id: "the-adolescence-of-technology-dario-amodei",
                title: "The Adolescence of Technology",
                author: "Dario Amodei",
                description: "In Carl Sagan's Contact, the astronomer considered to meet the aliens is asked by the panel: if you could ask them just one question, what would it be? Her reply: how did you do it? How did you survive this technological adolescence without destroying yourself?",
                url: "https://www.darioamodei.com/essay/the-adolescence-of-technology",
                image: "images/adolescence-of-tech.png",
                layout: "horizontal"
            }
        ],
        "intrapersonal": [

            {
                id: "make-something-heavy-working-theorys",
                title: "Make Something Heavy",
                author: "Working Theorys",
                description: "Consumption can take you only so far.",
                url: "https://www.workingtheorys.com/p/make-something-heavy",
                image: "images/make-something-heavy.jpg",
                layout: "horizontal-4-3"
            },
            {
                id: "safety-is-making-you-depressed-conquer",
                title: "Safety Is Making You Depressed",
                author: "Conquer",
                description: "There's something very romantic about giving something your all. It's the era of the maxxer.",
                url: "https://conquer1.substack.com/p/safety-is-making-you-depressed",
                image: "images/safety-depressed.jpg"
            },

            {
                id: "the-stable-marriage-problem-acotra",
                title: "The Stable Marriage Problem",
                author: "Acotra",
                description: "If I could have any trait in life, bias for action would be #2.",
                url: "https://acotra.substack.com/p/the-stable-marriage-problem",
                image: "images/stable-marriage-problem.png"
            },

            {
                id: "how-to-live-an-intellectually-rich-life-utsav-mamoria",
                title: "How to Live an Intellectually Rich Life",
                author: "Utsav Mamoria",
                description: "The actual piece isn't as pretentious as it sounds.",
                url: "https://utsavmamoria.substack.com/p/how-to-live-an-intellectually-rich",
                image: "images/intellectually-rich.png"
            },

            {
                id: "what-makes-a-person-interesting-angel-cake",
                title: "What Makes a Person Interesting?",
                author: "Angel Cake",
                description: "And curiosity #1.",
                url: "https://angelcake.substack.com/p/what-makes-a-person-interesting",
                image: "images/what-makes-interesting.jpg"
            }
        ],
        "fin-econ-geopolity": [
            {
                id: "evolution-of-a-value-investor-sage-saigal",
                title: "Evolution of a Value Investor",
                author: "Sage Saigal",
                description: "What kind of a mental model do you need for developing mental models for value investing?",
                url: "https://sagesaigal.substack.com/p/evolution-of-a-value-investor-presentation",
                image: "images/value-investor.png"
            },


            {
                id: "finding-your-investment-lodestar-aswath-damodaran",
                title: "Finding Your Investment Lodestar",
                author: "Aswath Damodaran",
                description: "From the man, the myth, the legend himself.",
                url: "https://aswathdamodaran.substack.com/p/finding-your-investment-lodestar",
                image: "images/damodaran-lodestar.jpg",
                layout: "horizontal"
            },

            {
                id: "rewiring-the-energy-debate-electrotech-revolution",
                title: "Rewiring the Energy Debate",
                author: "Electrotech Revolution",
                description: "Can't wait for the air to be breathable again.",
                url: "https://www.electrotech-revolution.com/p/rewiring-the-energy-debate",
                image: "images/electrotech-revolution.png",
                layout: "horizontal"
            },

            {
                id: "china's-broken-balance-sheet-why-china-will-invade-taiwan-before-2030-rohit-shinde",
                title: "China's Broken Balance Sheet: Why China Will Invade Taiwan before 2030",
                author: "Rohit Shinde",
                description: "Fun takes all around.",
                url: "https://substack.com/home/post/p-181489135",
                image: "images/taiwan-exercises.jpg",
                layout: "horizontal"
            }
        ],
        "food-for-thought": [

            {
                id: "india-in-charts---the-house-view-tiger-feathers",
                title: "India In Charts - The House View",
                author: "Tiger Feathers",
                description: "A visual essay on India. If you think you know what to expect, you don't.",
                url: "https://www.tigerfeathers.in/p/india-in-charts-the-house-view",
                image: "images/india-in-charts.jpg"
            },

            {
                id: "the-great-differentiation-not-boring",
                title: "The Great Differentiation",
                author: "Not Boring",
                description: "Kind of funny that it's the slop era that might just lead to some of the most interesting art we've ever seen.",
                url: "https://www.notboring.co/p/the-great-differentiation",
                image: "images/great-differentiation.jpg"
            },

            {
                id: "the-böckenförde-dilemma-jason-zhao",
                title: "The Böckenförde Dilemma",
                author: "Jason Zhao",
                description: "Liberal democracies rely on shared liberal-democratic cultural values to flourish, but the contradiction within is that these values are built around tolerating and welcoming other values, including ones that aren't these.",
                url: "https://jasonzhao.substack.com/p/the-bockenforde-dilemma",
                image: "images/bockenforde.jpg"
            },

            {
                id: "technology-in-1776-christian-keil",
                title: "Technology in 1776",
                author: "Christian Keil",
                description: "Human progress is an exponential.",
                url: "https://www.a16z.news/p/technology-in-1776",
                image: "images/technology-1776.jpg"
            },
            {
                id: "compared-to-what-adam-golding",
                title: "Compared to What?",
                author: "Adam Golding",
                description: "A very fun exercise.",
                url: "https://adamgolding.substack.com/p/compared-to-what",
                image: "images/compared-to-what.png",
            }
        ],
        "culture": [
            {
                id: "where-edges-become-doors-mishti-sharma",
                title: "where edges become doors",
                author: "Mishti Sharma",
                description: "Something about this fills the heart up",
                url: "https://substack.com/@mishti/p-165343008",
                image: "images/culture-mishti.jpg"
            }
        ],
        "user-submissions": [
            // Articles submitted by users will go here
        ]
    }
};

// Category display names
const categoryNames = {
    "interesting-businesses": "Interesting Businesses",
    "ai": "AI",
    "intrapersonal": "Intrapersonal",
    "fin-econ-geopolity": "Fin-Econ-(Geo)Polity",
    "food-for-thought": "Food for Thought",
    "culture": "Culture?",
    "user-submissions": "User Submissions"
};

// Show landing page
function showLanding() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('pillars-page').classList.add('hidden');
    document.getElementById('scroll-page').classList.add('hidden');
}

// Enter pillars view
function enterCatalog() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('pillars-page').classList.remove('hidden');
    document.getElementById('scroll-page').classList.add('hidden');
    buildPillars();
}

// Show pillars (back from scroll view)
function showPillars() {
    document.getElementById('scroll-page').classList.add('hidden');
    document.getElementById('pillars-page').classList.remove('hidden');
}

// Shuffle array (Fisher-Yates)
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Build the 6 vertical pillars
function buildPillars() {
    const container = document.getElementById('pillars-container');
    container.innerHTML = '';

    const allKeys = Object.keys(data.articles).filter(k => k !== 'user-submissions');

    // Keep first two fixed, randomize the rest (excluding user-submissions)
    const fixedKeys = allKeys.slice(0, 2); // interesting-businesses, ai
    const restKeys = shuffleArray(allKeys.slice(2)); // intrapersonal, fin-econ, food-for-thought
    const categories = [...fixedKeys, ...restKeys, 'user-submissions']; // user-submissions always last

    // Find max article count for proportional heights (exclude user-submissions from max calc)
    const mainCounts = categories.filter(k => k !== 'user-submissions').map(k => data.articles[k].length);
    const maxCount = Math.max(...mainCounts);

    // Height range: min 40%, max 90% of container
    const minPct = 40;
    const maxPct = 90;

    categories.forEach((catKey, index) => {
        const pillar = document.createElement('div');
        const isUserSubmissions = catKey === 'user-submissions';
        const count = isUserSubmissions
            ? Object.keys(getUserSubmissionsCache()).length
            : data.articles[catKey].length;
        const isEmpty = count === 0;

        // Build class list
        let classes = 'pillar';
        if (isUserSubmissions) classes += ' pillar-inverted';
        if (isEmpty) classes += ' pillar-empty';
        pillar.className = classes;
        pillar.style.animationDelay = `${index * 0.08}s`;

        // Proportional height (0 articles = minimal line at bottom)
        let heightPct;
        if (isEmpty) {
            heightPct = 0.5; // Minimal height - just a thin line
        } else {
            heightPct = minPct + ((count / maxCount) * (maxPct - minPct));
        }
        pillar.style.height = heightPct + '%';

        pillar.innerHTML = `
            <div class="pillar-count">${count}</div>
            <div class="pillar-name">${categoryNames[catKey]}</div>
        `;

        pillar.addEventListener('click', () => {
            openScrollView(catKey);
        });

        container.appendChild(pillar);
    });
}

// Track current category and panel item for re-rendering
let currentCategoryKey = null;
let currentPanelItem = null;

// Open the scroll view for a category
function openScrollView(categoryKey) {
    currentCategoryKey = categoryKey;
    document.getElementById('pillars-page').classList.add('hidden');
    document.getElementById('scroll-page').classList.remove('hidden');

    const title = document.getElementById('scroll-category-title');
    title.textContent = categoryNames[categoryKey];

    renderScrollCards(categoryKey);
}

// Render sidebar list and auto-select first article in the panel
function renderScrollCards(categoryKey) {
    const sidebarList = document.getElementById('scroll-sidebar-list');
    sidebarList.innerHTML = '';

    // For 'user-submissions': show ALL Firebase submissions across all categories
    // For regular categories: merge static articles + submissions tagged to that category
    const toArticle = s => ({
        id: s.id,
        title: s.title || s.url,
        author: s.submittedBy || 'Anonymous',
        url: s.url,
        description: s.description || '',
        image: s.imageUrl || s.image || 'images/no-image.png',
        submittedBy: s.submittedBy || 'Anonymous',
        userSubmitted: true,
    });

    let items;
    if (categoryKey === 'user-submissions') {
        // All Firebase submissions, sorted newest first
        items = Object.values(getUserSubmissionsCache())
            .sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0))
            .map(toArticle);
    } else {
        const staticItems = data.articles[categoryKey] || [];
        const dynamicItems = getUserSubmissionsForCategory(categoryKey).map(toArticle);
        items = [...staticItems, ...dynamicItems];
    }

    if (items.length === 0) {
        sidebarList.innerHTML = '<div class="sidebar-empty">No articles yet</div>';
        document.getElementById('scroll-main').innerHTML = '';
    } else {
        items.forEach((item) => {
            const el = document.createElement('div');
            el.className = 'sidebar-article-item';
            el.innerHTML = `
                <div class="sidebar-article-title">${item.title}</div>
                <div class="sidebar-article-author">${item.author}</div>
                ${item.description ? `<div class="sidebar-article-description">${item.description}</div>` : ''}
            `;
            el.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-article-item').forEach(e => e.classList.remove('active'));
                el.classList.add('active');
                showArticleInPanel(item);
            });
            sidebarList.appendChild(el);
        });

        // Auto-select first article
        const firstEl = sidebarList.querySelector('.sidebar-article-item');
        if (firstEl) {
            firstEl.classList.add('active');
            showArticleInPanel(items[0]);
        }
    }

    // "+" button at the bottom of sidebar for anyone to suggest an article
    const addBtn = document.createElement('button');
    addBtn.className = 'sidebar-add-btn';
    addBtn.innerHTML = '<span>+</span> Add an article';
    addBtn.addEventListener('click', () => openSubmitArticleModal(categoryKey));
    sidebarList.appendChild(addBtn);
}

// Build the reaction pane showing who reacted with Nice / Meh / Absolutely No
function buildReactionPane(item) {
    const itemId = getItemId(item);
    const allReactions = getAllReactionsForItem(itemId);

    const nice = [], meh = [], no = [];

    for (const userName in allReactions) {
        const reaction = mapFirebaseReactionToApp(allReactions[userName]);
        if (reaction === 'positive') nice.push(userName);
        else if (reaction === 'neutral') meh.push(userName);
        else if (reaction === 'negative') no.push(userName);
    }

    // Build display map for anon keys (consistent across categories)
    const allKeys = [...nice, ...meh, ...no];
    const anonMap = {};
    let anonIdx = 0;
    allKeys.forEach(n => {
        if (n.startsWith('anon-') && !anonMap[n]) {
            anonIdx++;
            anonMap[n] = anonIdx === 1 ? 'Anonymous' : `Anonymous (${anonIdx})`;
        }
    });
    const toDisplay = n => n.startsWith('anon-') ? anonMap[n] : n;

    const renderNames = (names) => names.length
        ? names.map(n => `<span class="reaction-person-name">${toDisplay(n)}</span>`).join('')
        : `<span class="reaction-empty">—</span>`;

    const pane = document.createElement('div');
    pane.className = 'reaction-pane';
    pane.innerHTML = `
        <div class="reaction-pane-header">Reactions</div>
        <div class="reaction-columns">
            <div class="reaction-col reaction-col-nice">
                <div class="reaction-col-label">Nice</div>
                <div class="reaction-col-names">${renderNames(nice)}</div>
            </div>
            <div class="reaction-col reaction-col-meh">
                <div class="reaction-col-label">Meh</div>
                <div class="reaction-col-names">${renderNames(meh)}</div>
            </div>
            <div class="reaction-col reaction-col-no">
                <div class="reaction-col-label">Absolutely Not</div>
                <div class="reaction-col-names">${renderNames(no)}</div>
            </div>
        </div>
    `;
    return pane;
}

// Show a full article card in the right panel, with reaction pane below
function showArticleInPanel(item) {
    currentPanelItem = item;
    const main = document.getElementById('scroll-main');
    main.innerHTML = '';
    main.scrollTop = 0;

    let imgW = 0, imgH = 0;
    if (item.image) {
        const cached = getCachedImageDimensions(item.image);
        if (cached) {
            imgW = cached.w;
            imgH = cached.h;
        } else {
            imgW = 800;
            imgH = 600;
        }
    }

    // Size card based on panel dimensions so aspect ratio is preserved correctly
    const panelW = main.clientWidth;
    const panelH = main.clientHeight;
    const card = buildScrollCard(item, imgW, imgH, panelW, panelH);
    main.appendChild(card);

    // Reaction pane matches the article card width
    const reactionPane = buildReactionPane(item);
    main.appendChild(reactionPane);

    requestAnimationFrame(() => {
        card.classList.add('visible');
        // Match reaction pane width to the actual rendered card window
        const cardWin = card.querySelector('.card-window');
        if (cardWin && cardWin.offsetWidth > 0) {
            reactionPane.style.width = cardWin.offsetWidth + 'px';
        }
    });
}


// Build a single scroll card
// containerW/containerH: optional — pass panel dimensions to size card for that context
function buildScrollCard(item, imgW, imgH, containerW, containerH) {
    const card = document.createElement('div');
    card.className = 'scroll-card';

    const itemId = getItemId(item);
    card.dataset.itemId = itemId; // Store for updateReactionButtonStates
    const currentUserName = getActiveUser();

    // Get current user's reaction from Firebase cache
    const cache = getReadStatusCache();
    const itemReactions = cache[itemId] || {};
    const userReaction = itemReactions[currentUserName];
    const mappedReaction = userReaction ? mapFirebaseReactionToApp(userReaction) : null;

    const positiveActive = mappedReaction === 'positive' ? 'active' : '';
    const neutralActive = mappedReaction === 'neutral' ? 'active' : '';
    const negativeActive = mappedReaction === 'negative' ? 'active' : '';

    const imageContent = item.image
        ? `<img src="${item.image}" alt="${item.title}">`
        : `<div class="card-image-placeholder">
                <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
                    <circle cx="16" cy="20" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M4 32L16 24L28 32L36 26L44 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
           </div>`;

    const isHorizontal = item.layout === 'horizontal' || item.layout === 'horizontal-square' || item.layout === 'horizontal-4-3';

    // Check if this article is the user's favorite
    const userThoughts = getUserThoughts(currentUserName);
    const isFavorite = userThoughts.favoriteArticleId === itemId;
    const favoriteActive = isFavorite ? 'active' : '';

    card.innerHTML = `
        <div class="card-window">
            <div class="card-favorite-wrapper">
                <button class="card-favorite-btn ${favoriteActive}" title="Favorite">
                    <span class="btn-icon">★</span>
                    <span class="btn-label">Favorite</span>
                </button>
            </div>
            <div class="card-reactions">
                <button class="card-reaction-btn positive ${positiveActive}" title="Nice"><span class="btn-icon">✓</span><span class="btn-label">Nice</span></button>
                <button class="card-reaction-btn neutral ${neutralActive}" title="Meh"><span class="btn-icon">—</span><span class="btn-label">Meh</span></button>
                <button class="card-reaction-btn negative ${negativeActive}" title="Absolutely Not"><span class="btn-icon">✗</span><span class="btn-label">Absolutely Not</span></button>
            </div>
            <div class="card-image">
                ${imageContent}
            </div>
            <div class="card-bottom">
                <h2 class="card-title">${item.title}</h2>
                <p class="card-author">${item.author}</p>
                <p class="card-description">${item.description}</p>
            </div>
        </div>
    `;


    const win = card.querySelector('.card-window');

    // Apply layout mode
    if (item.layout) {
        // horizontal-4-3 reuses the horizontal CSS flex layout
        win.classList.add(item.layout === 'horizontal-4-3' ? 'horizontal' : item.layout);
    }

    // Dynamically size card based on image aspect ratio
    if (imgW > 0 && imgH > 0) {
        const vw = containerW || window.innerWidth;
        const maxW = vw * 0.88;
        const maxH = (containerH || window.innerHeight) * 0.82;
        const textSize = 120;

        if (item.layout === 'horizontal-4-3') {
            const targetAspect = 4 / 3;
            const textPanelW = 280;
            let totalW = Math.min(maxW, maxH * targetAspect);
            let totalH = totalW / targetAspect;
            const imgAreaW = totalW - textPanelW;

            win.style.width = totalW + 'px';
            win.style.height = totalH + 'px';

            const imgPct = (imgAreaW / totalW * 100);
            const textPct = 100 - imgPct;
            card.querySelector('.card-image').style.width = imgPct + '%';
            card.querySelector('.card-image').style.flex = 'none';
            card.querySelector('.card-bottom').style.width = textPct + '%';
            card.querySelector('.card-bottom').style.flex = 'none';
        } else if (isHorizontal) {
            const textPanelW = 250;
            const imgAspect = imgW / imgH;
            let imgAreaH = maxH;
            let imgAreaW = imgAreaH * imgAspect;

            if (imgAreaW + textPanelW > maxW) {
                imgAreaW = maxW - textPanelW;
                imgAreaH = imgAreaW / imgAspect;
            }

            const totalW = imgAreaW + textPanelW;
            const totalH = imgAreaH;

            win.style.width = totalW + 'px';
            win.style.height = totalH + 'px';

            const imgPct = (imgAreaW / totalW * 100);
            const textPct = 100 - imgPct;
            card.querySelector('.card-image').style.width = imgPct + '%';
            card.querySelector('.card-image').style.flex = 'none';
            card.querySelector('.card-bottom').style.width = textPct + '%';
            card.querySelector('.card-bottom').style.flex = 'none';
        } else {
            const imgAspect = imgW / imgH;
            let imgAreaW = maxW;
            let imgAreaH = imgAreaW / imgAspect;

            if (imgAreaH + textSize > maxH) {
                imgAreaH = maxH - textSize;
                imgAreaW = imgAreaH * imgAspect;
            }

            const totalW = imgAreaW;
            const totalH = imgAreaH + textSize;

            win.style.width = totalW + 'px';
            win.style.height = totalH + 'px';
        }
    }

    // Apply custom background color
    if (item.imageBg) {
        card.querySelector('.card-image').style.background = item.imageBg;
    }

    // Apply custom image crop position (e.g. "top" to anchor the top of the image)
    if (item.imagePosition) {
        const imgEl = card.querySelector('.card-image img');
        if (imgEl) imgEl.style.objectPosition = item.imagePosition;
    }

    // Click card to open article (except reaction/favorite buttons)
    win.addEventListener('click', (e) => {
        if (!e.target.closest('.card-reaction-btn') && !e.target.closest('.card-favorite-btn') && item.url) {
            window.open(item.url, '_blank');
        }
    });

    if (item.url) {
        win.style.cursor = 'pointer';
    }

    // Reaction handlers
    card.querySelector('.card-reaction-btn.positive').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'positive', card);
    });
    card.querySelector('.card-reaction-btn.neutral').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'neutral', card);
    });
    card.querySelector('.card-reaction-btn.negative').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'negative', card);
    });

    // Favorite button handler
    card.querySelector('.card-favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleFavorite(item, card);
    });

    // Submitter badge for user-submitted articles (bottom-left, mirrors reaction buttons)
    if (item.submittedBy) {
        const badge = document.createElement('div');
        badge.className = 'submitter-badge';
        badge.innerHTML = `<span class="submitter-badge-icon">✎</span> ${item.submittedBy}`;
        win.appendChild(badge);
    }

    return card;
}


// Handle reaction - saves to Firebase
function handleReaction(item, reactionType, card) {
    const itemId = getItemId(item);
    const currentUserName = getActiveUser();

    // Get current reaction from cache
    const cache = getReadStatusCache();
    const itemReactions = cache[itemId] || {};
    const currentReaction = itemReactions[currentUserName];
    const mappedCurrentReaction = currentReaction ? mapFirebaseReactionToApp(currentReaction) : null;

    // Toggle logic: if same reaction, remove it; otherwise set new one
    if (mappedCurrentReaction === reactionType) {
        // Remove reaction
        removeReactionFromFirebase(itemId, currentUserName);
    } else {
        // Set new reaction with article metadata for robustness
        const firebaseReaction = mapAppReactionToFirebase(reactionType);
        saveReactionToFirebase(itemId, currentUserName, firebaseReaction, item.title, item.author);
    }

    // UI update will happen via Firebase listener callback
}

// Handle favorite - saves to Firebase
function handleFavorite(item, card) {
    const itemId = getItemId(item);
    const currentUserName = getActiveUser();

    // Get current favorite from cache
    const userThoughts = getUserThoughts(currentUserName);
    const currentFavorite = userThoughts.favoriteArticleId;

    // Toggle logic: if already favorite, remove it; otherwise set as new favorite
    if (currentFavorite === itemId) {
        // Remove favorite
        clearFavoriteFromFirebase(currentUserName);
    } else {
        // Set new favorite
        saveFavoriteToFirebase(currentUserName, itemId);
    }

    // Update UI immediately (don't wait for Firebase callback for responsiveness)
    updateFavoriteButtonStates();
}

// Update all favorite button states based on current user's favorite
function updateFavoriteButtonStates() {
    const currentUserName = getActiveUser();
    const userThoughts = getUserThoughts(currentUserName);
    const favoriteId = userThoughts.favoriteArticleId;

    document.querySelectorAll('.scroll-card').forEach(card => {
        const cardItemId = card.dataset.itemId;
        const favBtn = card.querySelector('.card-favorite-btn');
        if (favBtn) {
            if (cardItemId === favoriteId) {
                favBtn.classList.add('active');
            } else {
                favBtn.classList.remove('active');
            }
        }
    });
}


// ==========================================
// NERD PERSONAS (including Kashvi)
// ==========================================
// Note: favorites are now pulled from Firebase userThoughts, not hardcoded
const nerds = [
    {
        id: "tanmay",
        name: "Tanmay",
        subtitle: "Reads everything, retains nothing"
    },
    {
        id: "himadri",
        name: "Himadri",
        subtitle: "Finbro"
    },
    {
        id: "avantheka",
        name: "Avantheka",
        subtitle: "Will debate you on anything"
    },
    {
        id: "cicily",
        name: "Cicily",
        subtitle: "MBG"
    },
    {
        id: "kashvi",
        name: "Kashvi",
        subtitle: "Crochet Enthusiast"
    },
    {
        id: "achyut",
        name: "Achyut",
        subtitle: "Resident Fin-Econ-(Geo)Policy Expert"
    },
    {
        id: "v1bhu",
        name: "Vibhu",
        subtitle: "Sea Link"
    },
    {
        id: "shubhangi",
        name: "Shubhangi",
        subtitle: "Laundry"
    }
];


// Helper function to get article title by ID (handles both numeric and string IDs)
function getArticleTitleById(articleId) {
    const article = getArticleById(articleId);
    return article ? article.title : null;
}

// Helper function to get full article details by ID (for navigation)
function getArticleById(articleId) {
    // Build a flat list of all articles with their IDs and category
    for (const category in data.articles) {
        for (const article of data.articles[category]) {
            const itemId = getItemId(article);
            if (itemId === articleId) {
                return { ...article, category };
            }
        }
    }

    // Also check if it's a numeric ID (legacy)
    const allArticles = [];
    for (const category in data.articles) {
        for (const article of data.articles[category]) {
            allArticles.push({ ...article, category });
        }
    }

    const numId = parseInt(articleId, 10);
    if (!isNaN(numId) && numId >= 0 && numId < allArticles.length) {
        return allArticles[numId];
    }

    return null;
}


// Get all valid item IDs from current article data
function getAllValidItemIds() {
    const validIds = new Set();
    for (const category in data.articles) {
        for (const article of data.articles[category]) {
            validIds.add(getItemId(article));
        }
    }
    return validIds;
}

// One-time cleanup: remove orphaned entries from Firebase
// Call this from browser console: cleanupOrphanedFirebaseEntries()
async function cleanupOrphanedFirebaseEntries() {
    const cache = getReadStatusCache();
    const validItemIds = getAllValidItemIds();

    const orphanedIds = Object.keys(cache).filter(id => !validItemIds.has(id));

    console.log(`Found ${orphanedIds.length} orphaned entries to remove:`);
    console.log(orphanedIds);

    if (orphanedIds.length === 0) {
        console.log('No orphaned entries to clean up!');
        return;
    }

    // Remove each orphaned entry
    for (const itemId of orphanedIds) {
        console.log(`Removing: ${itemId}`);
        await removeItemFromFirebase(itemId);
    }

    console.log('Cleanup complete! Refresh the page to see updated counts.');
}

// Get reviews for a specific nerd from Firebase (only counts current articles)
function getNerdReviews(nerdName) {
    const cache = getReadStatusCache();
    const reviews = { positive: 0, neutral: 0, negative: 0 };
    const validItemIds = getAllValidItemIds();

    for (const itemId in cache) {
        // Only count reactions for articles that currently exist
        if (!validItemIds.has(itemId)) continue;

        const itemReactions = cache[itemId];
        if (itemReactions[nerdName]) {
            const reaction = mapFirebaseReactionToApp(itemReactions[nerdName]);
            if (reviews[reaction] !== undefined) {
                reviews[reaction]++;
            }
        }
    }

    return reviews;
}

// Build nerd tiles (current user first) - full profile cards in horizontal slider
function buildNerdTiles() {
    const grid = document.getElementById('nerds-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentUserName = getActiveUser();

    // Helper to check if a user has any activity (reactions or favorite)
    const hasActivity = (nerd) => {
        const reviews = getNerdReviews(nerd.name);
        const totalReviews = reviews.positive + reviews.neutral + reviews.negative;
        const userThoughts = getUserThoughts(nerd.name);
        const hasFavorite = userThoughts.favoriteArticleId !== null && userThoughts.favoriteArticleId !== undefined;
        return totalReviews > 0 || hasFavorite;
    };

    // Sort: active users first, then blanks. Current user first within their group.
    const sorted = [...nerds].sort((a, b) => {
        const aActive = hasActivity(a);
        const bActive = hasActivity(b);
        const aIsCurrent = a.name === currentUserName;
        const bIsCurrent = b.name === currentUserName;

        // First separate by activity status
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        // Within same activity group, current user comes first
        if (aIsCurrent) return -1;
        if (bIsCurrent) return 1;

        return 0;
    });

    // Add full-size profile cards
    sorted.forEach((nerd) => {
        const card = buildFullProfileCard(nerd);
        grid.appendChild(card);
    });

    // Add registered users from Firebase (guests who self-registered)
    const regUsers = getRegisteredUsersCache();
    Object.values(regUsers).forEach((user) => {
        // Skip if already in the static nerds list
        if (nerds.some(n => n.name.toLowerCase() === user.name.toLowerCase())) return;
        const card = buildRegisteredUserCard(user);
        grid.appendChild(card);
    });

    // Always add "+" card at the end so anyone can join
    const addCard = document.createElement('div');
    addCard.className = 'nerd-profile-card add-nerd-card';
    addCard.innerHTML = `
        <div class="add-nerd-plus">+</div>
        <div class="add-nerd-label">Add yourself</div>
    `;
    addCard.addEventListener('click', () => openRegisterModal());
    grid.appendChild(addCard);
}

// Build a profile card for a Firebase-registered user (no reaction stats)
function buildRegisteredUserCard(user) {
    const card = document.createElement('div');
    card.className = 'nerd-profile-card';
    card.innerHTML = `
        <div class="profile-avatar">${user.name.charAt(0)}</div>
        <h3 class="profile-name">${user.name}</h3>
        <p class="profile-subtitle">${user.oneLiner || 'New here'}</p>
        <div class="profile-divider"></div>
        <div class="profile-section">
            <div class="profile-section-label">Reviews So Far</div>
            <div class="profile-empty-reviews">
                <div class="profile-empty-text">No reviews yet</div>
            </div>
        </div>
    `;
    return card;
}

// Build a full-size profile card (same content as the popup)
function buildFullProfileCard(nerd) {
    const card = document.createElement('div');
    card.className = 'nerd-profile-card';
    card.dataset.nerd = nerd.id;

    const reviews = getNerdReviews(nerd.name);
    const totalReviews = reviews.positive + reviews.neutral + reviews.negative;

    // Get favorite from Firebase userThoughts
    const userThoughts = getUserThoughts(nerd.name);
    const hasFavorite = userThoughts.favoriteArticleId !== null && userThoughts.favoriteArticleId !== undefined;

    // Find article details from favoriteArticleId
    let favoriteTitle = 'Not set yet';
    let favoriteArticleId = null;
    if (hasFavorite) {
        favoriteArticleId = userThoughts.favoriteArticleId;
        favoriteTitle = getArticleTitleById(favoriteArticleId) || favoriteArticleId;
    }

    card.innerHTML = `
        <div class="profile-avatar">${nerd.name.charAt(0)}</div>
        <h3 class="profile-name">${nerd.name}</h3>
        <p class="profile-subtitle">${nerd.subtitle}</p>
        <div class="profile-divider"></div>
        ${hasFavorite ? `<div class="profile-section">
            <div class="profile-section-label">Favorite Article</div>
            <div class="profile-favorite-title clickable" data-article-id="${favoriteArticleId}">${favoriteTitle}</div>
        </div>
        <div class="profile-divider"></div>` : ''}
        <div class="profile-section">
            <div class="profile-section-label">Reviews So Far</div>
            ${totalReviews === 0
            ? `<div class="profile-empty-reviews">
                    <div class="boo-container">
                        <svg width="80" height="90" viewBox="0 0 200 180" class="boo-stick-figure">
                            <text x="20" y="25" font-size="16" fill="var(--text-muted)" font-style="italic">Booooooooooo!</text>
                            <circle cx="120" cy="60" r="18" fill="none" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="78" x2="120" y2="115" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="98" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="142" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="102" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="138" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                        </svg>
                    </div>
                    <div class="profile-empty-text">No reviews yet</div>
                </div>`
            : `<div class="profile-reviews-grid">
                    <div class="profile-review-item positive">
                        <span class="profile-review-icon">✓</span>
                        <span class="profile-review-count">${reviews.positive}</span>
                        <span class="profile-review-label">Nice</span>
                    </div>
                    <div class="profile-review-item neutral">
                        <span class="profile-review-icon">—</span>
                        <span class="profile-review-count">${reviews.neutral}</span>
                        <span class="profile-review-label">Meh</span>
                    </div>
                    <div class="profile-review-item negative">
                        <span class="profile-review-icon">✗</span>
                        <span class="profile-review-count">${reviews.negative}</span>
                        <span class="profile-review-label">Nope</span>
                    </div>
                  </div>`
        }
        </div>
    `;

    // Add click handler for favorite title to navigate to article
    const favoriteEl = card.querySelector('.profile-favorite-title.clickable');
    if (favoriteEl) {
        favoriteEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const articleId = favoriteEl.dataset.articleId;
            const article = getArticleById(articleId);
            if (article && article.category) {
                // Navigate to the article's category
                openScrollView(article.category);
            }
        });
    }

    return card;
}



// Infinite scroll: when reaching edge, jump to duplicate set
function setupInfiniteScroll(grid, originalCount) {
    const tileWidth = 180 + 28; // tile width + gap
    const jumpThreshold = tileWidth * 2;
    grid.addEventListener('scroll', () => {
        const scrollLeft = grid.scrollLeft;
        const scrollWidth = grid.scrollWidth;
        const clientWidth = grid.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        const halfPoint = maxScroll / 2;

        // If scrolled past middle (into duplicates), jump back
        if (scrollLeft > halfPoint + jumpThreshold) {
            grid.scrollLeft = scrollLeft - halfPoint;
        }
        // If scrolled before start, jump to duplicates
        else if (scrollLeft < jumpThreshold && scrollLeft > 0) {
            grid.scrollLeft = scrollLeft + halfPoint;
        }
    });

    // Start in the middle (at original set)
    setTimeout(() => {
        grid.scrollLeft = 0;
    }, 100);
}


// Open nerd profile pane
function openNerdProfile(nerd) {
    const overlay = document.getElementById('profile-overlay');
    const pane = document.getElementById('profile-pane');

    const reviews = getNerdReviews(nerd.name);
    const totalReviews = reviews.positive + reviews.neutral + reviews.negative;

    // Get favorite from Firebase userThoughts
    const userThoughts = getUserThoughts(nerd.name);
    const hasFavorite = userThoughts.favoriteArticleId !== null && userThoughts.favoriteArticleId !== undefined;

    // Find article details from favoriteArticleId
    let favoriteTitle = 'Not set yet';
    let favoriteArticleId = null;
    if (hasFavorite) {
        favoriteArticleId = userThoughts.favoriteArticleId;
        // Look up the article title from the stored ID
        favoriteTitle = getArticleTitleById(favoriteArticleId) || favoriteArticleId;
    }

    pane.innerHTML = `
        <button class="profile-close" onclick="closeNerdProfile()">&times;</button>
        <div class="profile-avatar">${nerd.name.charAt(0)}</div>
        <h3 class="profile-name">${nerd.name}</h3>
        <p class="profile-subtitle">${nerd.subtitle}</p>
        <div class="profile-divider"></div>
        ${hasFavorite ? `<div class="profile-section">
            <div class="profile-section-label">Favorite Article</div>
            <div class="profile-favorite-title clickable" data-article-id="${favoriteArticleId}">${favoriteTitle}</div>
        </div>
        <div class="profile-divider"></div>` : ''}
        <div class="profile-section">

            <div class="profile-section-label">Reviews So Far</div>
            ${totalReviews === 0
            ? `<div class="profile-empty-reviews">
                    <div class="boo-container">
                        <svg width="120" height="140" viewBox="0 0 200 180" class="boo-stick-figure">
                            <text x="20" y="25" font-size="16" fill="var(--text-muted)" font-style="italic">Booooooooooo!</text>
                            <circle cx="120" cy="60" r="18" fill="none" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="78" x2="120" y2="115" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="98" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="142" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="102" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="138" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                        </svg>
                    </div>
                    <div class="profile-empty-text">No reviews yet</div>
                </div>`
            : `<div class="profile-reviews-grid">
                    <div class="profile-review-item positive">
                        <span class="profile-review-icon">✓</span>
                        <span class="profile-review-count">${reviews.positive}</span>
                        <span class="profile-review-label">Nice</span>
                    </div>
                    <div class="profile-review-item neutral">
                        <span class="profile-review-icon">—</span>
                        <span class="profile-review-count">${reviews.neutral}</span>
                        <span class="profile-review-label">Meh</span>
                    </div>
                    <div class="profile-review-item negative">
                        <span class="profile-review-icon">✗</span>
                        <span class="profile-review-count">${reviews.negative}</span>
                        <span class="profile-review-label">Nope</span>
                    </div>
                  </div>`
        }
        </div>
    `;

    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Add click handler for favorite title to navigate to article
    const favoriteEl = pane.querySelector('.profile-favorite-title.clickable');
    if (favoriteEl) {
        favoriteEl.addEventListener('click', () => {
            const articleId = favoriteEl.dataset.articleId;
            const article = getArticleById(articleId);
            if (article && article.category) {
                closeNerdProfile();
                // Navigate to the article's category
                setTimeout(() => {
                    openScrollView(article.category);
                }, 350); // Wait for profile close animation

            }
        });
    }
}


// Close nerd profile pane
function closeNerdProfile() {
    const overlay = document.getElementById('profile-overlay');
    overlay.classList.remove('active');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

// ==========================================
// SCROLL-AWARE CORNER BUTTON
// ==========================================
function setupCornerNav() {
    const pillarsPage = document.getElementById('pillars-page');
    const btn = document.getElementById('corner-nav-btn');
    const nerdsSection = document.getElementById('nerds-section');
    if (!btn || !pillarsPage || !nerdsSection) return;

    let isAtNerds = false;

    function updateButton() {
        const scrollTop = pillarsPage.scrollTop;
        const threshold = nerdsSection.offsetTop - window.innerHeight * 0.5;
        const nowAtNerds = scrollTop > threshold;

        if (nowAtNerds !== isAtNerds) {
            isAtNerds = nowAtNerds;
            const textEl = btn.querySelector('.corner-nav-text');
            const arrowEl = btn.querySelector('.corner-nav-arrow');

            if (isAtNerds) {
                textEl.textContent = 'Back to articles';
                arrowEl.style.transform = 'rotate(180deg)';
            } else {
                textEl.textContent = 'Meet the other nerds';
                arrowEl.style.transform = 'rotate(0deg)';
            }
        }
    }

    pillarsPage.addEventListener('scroll', updateButton);

    btn.addEventListener('click', () => {
        if (isAtNerds) {
            pillarsPage.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            nerdsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Close profile on backdrop click
function setupProfileOverlay() {
    const overlay = document.getElementById('profile-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNerdProfile();
        }
    });
}

// Initialize counts on landing page
function updateCounts() {
    let articleCount = 0;
    for (const category in data.articles) {
        articleCount += data.articles[category].length;
    }
    document.getElementById('articles-count').textContent = articleCount;
}

// Update greeting with current user name
function updateGreeting() {
    const greetingEl = document.getElementById('pillars-greeting');
    const hintEl = document.getElementById('pillars-guest-hint');
    if (greetingEl) {
        const uid = getActiveUser();
        const name = getUserDisplayName(uid);
        if (name === 'Guest User') {
            greetingEl.textContent = 'Welcome, Guest User';
            if (hintEl) hintEl.textContent = 'Feel free to create an account!';
        } else {
            greetingEl.textContent = `Hi ${name}`;
            if (hintEl) hintEl.textContent = '';
        }
    }
    updateLoginButton();
}

// Callback when Firebase data updates - update button states in-place to preserve scroll
function onFirebaseDataUpdate(data) {
    if (currentCategoryKey && !document.getElementById('scroll-page').classList.contains('hidden')) {
        updateReactionButtonStates();
        // Refresh reaction pane with latest Firebase data
        if (currentPanelItem) {
            const oldPane = document.querySelector('.reaction-pane');
            if (oldPane) {
                const newPane = buildReactionPane(currentPanelItem);
                newPane.style.width = oldPane.style.width;
                oldPane.replaceWith(newPane);
            }
        }
    }
    buildNerdTiles();
}

// Update reaction button states without re-rendering the entire view
function updateReactionButtonStates() {
    const container = document.getElementById('scroll-main');
    if (!container) return;

    const cards = container.querySelectorAll('.scroll-card');
    const cache = getReadStatusCache();
    const currentUserName = getActiveUser();

    cards.forEach(card => {
        // Get item ID from card's data attribute (set in buildScrollCard)
        const itemId = card.dataset.itemId;
        if (!itemId) return;

        // Get current reaction for this user
        const itemReactions = cache[itemId] || {};
        const userReaction = itemReactions[currentUserName];
        const mappedReaction = userReaction ? mapFirebaseReactionToApp(userReaction) : null;

        // Update button states
        const btns = card.querySelectorAll('.card-reaction-btn');
        btns.forEach(btn => {
            btn.classList.remove('active');
            if (mappedReaction) {
                if (btn.classList.contains(mappedReaction)) {
                    btn.classList.add('active');
                }
            }
        });
    });
}

// ============================================
// About Panel
// ============================================
function toggleAbout() {
    const panel = document.getElementById('about-panel');
    const toggleBtn = document.getElementById('about-toggle-btn');
    if (!panel) return;
    const isCollapsed = panel.classList.toggle('collapsed');
    if (toggleBtn) toggleBtn.classList.toggle('visible', isCollapsed);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCounts();
    updateGreeting();
    buildNerdTiles();
    setupCornerNav();
    setupProfileOverlay();

    // About panel: start open on desktop, collapsed on mobile
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
        const panel = document.getElementById('about-panel');
        const toggleBtn = document.getElementById('about-toggle-btn');
        if (panel) panel.classList.add('collapsed');
        if (toggleBtn) toggleBtn.classList.add('visible');
    }

    // Start preloading all images immediately (before user clicks anything)
    preloadAllImages();

    // Initialize Firebase listeners
    initReadStatusListener(onFirebaseDataUpdate);
    initUserThoughtsListener(buildNerdTiles); // Load favorites from Firebase
    subscribeToRegisteredUsers(buildNerdTiles); // Load registered guest users
    subscribeToUserSubmissions(() => {           // Load user-submitted articles
        buildPillars(); // refresh count on the landing pillar
        if (currentCategoryKey) renderScrollCards(currentCategoryKey);
    });
});


// ========================================
// MODAL SYSTEM
// ========================================
function openModal(html, onSubmit) {
    const overlay = document.getElementById('modal-overlay');
    const box = document.getElementById('modal-box');
    box.innerHTML = html;
    overlay.classList.remove('hidden');
    // Focus first input
    setTimeout(() => { const inp = box.querySelector('input, textarea'); if (inp) inp.focus(); }, 50);
    if (onSubmit) {
        const form = box.querySelector('form');
        if (form) form.addEventListener('submit', function(e) { e.preventDefault(); onSubmit(e); });
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-box').innerHTML = '';
}

function handleModalOverlayClick(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ========================================
// LOGIN MODAL
// ========================================
function openLoginModal() {
    openModal(`
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-title">Login</div>
        <div class="modal-subtitle">Enter your name to log in to your profile</div>
        <form id="login-form">
            <div class="modal-field">
                <label>Your name</label>
                <input type="text" id="login-name" placeholder="e.g. Tanmay" required autocomplete="off" />
            </div>
            <div id="login-error" class="modal-error" style="display:none"></div>
            <button type="submit" class="modal-submit-btn">Log In</button>
        </form>
    `);

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        if (!name) return;
        setSavedLogin(name);
        closeModal();
        updateGreeting();
        buildNerdTiles();
    });
}

// ========================================
// REGISTER MODAL ("+" card in nerds)
// ========================================
function openRegisterModal() {
    openModal(`
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-title">Add yourself</div>
        <div class="modal-callout">Your name here becomes your login — type it on any device to find your profile.</div>
        <form id="register-form">
            <div class="modal-field">
                <label>Name <span style="color:#c0392b">*</span></label>
                <input type="text" id="reg-name" placeholder="What should we call you?" required autocomplete="off" />
            </div>
            <div class="modal-field">
                <label>One-liner <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
                <input type="text" id="reg-subtitle" placeholder="e.g. Finbro / Crochet Enthusiast" />
            </div>
            <div id="reg-error" class="modal-error" style="display:none"></div>
            <button type="submit" class="modal-submit-btn" id="reg-submit">Join</button>
        </form>
    `);

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const subtitle = document.getElementById('reg-subtitle').value.trim();
        const errEl = document.getElementById('reg-error');
        const btn = document.getElementById('reg-submit');
        if (!name) return;

        btn.disabled = true;
        btn.textContent = 'Joining...';

        saveUserRegistration(name, subtitle)
            .then(function() {
                setSavedLogin(name);
                closeModal();
                updateGreeting();
                buildNerdTiles();
            })
            .catch(function(err) {
                errEl.textContent = 'Something went wrong. Try again.';
                errEl.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Join';
            });
    });
}

// ========================================
// SUBMIT ARTICLE MODAL
// ========================================
function openSubmitArticleModal(categoryKey) {
    const catName = categoryNames[categoryKey] || categoryKey;
    openModal(`
        <button class="modal-close" onclick="closeModal()">×</button>
        <div class="modal-title">Add an article to ${catName}</div>
        <div class="modal-subtitle">Only the link is required.</div>
        <form id="submit-form">
            <div class="modal-field">
                <label>Link <span style="color:#c0392b">*</span></label>
                <input type="url" id="sub-url" placeholder="https://..." required />
            </div>
            <div class="modal-field">
                <label>Title <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
                <input type="text" id="sub-title" placeholder="Leave blank to use URL" />
            </div>
            <div class="modal-field">
                <label>Why it's worth reading <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
                <textarea id="sub-desc" placeholder="Your take on it..."></textarea>
            </div>
            <div class="modal-field">
                <label>Image <span style="color:var(--text-muted);font-weight:400">(optional, max 10MB)</span></label>
                <input type="file" id="sub-image" accept="image/*" />
                <div class="field-hint">Wide images work best. If none, a placeholder will be used.</div>
            </div>
            <div id="sub-error" class="modal-error" style="display:none"></div>
            <button type="submit" class="modal-submit-btn" id="sub-submit">Add Article</button>
        </form>
    `);

    document.getElementById('submit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const url = document.getElementById('sub-url').value.trim();
        const title = document.getElementById('sub-title').value.trim();
        const desc = document.getElementById('sub-desc').value.trim();
        const imageFile = document.getElementById('sub-image').files[0];
        const errEl = document.getElementById('sub-error');
        const btn = document.getElementById('sub-submit');

        if (!url) return;

        // Validate URL
        try { new URL(url); } catch {
            errEl.textContent = 'Please enter a valid URL.';
            errEl.style.display = 'block';
            return;
        }

        // Validate image size
        if (imageFile && imageFile.size > 10 * 1024 * 1024) {
            errEl.textContent = 'Image must be under 10MB.';
            errEl.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.textContent = imageFile ? 'Uploading image...' : 'Adding...';
        errEl.style.display = 'none';

        const submittedBy = getSubmitterLabel();
        const submissionId = 'usub-' + Date.now();

        const doSave = function(imageUrl) {
            return saveUserSubmission({
                id: submissionId,
                title: title || url,
                url: url,
                description: desc,
                image: imageUrl || null,
                imageUrl: imageUrl || null, // kept for compat
                submittedBy: submittedBy,
                category: categoryKey,
                userSubmitted: true,
                submittedAt: Date.now(),
            });
        };

        const finish = function() {
            closeModal();
            // Re-render sidebar if this category is currently open
            if (currentCategoryKey === categoryKey) {
                const activeItem = document.querySelector('.sidebar-article-item.active');
                const activeTitle = activeItem ? activeItem.querySelector('.sidebar-article-title').textContent : null;
                renderScrollCards(categoryKey);
                // Try to re-select the previously active article
                if (activeTitle) {
                    document.querySelectorAll('.sidebar-article-item').forEach(el => {
                        if (el.querySelector('.sidebar-article-title').textContent === activeTitle) {
                            el.classList.add('active');
                        }
                    });
                }
            }
        };

        if (imageFile) {
            uploadImageToStorage(imageFile, submissionId)
                .then(function(imageUrl) {
                    btn.textContent = 'Saving...';
                    return doSave(imageUrl);
                })
                .then(finish)
                .catch(function(err) {
                    console.error('Upload error:', err);
                    // If storage upload fails (e.g., rules not set), save without image
                    if (err.code === 'storage/unauthorized') {
                        errEl.textContent = 'Image upload requires Firebase Storage rules to be set to public. Saving without image.';
                        errEl.style.display = 'block';
                        return doSave(null).then(finish);
                    }
                    errEl.textContent = 'Upload failed: ' + (err.message || 'Unknown error');
                    errEl.style.display = 'block';
                    btn.disabled = false;
                    btn.textContent = 'Add Article';
                });
        } else {
            doSave(null).then(finish).catch(function(err) {
                errEl.textContent = 'Failed to save. Try again.';
                errEl.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Add Article';
            });
        }
    });
}
