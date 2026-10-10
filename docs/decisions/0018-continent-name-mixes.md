# 0018: Continent name mixes

Date: 2026-10-10
Status: Accepted

## Reason and behavior

The user requested Mixed at the top of nationalities and a Names by continent group for generic cyberpunk.

- Mixed is first within Names by nationality; that group remains last in the picker.
- Generic cyberpunk offers Africa, Asia, Europe, North America, South America and Oceania. Setting flavors retain Names by sovereignty instead. There is no Antarctica entry because there is no permanent local naming population to represent.
- Continent labels, flavor tags, editable nationality mixes and coverage notes live in `src/data/continents.ts`. The group appears immediately before nationalities and follows the existing flavor-tag inclusion/exclusion rules.
- Reuse complete-name mixing from the sovereignty generator, including gender selection, cached eligible pools, each tradition's name order and character details. Relative weights are generator choices rather than census figures. The existing Mixed generator remains a separate way to combine parts from different traditions.
- Reuse URL restoration, Back/Forward and the unavailable-category fallback to Runners when changing flavor.
- Missing pools remain visible as nationality TODO entries and in the regional settings. Add empty Māori and Aboriginal Australian placeholders for Oceania. These reserve future sourcing work; the broad Aboriginal Australian placeholder requires specific peoples and naming rules before it is filled.

## Limits

The current pools give Europe, Asia and North America more variety. Africa can currently generate only from the Arabic pool, while Ghanaian names remain TODO. South America uses the existing Spanish and Japanese pools while Brazilian Portuguese is pending; local Spanish-language and Indigenous traditions remain uncovered. Oceania reuses British, US American, Chinese and Hindi names while its local traditions are missing. Show short coverage notes for these three choices rather than implying comprehensive coverage.

Transcontinental and diaspora traditions can appear in more than one continent. Neither a name nor a selected category determines someone's citizenship or ancestry. Existing source data is unchanged.
