# Modern personal-name data sources

Inspected and imported: 2026-10-10. Scope: the first eight recommended naming pools.

The counts below describe stored name parts, not generated full-name combinations. Distinct spellings count each displayed spelling once across genders and types. A spelling present for both genders can have two entries. Existing migrated lists remain unchanged.

| Pool | Given-name entries | Surname entries | Total entries | Distinct spellings |
|---|---:|---:|---:|---:|
| Dutch | 502 | 1,070 | 1,572 | 1,565 |
| Turkish | 1,507 | 60 | 1,567 | 1,552 |
| Ukrainian | 187 | 542 | 729 | 728 |
| Hindi-speaking Indian | 341 | 43 | 384 | 368 |
| Tamil | 992 | 0 | 992 | 964 |
| Korean | 540 | 112 | 652 | 649 |
| Vietnamese | 2,533 | 10 | 2,543 | 2,508 |
| Swedish | 3,942 | 2,000 | 5,942 | 5,771 |

Total additions: 14,381 entries.

## Sources and reuse

- **Swedish:** Statistics Sweden (SCB), *Names with at least two bearers, 31 December 2022*, published 2024-11-21. Read the normally-used given-name sheets and surname sheet; select the top 2,000 names in each by bearer count, with alphabetical tie-breaking. Remove initials, digits, and malformed entries. Where a given name appears in both gender lists, keep only its dominant classification at 95% or more; otherwise merge selected entries as unisex. This is a Swedish resident population pool, including names from different backgrounds, not a Swedish-language-only list. Source: Statistics Sweden; gen0 performs the selection and transformations. [Workbook](https://www.scb.se/contentassets/9fe7dbb460994c72b835163dbc491ef9/namn-med-minst-tva-barare-31-december-2022.xlsx). [Website reuse terms](https://www.scb.se/about-website): CC BY 4.0 for this website material. The separate API CC0 terms are not assumed for this workbook.

- **Dutch, Turkish, Ukrainian, Hindi, Tamil:** [Python Faker](https://github.com/joke2k/faker), MIT. Import only literal name lists, not generated combinations or upstream executable code. The providers describe their sources where available: Ukrainian lists refer to Ukrainian-language name references, Hindi to Hindi-name references and regional surname sections, and Tamil to Tamilcube. These are maintained reference collections, not census extracts. Dutch and Turkish provider inventories have no per-entry primary-source citations.

- **Korean:** [Faker JS Korean name lists](https://github.com/faker-js/faker/tree/next/src/locales/ko/person), MIT. Preserve its generic/male/female classification and whole given names. Generic entries supersede matching gender-specific entries. This is a maintained inventory, not Korean census frequency data.

- **Vietnamese:** [Van-Duyet Le, Vietnamese Name Database](https://github.com/duyet/vietnamese-namedb), MIT, `boy.txt` and `girl.txt`. Preserve complete accented given-name phrases, including any middle-name material already present. Use the ten surnames in Python Faker’s Vietnamese provider. Do not import `uit_member.json`, personal records, accent-free duplicates, or one-word expansions. The namedb author describes Internet aggregation rather than a single primary population table.

Full MIT notices and the SCB attribution/changes notice ship in [public/name-data-notices.txt](../public/name-data-notices.txt), copied into the static build.

## Selection, spellings and limits

- Normalize whitespace and Unicode to NFC; remove trailing commas/semicolons, digits, and invalid punctuation. Correct Vietnamese legacy `Ð`/`ð` to `Đ`/`đ`. Remove duplicate type/gender/display combinations. Do not manufacture names from arbitrary syllable combinations or count accent-free variants separately.
- Keep IDs only for names referenced by other entries, and preserve those IDs when correcting displayed spellings. Imported entries retain their exact source-file URL. Converted entries also retain the native spelling in `details`.
- Ukrainian uses a positional Latin transliteration table (initial Ye/Yi/Y/Yu/Ya, internal ie/i/i/iu/ia, h for г, g for ґ, and zgh for зг). Preserve the source’s male/female surname forms and link forms actually present; the category uses given name plus surname without a patronymic.
- Korean uses syllable-based Latin spelling with hyphens within given names and common surname spellings such as Kim, Lee, and Park. This is not a full pronunciation-based romanization engine or a claim about an individual’s passport spelling.
- Hindi starts with ICU Latin transliteration, simplifies diacritics, removes final short inherent a where appropriate, and corrects a small set of conventional spellings such as Amit, Aditya, Akbar, Sharma, Chopra, and Tiwari. Keep only the provider’s North/Central Indian surname sections. Move its plainly feminine Akanksha entry to the feminine pool. This limited pool is not a complete regional, religious, or pronunciation audit.
- Tamil uses ICU scholarly Latin transliteration, retaining vowel/consonant diacritics and removing transliteration separator apostrophes. It is not a list of conventional English spellings. Use only given names; the source’s reuse of given names as surnames is deliberately omitted. Display the father's given name in full before the person's given name, using distinct names.
- Vietnamese, Hindi, Turkish, and Korean surname pools are smaller than their given-name pools. The minimum of several hundred distinct names applies to each overall tradition, not to every gender or surname sublist. Tamil has no hereditary surname entries.
- Names are sampled uniformly within each eligible part pool. Counts are used to select Swedish inventory entries, not to reproduce population frequencies. The lists include some uncommon, historical, regional, and imperfectly classified names from the documented collections. Native-speaker review could improve them.

## Name-quality review

Reviewed all eight added pools for abbreviation-like given names, isolated initials, malformed punctuation, suspicious consonant sequences, and visible source-script/transliteration errors. These checks identify candidates for review; unfamiliar or short real names are not automatically rejected.

- Removed Swedish `Md` and `Mhd`, abbreviations rather than complete given names. Keep real short names such as `Bo` and `Lo`.
- Removed Tamil source spellings `சத்யராஐ`, `தங்கராஐ`, `யூவராஐன்`, `வரதராஐன்`, and `கஐலட்சுமி`, which contain apparent transcription substitutions. Their imported display values were `Catyarāai`, `Taṅkarāai`, `Yūvarāaiṉ`, `Varatarāaiṉ`, and `Kaailaṭcumi`. Omit these entries instead of guessing replacements.
- Removed Hindi source strings `िनशा` and `िकशोरी`, which start with a dependent vowel sign before a consonant and produced `Inasha` and `Ikashori`. A valid `Nisha` entry remains.
- Corrected Hindi Latin conversion artifacts: `nyj` to `nj` in Dhananjay, Manjunath, Manju, Manjula, Manjusha, and Ranjit; restored complete conventional endings in Harendra, Indra, Jayendra, Jitendra, Manindra, Narendra, Rajendra, Surendra, Rupindra, Padma, and Ratna; use the conventional surname spelling `Singh` for `सिंह`. Native source spellings remain recorded.
- Retained Turkish dotless-ı names, complete Korean vowel-only syllables, and Vietnamese `Ý` components. They are not initials or corrupt entries. A long, complete Dutch surname is also retained rather than shortened or discarded by a blanket length rule.
- Expanded Tamil father names in generation. Both name parts now display in full, with no repeated father/personal name, and exclusions still apply.

This is a targeted data-quality review, not a claim that every name has received a native-speaker cultural or pronunciation audit.

## Exact source snapshots

The following URLs are pinned to repository revisions where available. SHA-256 identifies the downloaded bytes; no runtime network requests or import scripts are required.

| Download | Source file | SHA-256 |
|---|---|---|
| nl.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/nl_NL/__init__.py) | `054ba4b04f4d9c40c58315c689d5b3c2f9a529de136678672bf240ef5924a4aa` |
| uk.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/uk_UA/__init__.py) | `5fa46d46386832f834099929fc3f33044135ffd0273d2e3e4a7b5843712e9dc8` |
| hi.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/hi_IN/__init__.py) | `ae70bcc43afbe97591f597e9a1ccd5a43d34db96d6f532378899bfd7705f4606` |
| ta.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/ta_IN/__init__.py) | `f1fdc6f3601e17f594d73dee8466ffa8ebfe514375536fe4e4a426a57a406e10` |
| tr.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/tr_TR/__init__.py) | `1bce48d23776525fbd7793f42a5be45f338709ff68148a3af54035a88ec9d36a` |
| vi.py | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/faker/providers/person/vi_VN/__init__.py) | `fabbf13f3aacd554bc8f783e3bae006b0846d7548b31e6f59ee999ca1ab9403e` |
| faker-license | [Source](https://raw.githubusercontent.com/joke2k/faker/df289bfde6b6c739bbac696ef432d69c9ec33ac1/LICENSE.txt) | `cd5a5fbc8bacca52b88158ca562ac5f7c2e9adb27371cead51aaf4e61a657928` |
| ko-js.ts | [Source](https://raw.githubusercontent.com/faker-js/faker/aec7cde332911cf9a002df77acfa468d9fcbc1c1/src/locales/ko/person/first_name.ts) | `fa558da89c94d8c92a8569ba621e3c48c5457184e646c7b05acbc6f2e24b2b00` |
| ko-last-js.ts | [Source](https://raw.githubusercontent.com/faker-js/faker/aec7cde332911cf9a002df77acfa468d9fcbc1c1/src/locales/ko/person/last_name.ts) | `ccc8cbcbf47af7da1c11e467c6a21b16c7a45421998678dc5fabc652370531f5` |
| faker-js-license | [Source](https://raw.githubusercontent.com/faker-js/faker/aec7cde332911cf9a002df77acfa468d9fcbc1c1/LICENSE) | `8c0814c525426e67c04ca562f28364be477003697903d257160c081d14b271bf` |
| vietnamese-boy.txt | [Source](https://raw.githubusercontent.com/duyet/vietnamese-namedb/2129070dde2471a2a2c0ef24a32c6c02ebd71805/boy.txt) | `c78d7880b4cf197b30e09330159b675c3a0faaba7694399bf871474458d6b24f` |
| vietnamese-girl.txt | [Source](https://raw.githubusercontent.com/duyet/vietnamese-namedb/2129070dde2471a2a2c0ef24a32c6c02ebd71805/girl.txt) | `939f7711ac87460eb06bcd533b121997eb038152b89adf16218d928a603669e4` |
| vietnamese-license | [Source](https://raw.githubusercontent.com/duyet/vietnamese-namedb/2129070dde2471a2a2c0ef24a32c6c02ebd71805/LICENSE) | `113793eb0409008cb32f7da3eef894fa0455e8963c8519ba17816fd66e9264b3` |
| sweden.xlsx | [Source](https://www.scb.se/contentassets/9fe7dbb460994c72b835163dbc491ef9/namn-med-minst-tva-barare-31-december-2022.xlsx) | `b099822f53baf393fc0dba8b2c8665b7475c3b2001b6efbbe1d96525709792e4` |
