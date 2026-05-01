# Reading Archive — Agent Notes (config-8)

Personal reading-tracker web app. Vanilla JS + Firebase Realtime Database, no build step. Deployed to Vercel from GitHub.

**Live URL:** https://reading-tracker-config8.vercel.app  
**Analytics dashboard:** https://reading-tracker-config8.vercel.app/analytics.html?u=curator_x7z9q  
**GitHub:** https://github.com/JarvisOutHere/readlist-tracker (branch: `config-8`)

---

## Repository layout

One git repo, multiple branches/worktrees. `config-8` is the variant with the full analytics dashboard.

| Branch     | Worktree path                                                | Port  |
| ---------- | ------------------------------------------------------------ | ----- |
| `config-1` | `/Users/Tanmay/Documents/AG/reading-tracker-config1`         | 8081  |
| `config-2` | `/Users/Tanmay/Documents/AG/reading-tracker`                 | 8080  |
| `config-3` | `/Users/Tanmay/Documents/AG/reading-tracker-config3`         | 8082  |
| `config-4` | `/Users/Tanmay/Documents/AG/reading-tracker-config4`         | 8083  |
| `config-5` | `/Users/Tanmay/Documents/AG/reading-tracker-config5`         | 8084  |
| `config-6` | `/Users/Tanmay/Documents/AG/reading-tracker-config6`         | 8085  |
| `config-8` | `/Users/Tanmay/Documents/AG/reading-tracker-config8`         | —     |

Config-2 is the canonical "main" variant — split-pane with reaction column. Config-8 is based on config-2 and adds the analytics dashboard, event tracking, article deletion for Tanmay, and anonymous visitor labelling.

**`git worktree` rule:** never check out a branch that's already active in another worktree.

---

## Files in this repo (config-8 specific additions in bold)

| File | Purpose |
|------|---------|
| `index.html` | Entry point |
| `app.js` | Article data, all main UI logic |
| `firebase-config.js` | Firebase init, all listeners, local caches |
| `styles.css` | All main app styling |
| **`analytics.html`** | Curator analytics dashboard |
| **`analytics.js`** | All dashboard logic (self-contained IIFE) |
| **`analytics.css`** | Dashboard-only styles |
| **`vercel.json`** | Cache headers (images 1yr, JS/CSS 1d SWR, HTML no-cache) |
| `ARCHITECTURE.md` | Deeper codebase reference |
| `CLAUDE.md` | This file |

---

## Article data invariants

`data.articles` in `app.js` is the source of truth. Each article has a stable `id` field — **never rename an id**, reactions in Firebase are keyed on it.

```javascript
{
    id: "stable-id-never-changes",  // IMMUTABLE — orphans Firebase data if changed
    title: "...",
    author: "...",
    description: "...",
    url: "https://...",
    image: "images/filename.png",   // optional
    layout: "horizontal"            // optional — see below
}
```

Layout options:
- `"horizontal"` — landscape image left, text right (250px text panel)
- `"horizontal-square"` — same, expects square image
- `"horizontal-4-3"` — 4:3 card, 280px text panel
- omit — vertical (image top, text below)

When adding images: drop file in `images/`, reference as `image: "images/..."`.

---

## Firebase

**Project:** `readlist-tracker`  
**Database URL:** `https://readlist-tracker-default-rtdb.firebaseio.com`  
**Console:** https://console.firebase.google.com/project/readlist-tracker/database/readlist-tracker-default-rtdb/data  
**Owner account:** `noobtwo222@gmail.com`

### Database shape

```
readStatus/
  {articleId}/
    {userName}/                         # e.g. "Tanmay"
      reaction: "liked"|"neutral"|"disliked"
      title, author, updatedAt
      # NOTE: some legacy entries are bare strings ("liked"), not objects.
      # Use normalizeReaction(v) in analytics.js or mapFirebaseReactionToApp() in app.js.

userThoughts/
  {userName}/
    favoriteArticleId: "..."
    thoughts: "..."
    updatedAt: ...

registeredUsers/
  {userName}/
    name, oneLiner, joinedAt, ...

userSubmissions/
  {pushId}/
    title, url, category, submittedBy, submittedAt

hiddenArticles/                         # Soft-deleted static articles (Tanmay only)
  {articleId}: true

anonLabels/                             # Curator-assigned display names for anon visitors
  {anonKey}: "A" | "B" | "Himadri's phone" | ...

analytics/
  events/
    {YYYY-MM-DD}/
      {pushId}/
        ts: <unix ms>
        ev: "page_view"|"catalog_enter"|"category_view"|"article_open"|
            "reaction_set"|"reaction_remove"|"user_register"|"article_submit"
        u:  "Tanmay" | "anon-<uuid>"   # max 16 chars
        dev: "m" | "d"                 # mobile / desktop (added May 2026 — old events lack this)
        tz: "Asia/Calcutta"            # IANA timezone
        city: "Mumbai"                 # from ipinfo.io (added May 2026 — old events lack this)
        country: "IN"
        d: { ... }                     # event-specific payload (id, title, cat, r, etc.)
```

