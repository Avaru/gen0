# gen0

Local Vue/TypeScript cyberpunk name generator. See the [app guide](docs/app.md) for usage, code layout, and data sources.

I do not allow any of the data in this project to be used for training or developing AI models without my explicit permission.

The [character data model](docs/character-data-model.md) and CBR+PNK seed catalogue are available in `src/data/characters/`. The “CBR+PNK” link opens `/chars/cbrpnk`, an editable sheet backed by Pinia and saved in local storage, starting blank when no usable saved sheet exists; a Runner card has editable Alias and Name & description fields, with Generate and Reset beside the Runner heading. Generate opens the archetype picker and choosing one fills the runner fields from the existing Runners category using the current flavor and chosen archetype. Sheet links carry only a non-default flavor query. Generate also fills Approaches, Skills, and expertise from the matching CBR+PNK profile; a source skill value of 3 becomes two rating points plus one matching expertise. Applying an archetype after choosing an archetype has an independent 20% chance in Approaches and Skills to move one point from a rating of 1 or 2 to another field below 2, keeping each total. Mage has no profile and leaves these fields blank. Applying an archetype also picks one linked augmentation using the existing generator’s flavor name, optional descriptor, purpose text when present, and manufacturer as one editable line, fills the first slot, clears the other two slots and all augmentation Glitched marks, or leaves all slots blank when no links exist. Harm, Stress, and Approach Glitched marks remain manual. The Load/Gear card tracks selected gear against Light [3], Medium [5], or Heavy [7], turns yellow at the limit and red above it, and saves its selections with the sheet. The random augmentation pool has archetype suitability links; see [the complete mapping](docs/character-data-model.md#random-augmentation-archetype-links).

## Run

Node 24 is the minimum; prefer a newer version.

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

Unit tests run in Node by default; UI test files opt into jsdom with `@vitest-environment jsdom`. Test files remain isolated and use at most two workers when `CI` or `VERCEL` is set, limiting CPU and memory pressure during deployment checks.

Individual commands: `npm run build`, `npm run test:unit -- --run`, and `npm run lint` (applies fixes).

## Deploy

Serve `dist/` over HTTP. Configure `index.html` as the fallback for generator and About paths, including direct links and reloads. Opening files through `file://` is unsupported.

For Vercel, import `main` with the Vite preset, repository root, `dist` output, and Node 24 or a newer supported version. No environment variables are required. `vercel.json` sets `npm run check` as the build command and supplies the route fallback; leave dashboard build overrides disabled. Verify direct generator and About links after deployment.
