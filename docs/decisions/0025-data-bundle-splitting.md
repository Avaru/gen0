# 0025: Separate name lists in the production build

Date: 2026-10-10
Status: Accepted

## Reason and behavior

The bundled personal-name lists made the main JavaScript file about 2.63 MB before compression. Split the production output at the existing data-file boundaries so the app code and individual lists can be cached separately.

- Give each file in `src/data/names/` its own named chunk. Group the remaining data into `generator-data`.
- Match data files only; leave their dependencies to the normal build rules.
- Keep the editable TypeScript lists, synchronous generation, source order, weights, filtering, and nested generators unchanged.

## Limits

All lists are still imported on startup. This separates files and their caches; it does not reduce the total data downloaded or add loading states. A single list can still exceed the build warning threshold if it grows sufficiently large. Loading only selected lists would require a separate change to the synchronous data registry and its callers.
