# Never Midnight job sources

Source inspected 2026-10-21: Deutsche Rentenversicherung, [Übersicht Anlage 1: Vergleich der Ausbildungsberufe DDR – Bundesrepublik](https://rvrecht.deutsche-rentenversicherung.de/SharedDocs/rvRecht/04_GRA_Sonstige/00_berufsgruppenkatalog/01_%C3%9Cbersicht/bgkat_a01.html). The page states a document date of 2015-01-21 and publication date of 2020-03-24.

The source compares selected DDR training occupations with later Federal Republic qualifications, excluding university degrees. It is neither a complete list of DDR employment nor a frequency survey of 1980s Berlin jobs.

`src/data/never-midnight-jobs.ts` stores English display translations alongside their DDR-column German titles, in source order. Use only the DDR column for occupations; the comparison column helps interpret qualifications but does not add modern jobs. Translate titles into readable, gender-neutral English, without claiming formal qualification equivalence. Preserve the distinction between pharmacy assistants, pharmaceutical assistants, and drugstore assistants.

The meat/butcher-product and bakery specialisations in one sales-assistant row become two entries. Other specialisation qualifiers are shortened to the base occupation. Retain separate source rows even when they share an English translation, including childcare and postal workers. The resulting catalogue has 63 entries from 62 source rows.

Append the user's 13 additional entries in supplied order, including both occurrences of archivist. Select uniformly across the resulting 76 stored entries; repeated entries retain extra weight. These weights are generator choices, not demographic estimates. Each German, Russian, or Polish name receives one job from the same Never Midnight pool, shown as secondary text with details enabled.

Only factual occupation names and their translations are imported; no explanatory prose, qualification assessments, or later comparison-column occupations are copied into the generator. The source is linked here and in the data file for review.
