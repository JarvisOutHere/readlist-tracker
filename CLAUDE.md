# Reading Archive — Agent Notes

Personal "reading tracker" web app. Vanilla JS + Firebase Realtime Database, no build step. Deployed to Vercel from GitHub.

## Repository layout

One git repo, three branches, three worktrees running three design-variant servers on localhost:

| Branch     | Worktree path                                 | Port |
| ---------- | --------------------------------------------- | ---- |
| `config-1` | `/Users/Tanmay/Documents/AG/reading-tracker-config1` | 8081 |
| `config-2` | `/Users/Tanmay/Documents/AG/reading-tracker`         | 8080 |
| `config-3` | `/Users/Tanmay/Documents/AG/reading-tracker-config3` | 8082 |

Config-2 is the canonical "main" variant — split-pane with reaction column. Config-1 is simpler (no reaction column), config-3 adds image thumbnails in the sidebar. When edits apply to "all three configs," apply them to each worktree and commit on that worktree's branch.

## Article data invariants

`data.articles` in `app.js` is the source of truth. Each article has a stable `id` field — **never rename an id**, reactions in Firebase are keyed on it. When adding an image, drop the file in `images/` and reference it as `image: "images/..."`.

Layout options (set `layout:` on the article):
- `"horizontal"` — landscape image left, text right, text panel 250px
- `"horizontal-square"` — same structure, expects square-ish image
- `"horizontal-4-3"` — forces a 4:3 card for portrait images, text panel 280px
- omit — vertical layout (image top, text below)

## Firebase

**Project:** `readlist-tracker`  
**Database URL:** `https://readlist-tracker-default-rtdb.firebaseio.com`  
**Console:** https://console.firebase.google.com/project/readlist-tracker/database/readlist-tracker-default-rtdb/data  
**Owner account:** `noobtwo222@gmail.com`

### Database shape

```
readStatus/
  {articleId}/                      # e.g. "make-something-heavy-working-theorys"
    {userName}/                     # e.g. "Tanmay", "Himadri"
      reaction: "liked"|"neutral"|"disliked"
      title, author, updatedAt

userThoughts/
  {userName}/
    favoriteArticleId: "..."
    thoughts: "..."
    updatedAt: ...

analytics/                          # app usage, not relevant for reactions
```

### Reading data via REST (no auth)

Security rules are set to public read/write, so the REST API works from anywhere with just curl:

```bash
# All reactions
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus.json" | python3 -m json.tool

# All favorites
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/userThoughts.json" | python3 -m json.tool

# One user's reactions across all articles (need post-filter)
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus.json" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); [print(a, u, v.get('reaction')) for a,r in d.items() for u,v in r.items() if u=='Tanmay']"

# Shallow list of keys only
curl -s "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus.json?shallow=true"
```

### Writing via REST

```bash
# Set a field
curl -X PUT -d '"liked"' "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus/{articleId}/{user}/reaction.json"

# Delete a node
curl -X DELETE "https://readlist-tracker-default-rtdb.firebaseio.com/readStatus/{articleId}/{user}.json"
```

### Connection resilience

Firebase's WebSocket auto-reconnects on network drops, but browsers throttle backgrounded tabs aggressively and the socket can silently die. `firebase-config.js` adds three layers so the client stays live indefinitely:

1. **`keepSynced(true)`** on `readStatus` and `userThoughts` — SDK holds a live subscription to those paths even when no UI listener is attached, so the in-memory cache never goes stale.
2. **Visibility + online event handlers** — call `database.goOffline(); database.goOnline()` the moment the tab becomes visible or the network reports "online," forcing a fresh WebSocket handshake.
3. **Keep-alive ping every 4 minutes** — a cheap `.info/serverTimeOffset` read keeps ISPs / proxies from closing an idle WebSocket.

Connection state is tracked via `.info/connected` and logged to the browser console with `[Firebase]` prefix. For manual debugging from DevTools:

```js
firebaseDebug.isConnected()   // bool
firebaseDebug.reconnect()     // force a reconnect cycle
firebaseDebug.db              // raw database ref
```

### Security rules

Current rules (in `Rules` tab of console):

```json
{"rules":{".read":true,".write":true}}
```

**No expiration.** The data is non-sensitive (reactions on public articles, no PII, no auth tokens stored), so public read/write is acceptable for this personal project.

**If the app ever stops syncing reactions**, the first thing to check is the Rules tab for an expiration clause (`"now < <timestamp>"`). Firebase's default rules expire in 30 days and silently return permission-denied after that — which looks exactly like a frontend bug. History: in April 2026 the rules had expired on Feb 23, 2026 and the app was silently failing to read or write until rules were republished as permanent public.

## Users / magic link tokens

Defined in `firebase-config.js`. Users authenticate via `?u=<token>` URL parameter — no real auth, tokens are just identifiers.

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
| Curator (Tanmay, admin view) | `curator_x7z9q` |

## Common gotchas

- `data.articles.id` is immutable — changing it orphans all reactions.
- Don't commit `.env` or Firebase service-account JSONs (none exist yet, keep it that way; the public web config in `firebase-config.js` is fine to commit).
- `git worktree` means each branch has its own working directory — don't try to check out a branch that's already checked out in another worktree.
- When adding images, the image files go in each worktree's `images/` separately (they're tracked per-branch).
