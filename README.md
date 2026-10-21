# gen0

Local Vue/TypeScript name generator with setting-specific categories and themes. Cyberpunk offers Generic, Shadowrun, and CP 2020/77 flavors. The CBR+PNK link opens the Cyberpunk runner sheet. Generator URLs use `/cyberpunk/generic/runners`, `/cyberpunk/shadowrun/runners`, or `/cyberpunk/cp77/runners`. See the [app guide](docs/app.md) for usage, code layout, and data sources.

Runner results include an archetype linked to their main profession and a random CBR+PNK angle. With details shown, the arrow in each result's top-right corner opens that runner in a fresh character sheet with matching profile stats and augmentation; the image button copies a square portrait prompt using the same name, description, archetype and angle. The prompt offers several lettering styles and positions for the name. The sheet's description image button uses the same prompt and is hidden when the description is empty. Successful copying triggers a short glitch burst on the image button; hovering gives a lighter glitch. Neither shows a success message.

I do not allow any of the data in this project to be used for training or developing AI models without my explicit permission.

The [character data model](docs/character-data-model.md) and active CBR+PNK catalogue are available in `src/data/characters/`. The “CBR+PNK” link opens `/chars/cbrpnk`, an editable sheet backed by Pinia and saved in local storage, starting blank when no usable saved sheet exists; a Runner card has editable Alias and Name & description fields, with Generate and Reset beside the Runner heading. Generate opens the archetype picker and choosing one fills the runner fields from the existing Runners category using Generic and the chosen archetype. The sheet always uses Generic for its theme and generation, and its link carries no flavor query. Generate also fills Approaches, Skills, and expertise from the matching CBR+PNK profile; a source skill value of 3 becomes two rating points plus one matching expertise. Applying an archetype after choosing an archetype has an independent 20% chance in Approaches and Skills to move one point from a rating of 1 or 2 to another field below 2, keeping each total. Applying an archetype also picks one linked augmentation using the existing generator’s flavor name, optional descriptor, purpose text when present, and manufacturer as one editable line, fills the first slot, clears the other two slots and all augmentation Glitched marks, or leaves all slots blank when no links exist. Harm, Stress, and Approach Glitched marks remain manual. Resist/Armor follows Stress; its only control, Special Armor, turns the card yellow when checked and is saved with the sheet. The Load/Gear card tracks selected gear against Light [3], Medium [5], or Heavy [7], turns yellow at the limit and red above it, and saves its selections with the sheet. The random augmentation pool has archetype suitability links; see [the complete mapping](docs/character-data-model.md#random-augmentation-archetype-links).

The character sheet keeps its current state in a compressed `character` query parameter, updated automatically through Vue Router after each Vue update without a debounce. Copy the address-bar URL to save or share the character. A character query takes priority over local storage; without one, use the locally saved sheet. Invalid queries leave existing edits intact. Edits still save locally, and switching to the name generator or About keeps their URLs free of character data. Links contain the full character, require no backend, and can be read by anyone who has them. Long descriptions make longer links.

On the default-scheme character sheet (Generic/Shadowrun), use the browser’s Print command to print or Save as PDF. Choose A4 portrait, 100% scale, and disable browser headers/footers. The print layout removes the app shell and actions, keeps the desktop card order in two columns, and shows selections without background graphics. Custom expertise fields use the selected expertise style when filled and appear in print only when filled. Long descriptions wrap and may extend the sheet to further pages.

## Run

Use Node 24.x locally and on Vercel.

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run check
npm run preview
```

`check` runs lint without edits, unit tests, TypeScript checks, and the production build. Output goes to `dist/`; `preview` serves that build locally.

Unit tests run in Node by default; UI test files opt into jsdom with `@vitest-environment jsdom`. Unexpected console warnings and errors fail the responsible test; tests for intentional diagnostics must install a spy and assert its calls. Mocks and stubbed globals are restored before each test. Test files remain isolated and use at most two workers when `CI` or `VERCEL` is set, limiting CPU and memory pressure during deployment checks.

Linting uses Oxlint with its built-in Vue and Vitest plugins; `vue-tsc` remains responsible for type checking. Oxlint checks Vue script sections, but does not replace all ESLint Vue template rules. The Oxc editor extension is recommended.

Individual commands: `npm run build`, `npm run test:unit -- --run`, and `npm run lint` (applies fixes).

## Deploy

Serve `dist/` over HTTP. Configure `index.html` as the fallback for generator and About paths, including direct links and reloads. Opening files through `file://` is unsupported.

For Vercel, import `main` with the Vite preset, repository root, `dist` output, and Node 24. No environment variables are required. `vercel.json` sets `npm run check` as the build command and supplies the route fallback; leave dashboard build overrides disabled. Verify direct generator and About links after deployment.
