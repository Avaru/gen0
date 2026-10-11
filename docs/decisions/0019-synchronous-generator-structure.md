# 0019: Synchronous generation and shared naming rules

Date: 2026-10-10
Status: Accepted

## Reason and behavior

The user requested the full TypeScript and Vue review cleanup. The old asynchronous calls came from a version that loaded remote data; gen0 now uses bundled TypeScript lists.

- All composition and batch functions return results synchronously. Vue and Vue Router still handle their own update timing; the view flushes its busy state before calculating a batch.
- Keep `Bits` and `NamePools` as small classes that own selection and cached pools. `Bits.take()` explicitly selects and removes an entry. Filters create independent pools. Return the typed data entry directly; remove the `Pick` wrapper and its random genus getter.
- Separate handles, personal names, and company names from their descriptions. Nested callers request only the name they need. Character details reuse handle composition, removing the runner/character circular import.
- Define nationality IDs, labels, structure choices, and variation probabilities together in `patterns/cyberpunk/nationality/traditions.ts`. Categories derive from those definitions; adding data still requires its import in `data/rl-names-modern.ts`.
- Share complete-name eligibility checks between generic, mixed, regional, and direct nationality generation. Check required gendered parts, potential second names, Spanish surnames, Russian patronymics, Arabic fathers, and distinct Tamil fathers before generation. Mixed still chooses surname traditions uniformly, then compatible different given-name traditions.
- Preserve dataset fragment types through loading and selection. Genus accepts supported values only; personal names use masculine/feminine types. Shared Vue controls preserve their option types without settings casts.
- Use one pure settings normalizer for links and control updates. Compare canonical query values without depending on property order. Keep URL defaults, category fallback, Back/Forward, and batching behavior. Details uses app state as described in decision 0004.
- Remove the unused counter store, Pinia dependency, and `UiField`. Reuse one seeded-random test helper.

## Limits

Data entries, flavors, categories, styling, and naming probabilities are unchanged. Incomplete traditions are skipped when choosing a source, or reported as an error when explicitly requested. The inherited Shadowrun fragments are grouped into named sections in the same editable file to keep their stricter types manageable for TypeScript; order and duplicate weights remain intact.

Removing unused descriptions also removes their random draws, and the unified definitions establish the order of eligible traditions. Entire generated batches therefore need not match an older seeded sequence. Direct personal-name composition matched 1,200 pre-change results using the same draws. Random choices remain fresh; cached pools do not cache generated results.
