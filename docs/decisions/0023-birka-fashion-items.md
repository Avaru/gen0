# 0023: Birka and fashion items

Date: 2026-10-10
Status: Postponed

## Current behavior

The user requested removing Birka for now while preserving the fashion lists for later. Birka is removed from the flavor options, theme mapping, and availability defaults. Fashion Items is removed from the category registry and its composition function is removed. Old Birka/Fashion Items links normalize to Generic runners.

Keep `src/data/fashion.ts` with a TODO explaining that its currently unused lists are saved for restoring Birka later. The six attributes, 72 fashion tags, nine main slots and accessory types, and seven tiers remain intact, including plural Shoes, Socks, Gloves, Bottoms, and Overalls.

## Planned behavior when restored

Birka shares Generic content and appearance. Fashion Items combines one attribute, one fashion tag (two distinct tags with 20% probability), and an item name. Ignore the original odd/even tag grouping. Choose a main slot before any accessory or dress/overalls subtype; show Tier SSS–D in details.

No extra categories, theme, filters, or storage are planned by this note.
