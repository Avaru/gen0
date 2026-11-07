# 0016: Content generators

Compose fictional results from human-made fragments rather than inventing list entries. Keep content in `src/data/` and composition in setting patterns; preserve duplicate weights and pass filtering options through nested calls.

- Keep known setting names separate from generated companies, products, places, and histories. Known corporations retain individual source links and receive no invented details. Generated prices, populations, ratings, and histories are fictional.
- Reuse shared composition helpers for nested names and products so flavor rules stay consistent. Request names alone when details are unused. Recursive company generation uses bounded retries and existing-fragment fallbacks.
- Store company-event templates and wording alternatives as editable data. Preserve event-type weights and chronological histories rather than letting template length affect selection.
- Augmentations and weapons use flavor-aware manufacturers and labels. Augmentation-to-archetype links support character generation without restricting the standalone pool. Generated equipment makes no game-statistics or canon-product claims; see the [character data model](../character-data-model.md).
- Keep runner appearance in dedicated trait pools. Mothership characters reuse Generic Cyberpunk looks, capitalized and shown below the trinket/patch line in both Details and the mini character sheet. Never Midnight uses its approved everyday appearance and occupation data rather than inheriting Cyberpunk features. Shared data is selected explicitly.
- Mothership ships choose equally between the edited song-title list and female given names. Given names choose British, Spanish, French, or Russian with equal chance among available traditions, then use the shared filtered name pool. Store ship class, Jump rating, matching example type, and maintenance issues with the result. Show the abbreviated class and type as secondary text, with maintenance issues under Details; use the supplied tables and omit major-issue rules text.
- Never Midnight spells use the bc rulebook's concepts and expressions, preserving duplicate weighting. Store grammatical forms explicitly and compose details from approved types and source phrases.

Exact lists, probabilities, and output wording belong in data, patterns, and tests. Migration sources and reuse notices remain in [data sources](../data-sources.md) and the linked source documents; excluded content must not be replaced with invented fragments.
