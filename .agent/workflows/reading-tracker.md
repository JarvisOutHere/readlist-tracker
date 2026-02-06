---
description: Working on the Reading Tracker web application
---

# Reading Tracker Workflow

> [!CAUTION]
> **YOU MUST FOLLOW ALL STEPS IN ORDER. DO NOT SKIP ANY STEP.**

---

## BEFORE Making Any Changes

// turbo
1. **Read `ARCHITECTURE.md`** in the project root - contains critical invariants
2. **Read current function signatures** if modifying existing code
3. **Get current user stats** if working on user data (run the console snippet below)

---

## WHILE Making Changes

4. **Never change article `id` fields** - orphans Firebase data permanently
5. **Never hardcode user stats** - always fetch live
6. **User names are case-sensitive**: Tanmay, Himadri, Avantheka, Cicily, Kashvi, Achyut, Vibhu

---

## AFTER Making Changes (MANDATORY)

> [!WARNING]
> **You MUST complete these steps before finishing the task:**

7. **Update `ARCHITECTURE.md`** if you changed:
   - [ ] Functions (add/remove/modify signature)
   - [ ] Data models (article structure, Firebase schema)
   - [ ] Files (add/remove)
   - [ ] Categories
   - [ ] Users
   - [ ] Any invariants or gotchas

8. **Add Changelog entry** at bottom of `ARCHITECTURE.md`:
   ```markdown
   | YYYY-MM-DD | Brief description of change |
   ```

9. **Remove stale information** - if your change makes existing documentation wrong, UPDATE or DELETE the old info. Don't leave contradictions.

10. **Commit with descriptive message** and push to trigger Vercel deploy

---

## Getting Current User Stats

Run in browser console:
```javascript
['Tanmay', 'Cicily', 'Avantheka', 'Himadri', 'Kashvi'].forEach(name => {
    const r = getNerdReviews(name);
    const t = getUserThoughts(name);
    console.log(`${name}: ${r.positive}👍 ${r.neutral}😐 ${r.negative}👎 | Fav: ${t.favoriteArticleId || 'none'}`);
});
```

---

## Final Checklist (Complete Before Ending Task)

Before calling `notify_user` or ending your task, verify:

- [ ] ARCHITECTURE.md is up-to-date with my changes
- [ ] No stale/contradictory information left in docs
- [ ] Changelog entry added
- [ ] Changes committed and pushed
