# Reading Tracker Architecture

> [!CAUTION]
> **ANY LLM INSTANCE MUST READ THIS FILE BEFORE MAKING CHANGES TO THIS CODEBASE.**
> This documentation prevents data loss and preserves context across LLM session resets.

---

## Update Policy

| Content Type | How Often to Update |
|--------------|---------------------|
| Code structure, functions, invariants | When code changes |
| User data (reviews, favorites) | **Never hardcode** - always fetch live from Firebase |
| Article list | When articles are added/removed |

---

## Quick Reference

| Item | Value |
|------|-------|
| **Live URL** | https://readlist-tracker.vercel.app |
| **GitHub** | https://github.com/JarvisOutHere/readlist-tracker |
| **Deploy** | Auto on push to `main` (Vercel) |
| **Firebase Project** | `readingtracker-ai` |

---

## Critical Invariants

> [!WARNING]
> Breaking these will cause data loss or corruption:

### 1. Article IDs are IMMUTABLE
```javascript
// Each article has a permanent 'id' field
{
    id: "compared-to-what-adam-golding",  // NEVER CHANGE THIS
    title: "Compared to What?",           // Can edit freely
    author: "Adam Golding"                // Can edit freely
}
```
Changing an `id` orphans all Firebase reactions stored under that ID.

### 2. Firebase Paths are Locked
```
readStatus/{articleId}/{userName}    → Stores reactions
userThoughts/{userName}              → Stores favorites
```

### 3. User Names are Case-Sensitive
`"Tanmay"` ≠ `"tanmay"` in Firebase. The exact names are:
- Tanmay, Himadri, Avantheka, Cicily, Kashvi, Achyut, Vibhu

### 4. getItemId() Logic Must Not Change
```javascript
function getItemId(item) {
    if (item.id) return item.id;  // Use stable ID (preferred)
    return `${item.title}-${item.author}`  // Legacy fallback
        .replace(/[.$#\[\]\/\:?]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}
```

---

## Architecture Overview

### Application Flow
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  Landing    │ ──▶  │   Pillars    │ ──▶  │   Scroll    │
│  Page       │      │   View       │      │   View      │
└─────────────┘      └──────────────┘      └─────────────┘
       │                    │                     │
       │                    │                     ▼
       │                    │              ┌─────────────┐
       │                    │              │  Article    │
       │                    │              │  Cards      │
       │                    │              └─────────────┘
       │                    │                     │
       ▼                    ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│              "Say Hi to Others" Section                 │
│         (Horizontal slider of profile cards)            │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
┌──────────────────┐         ┌─────────────────────┐
│  Firebase RTDB   │ ──────▶ │  Local Caches       │
│  (Source of      │         │  - readStatusCache  │
│   Truth)         │         │  - userThoughtsCache│
└──────────────────┘         └─────────────────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │  UI Renders from    │
                            │  Cached Data        │
                            └─────────────────────┘
```

---

## File Structure

| File | Purpose | Lines |
|------|---------|-------|
| `app.js` | Main logic, article data, UI rendering | ~1200 |
| `firebase-config.js` | Firebase init, listeners, caching | ~210 |
| `styles.css` | All styling (dark theme, glassmorphism) | ~1100 |
| `index.html` | Entry point, minimal HTML structure | ~80 |
| `ARCHITECTURE.md` | This file | - |

---

## Data Models

### Article Object (in `app.js`)
```javascript
{
    id: "stable-id-never-changes",     // REQUIRED - Stable Firebase key
    title: "Article Title",             // Display name (editable)
    author: "Author Name",              // Display author (editable)
    description: "Summary text...",     // Card description
    url: "https://...",                 // Link to article
    image: "images/filename.png",       // Optional - card image
    imageBg: "#f5f4f0",                 // Optional - image background
    layout: "horizontal"                // Optional - "horizontal" or "horizontal-square"
}
```

### Firebase: readStatus/{articleId}/{userName}
```json
{
    "reaction": "liked" | "neutral" | "disliked",
    "timestamp": 1234567890,
    "title": "Article Title (for debugging)"
}
```

### Firebase: userThoughts/{userName}
```json
{
    "favoriteArticleId": "article-stable-id",
    "updatedAt": 1234567890
}
```

---

## Categories

| Key | Display Name | Description |
|-----|--------------|-------------|
| `interesting-businesses` | Interesting Businesses | Company deep-dives, startup stories |
| `ai` | AI | AI safety, agents, forecasts |
| `intrapersonal` | Intrapersonal | Self-improvement, philosophy |
| `fin-econ-geopolity` | Fin-Econ-(Geo)Polity | Economics, geopolitics |
| `food-for-thought` | Food for Thought | Miscellaneous insights |
| `user-submissions` | User Submissions | Articles submitted by users (inverted color pillar) |

### Pillar Layout
- First 5 categories display in standard beige/white style
- User Submissions is always the 6th (rightmost) pillar with inverted colors (brown background, beige text)
- First two categories are fixed; middle three are randomized on each load
- Pillar height is proportional to article count (40%-90% range)
- Empty categories (0 articles) render as a minimal horizontal line at the bottom (2% height)

---

## Key Functions

### Core Data Functions (app.js)

| Function | Purpose |
|----------|---------|
| `getItemId(item)` | Returns stable `id` or generates legacy ID |
| `getAllValidItemIds()` | Returns Set of all current article IDs |
| `getNerdReviews(name)` | Counts Nice/Meh/Nope for a user |
| `getUserThoughts(name)` | Gets favorite article from cache |
| `getArticleTitleById(id)` | Looks up article title from ID |

### UI Functions (app.js)

| Function | Purpose |
|----------|---------|
| `showLanding()` | Show landing page |
| `enterCatalog()` | Navigate to pillars view |
| `openScrollView(categoryKey)` | Open article scroll for category |
| `buildNerdTiles()` | Render profile cards (active users first, then blanks; current user first in their group) |
| `renderScrollCards(categoryKey)` | Render article cards |

### Firebase Functions (firebase-config.js)

| Function | Purpose |
|----------|---------|
| `initReadStatusListener(callback)` | Subscribe to reaction updates |
| `initUserThoughtsListener(callback)` | Subscribe to favorites updates |
| `getReadStatusCache()` | Get cached reactions |
| `setReaction(itemId, userName, reaction)` | Save reaction to Firebase |
| `setFavoriteArticle(userName, articleId)` | Save favorite to Firebase |

### Critical Callbacks

```javascript
// Called when Firebase data updates - rebuilds UI
function onFirebaseDataUpdate(data) {
    updateReactionButtonStates();
    buildNerdTiles();  // IMPORTANT: Rebuilds profile cards
}

