# 0009: British, US American, German, French and Italian names

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Finish the nationality construction review in gen0. These five traditions already support the basic given-name–surname pattern, but need different optional-part rules and surname separators. Use the shared `nationalName` builder for every nationality so gender filtering, reusable parts, exclusions, compound entries, and duplicate avoidance stay consistent.

| Tradition | Second given name | Additional surname | Separator for additional surname |
|---|---|---|---|
| British | 15% | 15% | Hyphen or space, equally likely |
| US American | 15% | 15% | Hyphen or space, equally likely |
| German | 15% | 15% | Hyphen or space, equally likely |
| French | 10% | 15% | Space |
| Italian | 15% | 5% | Space |

Keep the existing optional-name rates unless the review calls for a more restrained display: French extra given names are less frequent, and Italian names usually use one surname while still allowing two parental surnames. These are adjustable generation choices, not demographic estimates. Stored multiword names remain whole entries. An optional runner nickname sits between given names and the surname. Select optional additional parts from the same pool so an exact duplicate cannot be picked twice.

Keep all existing editable lists. Do not add a formal-name mode, initials, new categories, or country-specific interface controls. This supersedes the remaining inherited nationality composition rules in decision 0001. Rules accepted in 0005 and 0007 remain in place.

## Limits and sources

The broad nationality categories model common display patterns, not every regional tradition or legal naming rule. Italian output does not depend on birth year: the 2022 change permits two parental surnames, but a single surname remains a useful adult default.

- [W3C personal names guide](https://www.w3.org/International/questions/qa-personal-names): given names, middle names, and cultural variation.
- [UK passport guidance](https://www.gov.uk/government/publications/change-of-name-passport-applications-caseworker-guidance/names-change-of-name-passport-applications-accessible): double surnames with spaces or hyphens.
- [US passport name guidance](https://fam.state.gov/fam/08fam/08fam040301.html): hyphenated and compound names.
- [German name reform](https://www.bmj.de/SharedDocs/Pressemitteilungen/DE/2025/0429_Namensrecht.html): double surnames with or without a hyphen since May 2025.
- [French naming guidance](https://www.service-public.gouv.fr/particuliers/vosdroits/F10505): two parental surnames joined with a space.
- [Italian Constitutional Court, decision 131/2022](https://www.cortecostituzionale.it/scheda-pronuncia/2022/131): both parental surnames unless parents agree on one.
