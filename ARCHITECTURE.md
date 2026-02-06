# Reading Tracker Architecture

> [!CAUTION]
> **ANY LLM INSTANCE MUST READ THIS FILE BEFORE MAKING CHANGES TO THIS CODEBASE.**
> This documentation exists to prevent data loss and ensure context preservation across LLM session resets.

## Overview

The Reading Tracker is a single-page web application for curating and sharing reading recommendations. Users can browse articles, react to them (Nice/Meh/Nope), and set favorite articles.

## Critical Invariants

> [!WARNING]
> Never change these without understanding the consequences:

1. **Article IDs are STABLE** - Each article has a permanent `id` field that MUST NOT change. Changing an article's ID will orphan all reactions stored in Firebase under that ID.

2. **Firebase schema is locked** - The Firebase paths (`readStatus/{articleId}/{userName}` and `userThoughts/{userName}`) must not be restructured.

3. **User names are case-sensitive** - "Tanmay" ≠ "tanmay" in Firebase. Use exact names.

## Data Model

### Article Structure
```javascript
{
    id: "stable-unique-id-never-changes",  // CRITICAL: Stable ID for Firebase
    title: "Article Title",                 // Can be edited freely
    author: "Author Name",                  // Can be edited freely
    description: "...",
    url: "https://...",
    image: "images/filename.png",           // Optional
    layout: "horizontal"                    // Optional
}
```

### Firebase Schema

**readStatus/{articleId}/{userName}**
```json
{
    "reaction": "liked" | "neutral" | "disliked",
    "timestamp": 1234567890,
    "title": "Article Title"
}
```

**userThoughts/{userName}**
```json
{
    "favoriteArticleId": "article-id",
    "updatedAt": 1234567890
}
```

## User Data Snapshot (Source of Truth)

Last verified: 2026-02-06

| User | Nice | Meh | Nope | Favorite Article ID |
|------|------|-----|------|---------------------|
| Tanmay | 17 | 5 | 0 | `compared-to-what-adam-golding` |
| Cicily | 12 | 4 | 0 | `technology-in-1776-christian-keil` |
| Avantheka | 2 | 0 | 0 | `make-something-heavy-working-theorys` |
| Himadri | 0 | 0 | 0 | None |
| Kashvi | 0 | 0 | 0 | None |
| Achyut | 0 | 0 | 0 | None |
| Vibhu | 0 | 0 | 0 | None |

## Key Functions

| Function | Purpose |
|----------|---------|
| `getItemId(item)` | Returns stable `id` if present, else generates from title-author |
| `getNerdReviews(name)` | Counts reactions for a user from Firebase cache |
| `getUserThoughts(name)` | Gets favorites from `userThoughtsCache` |
| `buildNerdTiles()` | Renders profile cards (called on Firebase data update) |

## Files

- **app.js** - Main application logic, article data, UI rendering
- **firebase-config.js** - Firebase initialization and listeners
- **styles.css** - All styling
- **index.html** - Entry point

## Adding New Articles

When adding a new article:
1. Generate a stable ID: `title-author` in lowercase with hyphens
2. Add the `id` field FIRST in the article object
3. Never reuse an existing ID

## Troubleshooting

**"Reviews not showing"**
- Firebase data loads async; `buildNerdTiles()` is called on data update
- Check if `getItemId(article)` matches the Firebase key

**"Favorites incorrect"**
- Check `userThoughtsCache` for the exact `favoriteArticleId`
- Verify the ID matches an article's `id` field
