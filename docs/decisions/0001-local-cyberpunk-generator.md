# 0001: Local generator and data

Bundle the data with a Vue/TypeScript/Vite app so generation needs no backend or remote data connection. Keep itemcards.com unchanged; exclude its fantasy/DSA generators.

- Generic is the default. Shadowrun and combined Cyberpunk 2020/2077 are whole flavors, with setting details enabled together.
- Editable lists live in `src/data/`; preserve human-made entries, source order, and duplicate weights. AI-authored additions require explicit consent. Source links and reuse notices remain available for review.
- Ordinary tags select pools; flavor tags restrict availability. Include/exclude options override defaults, with exclusions winning. Pass options explicitly through all nested calls.
- `flavorNames` and `flavorShortNames` change spelling without changing availability. Shared concepts retain IDs; ordinary rows need none. Technomancer is Shadowrun-only; Netrunner/Decker shares one role. Human species labels appear only with Shadowrun.
- Register categories in `src/generator/categories.ts`, options in `options.ts`, composition in `src/patterns/cyberpunk/`, and loading/filtering in `src/builders/load.ts`. Shared datasets use purpose names rather than a setting prefix; `people/` contains shared name, job, and species composition. The CBR+PNK catalogue contains active sheet definitions and profiles; unused import configuration and augmentation tables are removed. Functions return results synchronously; name-only helpers avoid generating unused descriptions.
- `Bits` owns independent selection pools; filtering creates another pool and `take()` removes one entry. `NamePools` indexes and caches personal-name parts without caching results or consuming random draws. Retain up to eight normalized flavor/tag combinations; each person gets independent picks.
- Empty required pools report errors. Eligibility checks skip traditions missing any part their rules may request, including optional parts.
- Split personal-name files into individual production chunks and other data into `generator-data`, for separate caching. All lists still load at startup.
- Serve `dist/` over HTTP with the app entry point as the route fallback. Vercel runs `npm run check` before deployment. No service worker is included; online fonts have local fallbacks.

Inherited lists are not fully audited for spelling or canon accuracy. Preserve explicitly retained unused Shadowrun pools and `src/data/fashion.ts`; Birka and Fashion Items have no active flavor, theme, or generator.
