# 0017: Reusable name pools

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Repeated generation copied and searched the complete modern-name list for each name part. Build smaller pools in memory from the existing editable TypeScript data when a settings combination is first used, and reuse them through `src/builders/namePools.ts`.

- Separate pools by flavor and normalized include/exclude tags. Exclusions still win. Gender and name-part selection use smaller pools within the same settings snapshot.
- Group entries by their existing tags, preserving source order and duplicate weights. Deduplicate spellings only where the existing nationality builder already did so.
- Reuse eligible traditions for Mixed and eligible sovereignty mixes for each gender and settings snapshot. Keep composition rules and random picks in the existing patterns.
- Each person gets an independent `Bits` list. Picks never consume cached entries. Preparing pools makes no random draws, so the same random sequence produces the same results.
- Nested generators use these pools for modern given names and surnames too.

## Limits

Pools are temporary browser memory, with at most eight recently used settings combinations retained. A reload clears them; a discarded combination is rebuilt when next needed. Data edits are picked up on reload. Initial preparation still costs time, and the name data still ships with the app. No controls, data lists, persistence, naming rules, or result-detail behavior change.
