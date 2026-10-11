# App guide

All generator data is bundled. Generation runs in the browser without a backend, account, or remote data service. Google Fonts has local fallbacks; data files all load at startup, split into separate files for caching. There is no service worker.

## Use

Choose Generic, Shadowrun, or combined CP 2020/77, then search the category picker. Opening the generator or changing settings produces 10 names; scrolling to the bottom adds 20. Generate names rerolls the batch. Gender and corporation-size checkboxes choose the allowed results.

Flavor/category use paths such as `/shadowrun/runners`; applicable gender/size choices use query parameters. Reload and Back/Forward restore settings. Results are temporary. The details toggle survives navigation but resets on reload. About retains settings when returning to the generator.

The header shows `v/{commit hash}` in small text above the right end of the striped separator. The hash is supplied during the build: Vercel’s `VERCEL_GIT_COMMIT_SHA` when available, otherwise local Git HEAD, or `unknown` without either. Uncommitted changes do not change this version.

Setting names and terminology follow the selected flavor. Generated company histories, products, prices, and places are fictional. Regional naming coverage is incomplete; missing pools are marked TODO.

## Code and data

- `src/data/`: editable names/fragments; personal names live in `names/`.
- `src/patterns/cyberpunk/`: composition; nationality rules live in `nationality/traditions.ts`.
- `src/builders/`: independent selection pools and cached personal-name pools.
- `src/generator/`: categories, options, alternate labels, and route normalization.
- `src/views/`, `src/components/`: pages and shared controls.
- `src/styles/`: shared variables and flavor themes.

Follow [working instructions](../AGENTS.md) and the [current decisions](decisions/). Source coverage and reuse terms: [personal names](name-data-sources.md), [corporations](data-sources.md), and [regional mixes](sovereignty-name-sources.md). Required notices ship in `public/name-data-notices.txt`.
