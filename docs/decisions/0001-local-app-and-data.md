# 0001: Local app and bundled data

Bundle data with the Vue/TypeScript/Vite app so generation needs no backend or remote data connection. Keep itemcards.com unchanged and fantasy/DSA generators out of scope.

- Settings own categories, defaults, flavors, themes, and sheet navigation in `src/generator/settingRegistry.ts`. A setting is separate from a flavor; sharing data or composition must be deliberate.
- Cyberpunk is the default setting, with Generic, Shadowrun, and combined Cyberpunk 2020/2077 as whole flavors. Mothership is a separate setting that draws from the shared naming traditions. Never Midnight and its routes are available only with `SETTING_NEVER_MIDNIGHT=true`.
- Keep editable lists in `src/data/`, composition in `src/patterns/<setting>/`, filtering in `src/builders/`, and category definitions in `src/generator/definitions/`. Shared data uses purpose-based names.
- Preserve human-made entries, source order, and duplicate selection weights. AI-authored additions require explicit consent. Keep source links and reuse notices; inherited lists are not fully audited.
- Flavor tags control availability; ordinary tags select pools. Exclusions win, and options pass through every nested generator. Alternate labels change wording without changing availability. Use IDs for referenced entries and shared concepts.
- Selection pools stay independent. Cache reusable name data, never generated results or random draws. Empty required pools report errors rather than silently substituting unrelated content.
- Bundled data does not imply offline support; no service worker is included. Serving and deployment follow [tooling and deployment](0006-tooling-and-deployment.md).

## Never Midnight availability

Never Midnight is enabled only when `SETTING_NEVER_MIDNIGHT=true` at build time. For local development, put that line in the ignored `.env.local` and restart Vite. Leave it unset on Vercel to exclude the setting, generator routes, and `/chars/never-midnight` sheet. Any other value also leaves the setting disabled.

Setting-specific content and source limits belong in the data and [source documentation](../data-sources.md), including [Never Midnight occupations](../never-midnight-job-sources.md).
