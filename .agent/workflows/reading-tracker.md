---
description: Working on the Reading Tracker web application
---

# Reading Tracker Workflow

## Before Making Any Changes

// turbo
1. Read `ARCHITECTURE.md` in the project root - it contains critical invariants and context

## Key Rules

2. **Never change article `id` fields** - this orphans Firebase data
3. **Never hardcode user stats** - fetch live data instead
4. User names are case-sensitive: Tanmay, Himadri, Avantheka, Cicily, Kashvi, Achyut, Vibhu

## After Making Changes

5. If you modified code structure, functions, or data models → update `ARCHITECTURE.md`
6. Add entry to the Changelog section at the bottom of `ARCHITECTURE.md`
7. Commit and push to trigger Vercel deployment

## Getting Current User Stats

Run in browser console on the live site or localhost:
```javascript
['Tanmay', 'Cicily', 'Avantheka', 'Himadri', 'Kashvi'].forEach(name => {
    const r = getNerdReviews(name);
    const t = getUserThoughts(name);
    console.log(`${name}: ${r.positive}👍 ${r.neutral}😐 ${r.negative}👎 | Fav: ${t.favoriteArticleId || 'none'}`);
});
```
