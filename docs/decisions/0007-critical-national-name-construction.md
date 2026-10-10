# 0007: Chinese, Japanese, Spanish and Arabic name construction

Date: 2026-10-10
Status: Accepted

## Reason

Apply the remaining critical construction changes from the nationality review. A shared rule with random extra given names and surnames does not fit these naming traditions. Keep modern names, reusable name parts, and plausible variation where the tradition supports it.

## Decision

- Chinese and Japanese names use one stored surname followed by one stored given name. Preserve compound entries as a whole; do not add random second names or reverse the order for nicknames. An optional runner nickname follows the personal name.
- Spanish names use one or two given names and two space-separated surnames. Keep the existing 15% second-given-name rate. Do not randomly omit the second surname.
- Arabic names use one given name and one surname, with a 50% chance of including the father's male given name between them. Half of those longer names explicitly introduce the father with `ibn` or `bin` for men, or `bint` for women; the rest use the father's name directly. Never substitute a surname for the father's given name or randomly add `Al-` to a surname.
- Use the existing name-part selection helpers for all four traditions, including Arabic. Pass generation options through every part selection. Leave the existing lists and other nationality rules unchanged.
- These probabilities provide adjustable display variation, not measured demographic frequencies. No new interface options or categories are added.

## Limits and sources

The broad Arabic category covers multiple regional traditions. These are supported simple modern forms, not a model of every country or extended genealogy. The inherited lists are retained without checking every spelling. Spanish output uses the full-name convention; a shortened everyday-name mode is not added.

Construction follows [W3C's personal names guide](https://www.w3.org/International/questions/qa-personal-names), [Spain's passport naming guidance](https://www.gov.uk/government/publications/spain-knowledge-base-profile/spain-knowledge-base-profile), and the Arabic sections of the [UK naming-practices guide](https://www.fbiic.gov/public/2008/nov/Naming_practice_guide_UK_2006.pdf). These rules supersede preservation of the four inherited composition patterns in decision 0001.
