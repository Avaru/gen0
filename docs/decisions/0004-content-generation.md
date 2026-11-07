# 0004: Content generation

Compose fictional results from human-made fragments rather than inventing list entries. Keep content in `src/data/` and composition in setting patterns; preserve duplicate weights and pass filtering options through nested calls.

- Keep known setting names separate from generated companies, products, places, and histories. Known corporations retain individual source links and receive no invented details. Generated prices, populations, ratings, and histories are fictional.
- Reuse shared composition helpers for nested names and products so flavor rules stay consistent. Request names alone when details are unused. Recursive company generation uses bounded retries and existing-fragment fallbacks.
- Store company-event templates and wording alternatives as editable data. Preserve event-type weights and chronological histories rather than letting template length affect selection.
- Augmentations and weapons use flavor-aware manufacturers and labels. Augmentation-to-archetype links support character generation without restricting the standalone pool. Generated equipment makes no game-statistics or canon-product claims; see the [character data model](../character-data-model.md).
- Keep runner appearance in dedicated trait pools. Mothership characters reuse Generic Cyberpunk looks, capitalized and shown below the trinket/patch line in both Details and the mini character sheet. Never Midnight uses its approved everyday appearance and occupation data rather than inheriting Cyberpunk features. Shared data is selected explicitly.
- Never Midnight spells use the bc rulebook's concepts and expressions, preserving duplicate weighting. Store grammatical forms explicitly and compose details from approved types and source phrases.

## Cyberpunk runners

Runner results include an archetype linked to their main profession and a random CBR+PNK angle. Sheet generation and portrait prompts reuse that result; see [character sheets](0005-character-sheets-and-sharing.md) and [portrait prompts](0002-interface-and-navigation.md#sheet-navigation-and-portrait-prompts).

## Mothership

Characters use `/mothership/generic`; Details includes the existing Generic Cyberpunk appearance line. Starting skills and scores belong to the same temporary character result, as described in [character sheets](0005-character-sheets-and-sharing.md#mothership-mini-sheet).

Ships use `/mothership/ships`. Half use an edited song title from `src/data/mothership-ship-name-candidates.ts`; the other half use a female given name, choosing British, Spanish, French, or Russian with equal chance among available traditions before selecting from shared filtered lists. Store ship class, Jump rating, matching type, and maintenance issues with the result. The secondary line combines Jump rating 1–3, abbreviated ship class, and a matching type from the supplied table, such as `J1C-I Raider`. Details shows one or two distinct minor maintenance issues, with an independent 20% chance of an additional major issue. These use the supplied maintenance table without game rules.

## Never Midnight

Names reuse German, Russian, and Polish personal-name lists, with German as the default at `/never-midnight/german`. German name details include a Berlin street address and district, without the flat location. The Berliner option at `/never-midnight/berliner` uses 75% German, 10% Polish, and 15% Russian names, all with Berlin addresses.

The Address category at `/never-midnight/address` picks an East Berlin street and a house number from 1 to its recorded maximum, with a 25% chance of an A or B suffix. The district appears as secondary text, followed by a randomly chosen flat location when Details is enabled. See [street sources](../east-berlin-street-sources.md).

The Spells category at `/never-midnight/spells` combines the bc rulebook's concept, expression, and shape tables; “that” shapes have a 50% chance of “never”. Details shows a spell type and source beneath each spell.

Exact lists, probabilities, and output wording are maintained in data, patterns, and tests. Migration sources and reuse notices remain in [data sources](../data-sources.md) and the linked source documents; excluded content must not be replaced with invented fragments.
