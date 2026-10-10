# Working in gen0

- Tell the user when adding anything they did not ask for. Prefer leaving extras out and suggesting them in the final summary.
- If a choice makes a lot of sense, say why in plain language. If something feels wrong or conflicts with the request, ask before starting that part.
- Avoid smart-sounding language and unnecessary development jargon.
- Keep work scoped to the requested generator changes. Do not add more categories, flavors, persistence, styling, or publishing without a request.

## Product and structure

- gen0 is a Vue + TypeScript single-page cyberpunk name generator. It must run without a backend, account, spreadsheet service, or remote data connection.
- Keep the interface functional with native HTML controls. No custom styling until requested.
- Keep all names and name fragments in editable TypeScript files under `src/data/`. Do not restore JSON name lists or sheet import scripts.
- Preserve the migrated Shadowrun lists and generation patterns. Keep DSA/fantasy generators out of this app.
- Generic cyberpunk is the base. Shadowrun and Cyberpunk 2020/2077 are whole flavors, not separate copies of the generator. Do not split a flavor into feature checkboxes or split Cyberpunk 2020 and 2077 into separate flavors.
- Put setting-specific restrictions on data entries using tags. Pass generation options explicitly through nested generators; do not use global mutable flavor state.
- Flavor defaults can be overridden by included/excluded tags. Exclusions win. Ordinary category tags select pools; flavor tags control availability.
- Use stable concept IDs with `flavorNames` and `flavorShortNames` for alternate names. Keep availability separate from spelling: Technomancer is Shadowrun-only; Netrunner/Decker is one shared role. Hide human species labels outside Shadowrun.
- Use `src/generator/categories.ts` for the category registry and `src/generator/options.ts` for settings. Keep composition rules under `src/patterns/cyberpunk/` and reusable pool filtering in `src/builders/`.
- Do not modify the old pgen app as part of gen0 changes unless requested.

## Decisions and checks

- Record agreed structural changes in short numbered notes under `docs/decisions/`. State the reason, resulting behavior, and any meaningful limitations; avoid logging routine edits.
- Read relevant existing decisions before changing these boundaries. Follow the user's newer instructions if they change a decision, and update the note accordingly.
- Run `npm run build`, `npm run test:unit -- --run`, and `npm run lint` after meaningful generator changes. Add focused checks for flavor filtering, nested generation, and relevant category behavior.
- Keep README instructions accurate. Never claim browser or offline checks that were not actually run.
