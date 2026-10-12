# App guide

All generator data is bundled. Generation runs in the browser without a backend, account, or remote data service. Google Fonts has local fallbacks; data files all load at startup, split into separate files for caching. There is no service worker.

## Use

Choose Generic, Shadowrun, or combined CP 2020/77, then search the category picker. Opening the generator or changing settings produces 10 names; scrolling to the bottom adds 20. Generate names rerolls the batch. Gender and corporation-size checkboxes choose the allowed results.

Flavor/category use paths such as `/shadowrun/runners`; applicable gender/size choices use query parameters. Reload and Back/Forward restore settings. Results are temporary. The details toggle survives navigation but resets on reload. About retains settings when returning to the generator.

The header shows `v/{commit hash}` in small text above the right end of the striped separator. The hash is supplied during the build: Vercel’s `VERCEL_GIT_COMMIT_SHA` when available, otherwise local Git HEAD, or `unknown` without either. Uncommitted changes do not change this version.

Setting names and terminology follow the selected flavor. Generated company histories, products, prices, and places are fictional. Regional naming coverage is incomplete; missing pools are marked TODO.

The “CBR+PNK” link beside About opens a runner sheet at `/chars/cbrpnk`. Approaches and skills come from the catalogue, including Attune marked as Weird. Ratings and expertise start empty; Glitched toggles start off. Each approach and skill has two + checkboxes, for ratings from 0 to 2. Selecting the right box selects both; clearing the right leaves the left selected, and clearing the left clears both. Approaches and Skills use the name generator’s panels and headings. Approaches and skills are dark at 0, yellow at 1, and cyan at 2, using the shared palette; approaches turn red when glitched. A Glitched hazard toggle sits beside the boxes on desktop and below on smaller screens. It shows the negative name (such as Hesitation) beside the original name, without changing the rating. That space stays reserved when off, so toggling does not shift the layout. Expertise is free text; filled fields have a yellow background with dark, heavier text. Edits stay in Pinia while navigating and reset on reload. No archetype is applied and no character is generated. The sheet always uses Generic for its theme and generation; its links carry no flavor query, and `/chars/cbrpnk` also opens directly.

The Harm card has three blank description lines, two independent slots each for levels 1 and 2, and one slot for level 3, matching the supplied sheet. The card turns yellow when level 1 is full and red when level 2 or 3 is full; a red state takes priority. Descriptions and slots live in the same character Pinia state. The card sits below Approaches on desktop and after Skills on mobile. It does not automatically move harm between levels.

The Stress card copies the supplied card’s costs, overload rules, and seven connected diamonds. Selecting a slot marks all slots through it; clearing one clears it and every later slot. Stress starts at zero and stays in Pinia with the rest of the sheet. The last slot highlights the overload rule; choosing a glitched Approach remains manual.

The Augmentations card copies the supplied rules and provides three blank text lines with independent Glitched hazard toggles. On desktop it sits directly below Skills, while the left column stacks Approaches, Harm, and Stress independently. Filled text fields turn yellow like skill expertise fields. Both text and glitch marks stay in the character Pinia store across navigation and reset on reload.

## Code and data

- `src/data/`: editable names/fragments; personal names live in `names/`, combined by `personal-names.ts`. Shared fragments use purpose names: `runner-traits.ts`, `name-fragments/` (split by bars, corporations, runners, shops, and the other existing pools), `food.ts`, and `movies.ts`. `characters/` contains the separate [character model and CBR+PNK profiles](character-data-model.md), plus display labels transcribed from the supplied sheet image.
- `src/stores/character.ts`: Pinia state for the editable sheet, linked to catalogue IDs; blank values are `null`, distinct from zero.
- `src/patterns/cyberpunk/`: composition grouped by purpose; shared names, jobs, and species live in `people/`, and nationality rules live in `nationality/traditions.ts`.
- `src/builders/`: data loading/flavor filtering in `load.ts`, independent selection pools, and cached personal-name pools.
- `src/generator/`: categories, options, alternate labels, and route normalization.
- `src/views/`, `src/components/`: pages and shared controls.
- `src/styles/`: shared variables and flavor themes.

Follow [working instructions](../AGENTS.md) and the [current decisions](decisions/). Source coverage and reuse terms: [personal names](name-data-sources.md), [corporations](data-sources.md), and [regional mixes](sovereignty-name-sources.md). Required notices ship in `public/name-data-notices.txt`.