### Legacy reaction format

Old reactions were written as bare strings: `database.ref('readStatus/articleId/Tanmay').set('liked')`. New ones are objects `{ reaction: 'liked', title: '...', updatedAt: ... }`. Always normalise:

```javascript
// analytics.js
function normalizeReaction(v) {
    if (!v) return null;
    if (typeof v === 'string') return v;
    return v.reaction || null;
}

// app.js
function mapFirebaseReactionToApp(firebaseData) {
    const rv = typeof firebaseData === 'object' ? firebaseData.reaction : firebaseData;
    return { liked: 'positive', neutral: 'neutral', disliked: 'negative', positive: 'positive', negative: 'negative' }[rv] || rv;
}
```

### Reading data via REST (no auth)

```bash
# All reactions
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus.json" | python3 -m json.tool

# Analytics events for a single day
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/analytics/events/2026-05-01.json" | python3 -m json.tool

# All anon labels
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/anonLabels.json"

# Hidden articles
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/hiddenArticles.json"
```

### Security rules

```json
{"rules":{".read":true,".write":true}}
```

**No expiration — keep it this way.** Firebase default rules expire in 30 days and silently return permission-denied (looks like a frontend bug). History: rules expired Feb 2026, app silently failed for ~2 months. If reactions ever stop syncing, check the Rules tab first.

---

## Users / magic link tokens

Defined in `firebase-config.js`. Auth via `?u=<token>` — no real auth, tokens are just identifiers.

| User      | Token    |
| --------- | -------- |
| Tanmay    | `t9m4x` (or `tanmay`) |
| Avantheka | `a6t3v`  |
| Cicily    | `c4w8j`  |
| Himadri   | `h5d2m`  |
| Kashvi    | `k7v9f`  |
| Achyut    | `y3m8q`  |
| Vibhu     | `v1bhu`  |
| Shubhangi | `s8h4n`  |
| Guest     | `guest`  |
| Curator (Tanmay, admin) | `curator_x7z9q` |

Anonymous visitors who haven't used a token get a persistent key stored in `localStorage.readingArchive_anonKey` (`anon-<uuid>`). Same browser = same key across visits; incognito / different device = new key.

---

## Analytics dashboard

Accessed at `analytics.html?u=curator_x7z9q`. Token check is the first thing in `analytics.js` — wrong token renders the auth gate and halts execution.

### What's on the dashboard

| Section | Source |
|---------|--------|
| Stats cards (7) | allEvents + readStatus + registeredUsers |
| 30-day activity bar chart | allEvents grouped by day |
| Top Articles by Opens | allEvents `article_open` events; each row has ▶ expand to see per-user breakdown |
| Category doughnut | allEvents `category_view` events |
| Reactions by Article | readStatus |
| Registered Users | registeredUsers |
| User Submissions | userSubmissions |
| Recent Activity feed | allEvents, live via `child_added`, filterable by user + device |
| Name Anonymous Visitors | anonLabels; auto-labelled A, B, C… on every load |
| Event Breakdown | allEvents grouped by type |

### Auto-labelling anons

On every dashboard load, `autoLabelAll(false)` silently assigns sequential letters (A→Z, A1→Z1, …) ordered by first-seen timestamp to any unlabelled anon IDs. Idempotent — already-labelled IDs are skipped. The "Auto-label all" button calls `autoLabelAll(true)` (same logic, shows alerts). Labels live in `anonLabels/` and are picked up by `setupAnonLabelsListener()` which refreshes the feed and dropdown.

### Live feed

`setupLiveFeed()` uses `child_added` on today's event path. New events push into `allEvents` and call `renderRecentFeed()`. The feed shows city as inline text (`ev.city`), device as emoji (`ev.dev === 'm' ? '📱' : '💻'`), and the user's label (from `anonLabels`). Hover tooltip shows raw anon ID + timezone.

### Expand rows in Top Articles

Each row has `data-idx` on the button and `data-expand` on the paired hidden `<tr>`. Click handler finds the expand row via `el.querySelector('.expand-row[data-expand="${idx}"]')` — **do not revert to `nextElementSibling`**, it's unreliable across table row boundaries. Breakdown rendered lazily on first expand via `buildUserOpensBreakdown(row)`.

