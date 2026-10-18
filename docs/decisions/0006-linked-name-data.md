# 0006: Personal names and regional mixes

Keep typed personal-name lists by tradition under `src/data/names/`, combined by `personal-names.ts`. Naming IDs, labels, order, and probabilities live together in `nationality/traditions.ts`, so categories and builders use the same rules.

- Preserve stored compound names and diacritics. Gender is masculine/feminine or omitted for invariant forms. Deduplicate spellings only in pools that require distinct parts, preserving the last stored entry.
- Keep IDs on given names referenced by patronymics or reviewed nicknames. Russian `fatherNameId` links and spelling aliases support explicit father lookup; unsupported fathers raise errors. Keep `father:*` exclusion tags. Existing `formGroupId` surname pairs and `givenNameIds` nickname links describe reviewed relationships; they do not drive generation.
- Select masculine/feminine name forms once before choosing any name parts: 50% each when unrestricted, independent of pool sizes. Keep explicit name-form selections. This is only a constraint on names, not the character's gender or identity, which remain open and fluid. Reuse the same given-name/surname helpers in direct, Mixed, regional, and nested generators; pass flavor/tag options through every selection.

| Tradition | Current display rule |
| --- | --- |
| British, US American, German | Given + surname; 15% second given, 15% second surname, hyphen/space equally likely |
| French | Given + surname; 10% second given, 15% second surname joined by space |
| Italian | Given + surname; 15% second given, 5% second surname joined by space |
| Russian | Given + surname, with a patronymic 75% of the time |
| Polish | Given + surname; 25% second given, 10% hyphenated second surname |
| Greek | Given + surname; 10% second given |
| Spanish | One or two given names (15% second), then two space-separated surnames |
| Chinese, Japanese, Korean, Vietnamese | Surname first, then one complete stored given-name entry; no random extra names |
| Arabic | Given + surname; 50% includes father's male given name, half with ibn/bin or bint |
| Dutch, Swedish, Turkish, Ukrainian, Hindi | One given + one surname; Ukrainian omits patronymics |
| Tamil | Distinct father's full given name + person's given name; no hereditary surname pool |

An optional runner nickname follows surname-first/Tamil names and precedes surnames elsewhere. Informal Russian names remain separate nickname entries. Probabilities are adjustable display choices, not demographic estimates; these rules do not cover every cultural or legal naming practice.

Mixed chooses a surname tradition uniformly, then a different compatible given-name tradition. Surname rules determine order and variation; extra given names use the given-name tradition, while Russian patronymics and Arabic fathers use the surname tradition. Tamil supplies given names only. Fewer than two suitable traditions raises an error.

Regional mixes choose one complete naming tradition per person using editable relative weights in `src/data/sovereignties.ts` and `continents.ts`. Weights are generator choices, not canon population shares. Umbrella regions are browsing conveniences. Excluded, empty, and incompatible traditions are skipped; exhausted mixes explain what is missing. Generic offers six continent choices; setting flavors use their tagged states and alternate labels. Regional and Mixed choices do not imply citizenship or ancestry.

Pending traditions remain listed in `src/data/names/pending.ts`. They require sourced names and composition rules before activation. Do not substitute the inherited general Native American pool for specific peoples. Africa, South America, and Oceania have particularly limited coverage; show the existing coverage notes.

Exact data sources, reuse terms, spelling conversions, and limits remain in [personal-name sources](../name-data-sources.md) and [regional sources](../sovereignty-name-sources.md); required notices ship in `public/name-data-notices.txt`.

Construction references: [W3C](https://www.w3.org/International/questions/qa-personal-names), [Spain](https://www.gov.uk/government/publications/spain-knowledge-base-profile/spain-knowledge-base-profile), [Arabic naming guide](https://www.fbiic.gov/public/2008/nov/Naming_practice_guide_UK_2006.pdf), [UK](https://www.gov.uk/government/publications/change-of-name-passport-applications-caseworker-guidance/names-change-of-name-passport-applications-accessible), [US](https://fam.state.gov/fam/08fam/08fam040301.html), [Germany](https://www.bmj.de/SharedDocs/Pressemitteilungen/DE/2025/0429_Namensrecht.html), [France](https://www.service-public.gouv.fr/particuliers/vosdroits/F10505), [Italy](https://www.cortecostituzionale.it/scheda-pronuncia/2022/131), and [India](https://www.gov.uk/government/publications/india-knowledge-base-profile/india-knowledge-base-profile).
