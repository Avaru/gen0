# gen0

A local Vue + TypeScript cyberpunk name generator, migrated from pgen. No backend, spreadsheet connection, or remote name service is required.

## Run

Use Node 24, as specified in `package.json`.

```sh
npm install
npm run dev
```

Choose a category; 10 names generate automatically. Generic cyberpunk is the default flavor. Shadowrun enables its species, magic, and setting references together. Cyberpunk 2020/2077 is one combined flavor with names from both corporation lists. Known corporations selects existing setting names; Corporations composes new names. Generated corporations include a CEO. AA and AAA add a founding year; AA has one dated event, and AAA has one or two subsidiaries and two or three events. Events can fall anywhere from the company’s founding through 2077. All flavors assume the current year is 2077. Show details displays this fictional company information; known corporations remain names only. Weapons, augmentations, food menus, shops, and device contents are also available. All augmentation types are available in every flavor. Augmentations combine an optional attribute with a cyberware type; details show a manufacturer, with a short functional description only for obscure augmentation names. Their manufacturer/type combinations are fictional products, not canon models or rules profiles. Device data becomes Commlink data in Shadowrun and Shard data in Cyberpunk. Shared fragments work in every flavor; magic, metahumans, brands, and device terms follow the selected setting. Food prices are fictional: credits for Generic, ¥ for Shadowrun, and €$ for Cyberpunk. Weapons are invented products, not rules profiles or a catalogue of canon models. Personal names support masculine/feminine selection, and corporations support size selection.

```sh
npm run build
npm run preview
npm run test:unit -- --run
npm run lint
```

The production output is in `dist/` and can be served by any static host. Generation happens entirely in the browser. It needs no internet connection once the app files are available; opening `index.html` directly through `file://` is not the supported launch method.

## Interface

The top-right About link opens a short introduction and author credit. Back to generator keeps the selected settings; returning generates a fresh batch of names. Static hosts must serve `index.html` for both `/` and `/about`.

Mobile-first layout with native radio segmented controls for flavors with equal-width cells that adapt to the control’s available space, checkbox groups for given-name gender and corporation size, and a searchable grouped category picker. The picker opens full-screen on phones and as a centered panel on larger screens. Search matches category and group names; selecting a category closes it, while Escape or Close cancels. Enter selects when search has exactly one match. Native HTML dialog behavior keeps keyboard focus inside and returns it to the Category button on closing. See [category picker](docs/decisions/0013-searchable-category-picker.md). All gender and size boxes start checked; the last checked box cannot be unchecked. Results randomly use one of the checked choices. Each selection change generates 10 names automatically. Settings update the URL and are restored on reload and browser Back/Forward; results remain temporary. Generate more adds another 10 names. Show details toggles all secondary information without changing names and stays selected across categories and shared links. Themes follow the selected flavor automatically, including links, reload and Back/Forward. Generic and Shadowrun share the expressive default: yellow, near-black, cyan and coral with grain, halftone dots and small print marks inspired by CBR+PNK. CP 2020/77 uses a dark red/cyan theme with narrower typography inspired by the game UI. The layout and controls stay the same. Shared CSS variables and scoped `Ui*` components keep styling separate from generation. Vue binds the theme reactively; CSS `:has()` applies document colors without direct browser API calls. Google Fonts loads Barlow Condensed, IBM Plex Mono and Rajdhani when online, with local fallbacks. See [flavor themes](docs/decisions/0020-flavor-themes.md). See [UI requirements](docs/decisions/0004-mobile-first-ui.md).

## Edit the generator

- `src/data/names/*.ts`: personal names grouped by naming tradition.
- `src/data/nameTypes.ts`: personal-name definitions and relationship fields.
- `src/data/rl-names-modern.ts`: combines personal-name lists for the generators.
- `src/data/*.ts`: other names and fragments, including preserved unused Shadowrun pools.
- `src/patterns/cyberpunk/`: the copied and adapted generation patterns.
- `src/builders/Bits.ts`: typed, independent selection pools; `take()` selects and removes one entry. Filtering creates another independent pool.
- `src/builders/namePools.ts`: name pools prepared in memory and reused for matching settings.
- `src/generator/categories.ts`: available categories and synchronous batch generation.
- `src/patterns/cyberpunk/nationality/traditions.ts`: nationality IDs, labels, and naming rules in one definition per tradition.
- `src/patterns/cyberpunk/nationality/availability.ts`: shared checks that a tradition has every name part its rules may request.
- `src/generator/settings.ts`: shared normalization of links and control changes.
- `src/generator/options.ts`: flavors and include/exclude rules.
- `src/load.ts`: local data registry and setting filters.
- `src/views/GeneratorView.vue`: generation and route coordination.
- `src/components/ui/`: shared accessible controls and layout.
- `src/components/generator/`: settings and results presentation.
- `src/styles/base.css`: shared spacing and document defaults.
- `src/styles/themes/index.ts`: flavor-to-theme mapping, bound reactively on `UiShell`.
- `src/styles/themes/cyberpunk.css`: default appearance for Generic and Shadowrun.
- `src/styles/themes/cyberpunk2077.css`: CP 2020/77 appearance.

