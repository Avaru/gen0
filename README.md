# gen0

A local Vue + TypeScript cyberpunk name generator, migrated from pgen. No backend, spreadsheet connection, or remote name service is required.

## Run

Use Node 24, as specified in `package.json`.

```sh
npm install
npm run dev
```

Choose a category and number of names, then generate. Generic cyberpunk is the default flavor. Shadowrun enables its species, magic, and setting references together. Cyberpunk 2020/2077 is one combined flavor with names from both corporation lists. Known corporations selects existing setting names; Corporations composes new names. Personal names support masculine/feminine selection, and corporations support size selection.

```sh
npm run build
npm run preview
npm run test:unit -- --run
npm run lint
```

The production output is in `dist/` and can be served by any static host. Generation happens entirely in the browser. It needs no internet connection once the app files are available; opening `index.html` directly through `file://` is not the supported launch method.

## Edit the generator

- `src/data/*.ts`: all names and fragments, including preserved unused Shadowrun pools.
- `src/patterns/cyberpunk/`: the copied and adapted generation patterns.
- `src/builders/Bits.ts`: selection by category, type, gender, and tags.
- `src/generator/categories.ts`: available categories and batch generation.
- `src/generator/options.ts`: flavors and include/exclude rules.
- `src/load.ts`: local data registry and setting filters.
- `src/App.vue`: the unstyled interface.

A setting-specific entry carries `shadowrun` or `cyberpunk2020-2077`. Shared entries have no flavor tag. Category tags (such as `gang` or `runner`) select pools; explicit exclusions take priority over flavor defaults and inclusions.

Use a stable `id` for a shared concept and `flavorNames` for alternate names: Netrunner becomes Decker in Shadowrun; Job Contact becomes Johnson or Fixer. `flavorShortNames` supplies short forms such as Sam. These are useful equivalents for generation, not claims that the roles have identical lore. Technomancers are restricted to Shadowrun, and other flavors omit species labels.

Corporation coverage and source links are recorded in [data sources](docs/data-sources.md). Structural choices are recorded under [decisions](docs/decisions/).

The old pgen folder remains unchanged. Fantasy/DSA generators, styling, and sheet import tooling were not copied. See [the initial decision](docs/decisions/0001-local-cyberpunk-generator.md) and [working instructions](AGENTS.md).