---

## Event tracking (`trackEvent` in app.js)

```javascript
// Schema: analytics/events/{YYYY-MM-DD}/{pushId}
trackEvent('page_view',       { ref: '...' });
trackEvent('catalog_enter',   null);
trackEvent('category_view',   { cat: 'ai' });
trackEvent('article_open',    { id: '...', title: '...', cat: '...' });
trackEvent('reaction_set',    { id: '...', r: 'liked', title: '...' });
trackEvent('reaction_remove', { id: '...', r: 'liked' });
trackEvent('user_register',   { name: '...' });
trackEvent('article_submit',  { cat: '...', by: '...' });
```

`trackEvent` is fire-and-forget; all errors are swallowed. `dev` (`m`/`d`) and `tz` are always injected. `city`/`country` come from `_geoCache` (see below).

---

## Geo location (`_geoCache` in app.js)

```javascript
// fetchGeoAsync() is called at DOMContentLoaded before trackEvent('page_view')
// - checks localStorage 'ra_geo' (24h TTL) first — instant city on return visits
// - otherwise fires fetch('https://ipinfo.io/json') fire-and-forget
// - result: { city: "Mumbai", country: "IN" } stored in _geoCache + localStorage
// - trackEvent() reads _geoCache at the moment it fires
```

**First visit:** `page_view` may lack city (fetch hasn't returned yet). All later events in the same session will have it once ipinfo.io responds (~100–500ms).  
**Return visits:** `ra_geo` localStorage hit means city is available before `page_view` fires.  
**Old events** (before May 2026): `city` and `country` are `null`. The anon labels table and feed handle this gracefully.

ipinfo.io free tier: 50k requests/month, CORS-enabled, no API key needed.

---

## Article deletion (Tanmay only)

When `getActiveUser() === 'Tanmay'`, each sidebar article item shows a `×` delete button (`.sidebar-delete-btn`, visible on hover, always-faint on mobile). Clicking opens a confirmation modal via `confirmDeleteArticle(item)`.

- **Static articles** (from `data.articles`) → `hideArticleInFirebase(articleId)` writes `hiddenArticles/{id}: true`
- **User submissions** (from Firebase) → `deleteUserSubmissionFromFirebase(submissionId)` calls `.remove()` on `userSubmissions/{id}`

Hidden articles are filtered in `renderScrollCards()` using `getHiddenArticlesCache()`. `buildPillars()` also excludes hidden articles from the pillar count. Unhiding requires a manual Firebase console write (delete the key from `hiddenArticles/`).

---

## Reaction pane display

In `buildReactionPane()` (app.js), anonymous users in each reaction bucket (Nice / Meh / Absolutely Not) are collapsed into a single **"Anonymous ×N"** entry rather than listed individually. Named users always show individually.

```javascript
// Example output: Tanmay, Himadri, Anonymous ×3
const anonCount = names.length - namedCount;
if (anonCount > 1) parts.push('Anonymous ×' + anonCount);
```

---

## Connection resilience (firebase-config.js)

Three layers to keep the WebSocket alive indefinitely:
1. `keepSynced(true)` on `readStatus` and `userThoughts`
2. `goOffline()/goOnline()` on tab visibility change and network `online` event
3. `.info/serverTimeOffset` ping every 4 minutes

Debug from DevTools:
```js
firebaseDebug.isConnected()   // bool
firebaseDebug.reconnect()     // force reconnect
firebaseDebug.db              // raw database ref
```

---

## Cache headers (vercel.json)

| Path | Cache-Control |
|------|---------------|
| `/images/**` | `public, max-age=31536000, immutable` |
| `/*.js` | `public, max-age=86400, stale-while-revalidate=604800` |
| `/*.css` | same |
| `/*.html`, `/` | `public, max-age=0, must-revalidate` |

---

## Common gotchas

- **`data.articles.id` is immutable** — changing it orphans all reactions.
- **Legacy reaction format** — some Firebase entries are bare strings, not objects. Always use `normalizeReaction()` / `mapFirebaseReactionToApp()`.
- **Expand rows use `data-expand` attribute** — `nextElementSibling` on `<tr>` is unreliable in browsers.
- **Device filter shows 0 counts for old events** — events before May 2026 lack `dev` field. This is a data gap, not a bug.
- **City only appears on new events** — `city` field added May 2026. Old events have `null`.
- **Firebase rules expire** — default rules have a 30-day expiry. Keep them as `{".read":true,".write":true}` with no expiry clause.
- **Don't commit `.env` or service-account JSONs** — the public web config in `firebase-config.js` is fine.