Generator functions return results directly. Name-only helpers compose personal names, runner handles, and company names without generating unused descriptions. See [generator structure](docs/decisions/0019-synchronous-generator-structure.md).

A setting-specific entry carries `shadowrun` or `cyberpunk2020-2077`. Shared entries have no flavor tag. Category tags (such as `gang` or `runner`) select pools; explicit exclusions take priority over flavor defaults and inclusions.

Modern-name pools are built from the TypeScript data when first needed and reused in memory for matching flavor and include/exclude settings. Every result still makes fresh random picks; source order, duplicate weights, and naming rules are preserved. Reloading rebuilds pools from the current data. See [reusable name pools](docs/decisions/0017-reusable-name-pools.md).

Use a stable `id` for a shared concept and `flavorNames` for alternate names: Netrunner becomes Decker in Shadowrun; Job Contact becomes Johnson or Fixer. `flavorShortNames` supplies short forms such as Sam. These are useful equivalents for generation, not claims that the roles have identical lore. Technomancers are restricted to Shadowrun, and other flavors omit species labels.

Personal names only need an `id` when another entry references them; keep those IDs when correcting spellings. Related male/female surname forms share a `formGroupId`; ordinary surnames need no group ID. A patronymic uses `fatherNameId` to reference a male given name, whose `aliases` hold supported alternative spellings. Optional `givenNameIds` connect reviewed nicknames to formal names. Keep existing `father:*` tags when editing patronymics so exclusions continue to work. Composition rules remain in the nationality functions. See [linked name data](docs/decisions/0006-linked-name-data.md).

Chinese and Japanese names use surname-first order without random extra names. Spanish names include two surnames and may have a second given name. Arabic names may include the father's given name, with an optional `ibn`/`bin` or `bint`; surname prefixes come from the stored entry. Given names and surnames, including Arabic parts, remain separately reusable through `nationalityGivenName` and `nationalitySurname`. See [construction rules and limits](docs/decisions/0007-critical-national-name-construction.md).

British, US, and German double surnames may use a hyphen or space. French and Italian doubles use a space, with fewer extra French given names and mostly single Italian surnames. All nationality categories share the same reusable name-part selection. See [remaining nationality rules](docs/decisions/0009-remaining-national-name-construction.md).

Mixed combines given names and surnames from different traditions. The surname tradition sets the order and surname variation; extra given names use the first given name's tradition. Gendered surname and patronymic forms stay consistent with the selected gender. Excluded traditions are skipped; generation needs two suitable traditions. See [Mixed rules](docs/decisions/0010-mixed-personal-names.md).

Dutch, Turkish, Ukrainian, Swedish, Korean, Vietnamese, Hindi-speaking Indian, and Tamil names are also available. Korean and Vietnamese names use surname-first order and complete given-name entries. Tamil uses the father's full given name followed by the person's given name, without repeating the same name; Mixed can use Tamil given names with another tradition's surnames. The other new pools use one given name plus one surname. All display Latin spellings, including diacritics where retained.

Counts, exact downloaded sources, reuse terms, spelling conversions, and limits are recorded in [personal-name sources](docs/name-data-sources.md). Several sources are maintained collections rather than census lists. Required notices ship in `public/name-data-notices.txt`. See [new naming rules](docs/decisions/0011-sourced-name-pools.md).

Names by sovereignty shows a compact set of states and regions for the selected flavor: UCAS and ADL in Shadowrun, NUSA in Cyberpunk, and broad choices such as Europe. Generic cyberpunk instead offers Names by continent: Africa, Asia, Europe, North America, South America and Oceania. Each mixes complete names from existing traditions. Missing pools appear as X TODO under Names by nationality, which is the last picker group with Mixed first; regional settings identify pending pools and limited coverage. See [sovereignty sources and limits](docs/sovereignty-name-sources.md) and [continent mixes](docs/decisions/0018-continent-name-mixes.md). Edit the mixes in `src/data/sovereignties.ts` / `src/data/continents.ts` and empty pools in `src/data/names/pending.ts`.

Corporation coverage and source links are recorded in [data sources](docs/data-sources.md). Structural choices are recorded under [decisions](docs/decisions/).

The old pgen folder remains unchanged. Fantasy/DSA generators, old themes, and sheet import tooling were not copied. See [the initial decision](docs/decisions/0001-local-cyberpunk-generator.md) and [working instructions](AGENTS.md).
