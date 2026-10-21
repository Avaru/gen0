# Working in gen0

- Stay within the request. Avoid extras; suggest them in the summary. Explain useful choices plainly and ask before starting anything that conflicts with the request.
- All list entries must be human-made. Without explicit consent, only migrate, format, or correct existing entries; do not invent content.
- gen0 is a local Vue/TypeScript/Vite app with setting-specific generators. No backend, accounts, remote data, or changes to itemcards.com. Keep fantasy/DSA out.
- Cyberpunk uses three whole flavors: Generic, Shadowrun, and combined Cyberpunk 2020/2077. Preserve migrated content and duplicate selection weights.
- Keep editable data in `src/data/`, composition in `src/patterns/<setting>/`, pool filtering in `src/builders/`, and categories/settings in `src/generator/`. Register settings in `settingRegistry.ts` and keep their category definitions in `definitions/`. Share data deliberately; a new setting is not a flavor.
- Flavor tags control availability; ordinary tags select pools. Exclusions win. Pass options through nested generators. Use `flavorNames`/`flavorShortNames` for alternate labels; retain IDs for referenced entries and shared flavor concepts, not ordinary list rows.
- Use shared `Ui*` components, scoped CSS, and central variables. Keep the UI accessible at 320px and in current browsers; prefer native controls. Theme files and setting mapping belong in `src/styles/themes/`, selected reactively from the route.
- Keep generator settings in routes with reload and Back/Forward support. Results are temporary; details visibility stays in app state.
- Read the relevant [current decisions](docs/decisions/) before structural changes. Update the existing notes to match agreed behavior; do not accumulate history or plans for absent features.
- After making changes, run `npm run format`. After meaningful generator changes, also run `npm run build`, `npm run test:unit -- --run`, and `npm run lint`. Cover affected behavior, especially flavor filtering and nested generation.
- Keep README accurate. Never claim browser or offline checks that were not run.