// Initialize with callback to rebuild tiles after data loads
initUserThoughtsListener(buildNerdTiles);
```

---

## Users

The app has 8 registered users. **Do not hardcode their stats** - they change as people use the live site.

| Name | Subtitle | Avatar |
|------|----------|--------|
| Tanmay | "Reads everything, retains nothing" | T |
| Himadri | "Finbro" | H |
| Avantheka | "Will debate you on anything" | A |
| Cicily | "MBG" | C |
| Kashvi | "Crochet Enthusiast" | K |
| Achyut | "Resident Fin-Econ-(Geo)Policy Expert" | A |
| Vibhu | "Sea Link" | V |
| Shubhangi | "Laundry" | S |

### How to Get Current User Stats

Run this in browser console on the live site:
```javascript
['Tanmay', 'Cicily', 'Avantheka', 'Himadri', 'Kashvi'].forEach(name => {
    const r = getNerdReviews(name);
    const t = getUserThoughts(name);
    console.log(`${name}: ${r.positive}👍 ${r.neutral}😐 ${r.negative}👎 | Fav: ${t.favoriteArticleId || 'none'}`);
});
```

---

## Adding New Articles

1. **Generate stable ID**: `title-author` in lowercase, hyphens for spaces
   ```
   "My Article" by "John Doe" → "my-article-john-doe"
   ```

2. **Add to correct category** in `data.articles`:
   ```javascript
   {
       id: "my-article-john-doe",  // MUST BE FIRST
       title: "My Article",
       author: "John Doe",
       description: "...",
       url: "https://..."
   }
   ```

3. **Never reuse an existing ID**

---

## Common Issues & Fixes

### "Reviews not showing on profile cards"
- **Cause**: Race condition - cards rendered before Firebase loaded
- **Fix**: `buildNerdTiles()` is called in `onFirebaseDataUpdate()` and after `initUserThoughtsListener()`

### "Favorite article shows wrong title"
- **Cause**: `favoriteArticleId` in Firebase doesn't match any article's `id`
- **Fix**: Check `userThoughtsCache` for the stored ID, verify it exists in current articles

### "Article reactions disappeared after editing"
- **Cause**: Article `id` was changed (or removed), orphaning Firebase data
- **Fix**: Find the old ID in Firebase, update article to use that ID

### "Page scrolls to top when clicking reaction"
- **Cause**: UI re-renders on data update
- **Fix**: `updateReactionButtonStates()` updates in-place without re-rendering cards

---

## Gotchas & Edge Cases

1. **Special characters in IDs**: Some articles have IDs with:
   - Apostrophes: `the-puzzle-of-pakistan's-poverty-rohit-shinde`
   - Diacritics: `the-böckenförde-dilemma-jason-zhao`

2. **Fallback ID generation**: If an article lacks `id` field, `getItemId()` generates one from title-author. This is legacy support only.

3. **Kashvi data backup**: Kashvi was removed from visible UI but data exists in Firebase.

4. **Firebase mapping**: `"liked"` (Firebase) = `"positive"` (app), `"disliked"` = `"negative"`

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-12 | Added 6th pillar "User Submissions" with inverted colors |
| 2026-02-12 | Added Shubhangi as new user with magic link |
| 2026-02-12 | Sort nerd tiles: active users first, then blanks (current user first in their group) |
| 2026-02-06 | Added stable `id` field to all 25 articles |
| 2026-02-06 | Created ARCHITECTURE.md |
| 2026-02-05 | Fixed race condition for profile card stats |
| 2026-02-05 | Implemented horizontal slider for profile cards |
