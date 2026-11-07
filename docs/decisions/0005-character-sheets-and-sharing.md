# 0005: Character sheets and sharing

Full editable sheets use dedicated routes and Pinia stores. Share basic sheet components, URL compression, and synchronization while keeping each sheet's fields and rules separate. Sheets reuse existing generators and approved profiles, and remain editable aids rather than rules validators. Detailed fields, source mappings, and class rules live in the [character data model](../character-data-model.md).

## Saving and sharing

Save full-sheet edits locally and share them through a versioned, compressed `char` query parameter. Update the URL automatically through Vue Router after each Vue update, without a debounce, replacing history without overwriting newer edits. Copy the address-bar URL to save or share a character.

Valid URL data takes priority over local storage; without a character query, use the locally saved sheet. Validate versions and size bounds. Invalid links retain existing edits and show an error. Edits still save locally, and other generator and About URLs omit sheet data. Links contain the full character, require no backend, and can be read by anyone who has them. Long descriptions make longer links.

## CBR+PNK runner sheet

`/chars/cbrpnk` always uses Cyberpunk/Generic for its theme and generation, with no flavor query on its navigation link. The sheet is saved under `gen0.character` and starts blank when no usable saved sheet exists. Its catalogue lives in `src/data/characters/`.

The Runner card has editable Alias and Name & description fields, with Generate and Reset beside its heading. Generate opens the archetype picker; choosing one fills the runner fields from the existing Runners category using Generic and the chosen archetype. It also fills Approaches, Skills, and expertise from the matching CBR+PNK profile. A source skill value of 3 becomes two rating points plus one matching expertise.

After applying the profile, Approaches and Skills each independently have a 20% chance to move one point from a rating of 1 or 2 to another field below 2, keeping each total. Applying an archetype also picks one linked augmentation using the existing generator's flavor name, optional descriptor, purpose text when present, and manufacturer as one editable line. It fills the first slot, clears the other two slots and all augmentation Glitched marks, or leaves all slots blank when no links exist. Harm, Stress, and Approach Glitched marks remain manual. The random augmentation pool has [archetype suitability links](../character-data-model.md#random-augmentation-archetype-links) without restricting standalone generation.

Resist/Armor follows Stress. Its only control, Special Armor, turns the card yellow when checked and is saved with the sheet. Load/Gear tracks selected gear against Light [3], Medium [5], or Heavy [7], turns yellow at the limit and red above it, and saves its selections.

### Printing

Keep CBR+PNK printing separate from screen layout and preserve component state across responsive layouts. On the default-scheme sheet (Generic/Shadowrun), use the browser's Print command to print or Save as PDF: A4 portrait, 100% scale, browser headers/footers disabled. The print layout removes the app shell and actions, keeps the desktop card order in two columns, and shows selections without background graphics. Filled custom expertise fields use the selected expertise style and appear in print only when filled. Long descriptions wrap and may extend the sheet to further pages; claim print fit only after browser/PDF verification.

## Never Midnight student sheet

The feature-gated `/chars/never-midnight` route has its own Pinia store and local storage key, `gen0.character.never-midnight`, and shares compressed URL saving and restoration with CBR+PNK. It provides a student file, Blood/Thought/Voice Means, six disciplines, and editable spell and sacrifice lists.

Summon opens the nationality picker and fills the name and combined age/looks/occupation description. Small reroll buttons refresh either field using the chosen nationality. Summon also replaces the spell list with three spells from the Spells generator; each spell has a reroll button that replaces only its text. Name and description rerolls preserve spells.

Summon applies three occupation discipline bonuses and one matching subdomain, and randomly adds three Means points in a +2/+1 split. Description rerolls replace occupation bonuses and the subdomain while preserving Means; name rerolls preserve ratings. Keepsake and sacrifices stay manual. Spells are plain text without levels. Means, disciplines, and sacrifice ratings run from 1 to 3 and start at 1; spells and sacrifices start empty.

## Mothership mini sheet

Each generic name can open a mini character sheet below the generator controls, showing class, stats, saves, and randomly assigned starting skills. Name lists generate only the name, pronouns (equally from he/him, she/her, and they/them), class, appearance, trinket, and patch. Opening a card rolls the remaining fields for that class; reopening the same result rolls a fresh character. Starting gear is chosen equally from the ten supplied loadouts for that class and shown as a list above Trauma Response. Shared item definitions and loadout references, including quantities and ammunition, live in `src/data/characters/mothership-gear.ts`. Current Health, Wounds, and Stress can be adjusted. The open character, including these edits and its gear, is saved in a versioned, compressed `char` query parameter on `/mothership/generic`. Copy the address-bar URL to save or share it; opening the URL restores the card without rerolling. Browser Back/Forward restores the character in the URL. Invalid links keep the current card and show an error.

Shared skill definitions and class starting-skill rules live in `src/data/characters/mothership-skills.ts` and `mothership-rules.ts`. Every prerequisite list means any one is sufficient. Selection and prerequisite checks live in Mothership patterns; the mini sheet displays the assigned skills. Characters are not saved to local storage; only the open card holds the full character data.

A document icon beside each name's sheet arrow opens the shared modal with two columns on desktop and stacked cards on mobile. The layout follows the supplied character-profile reference, using the app's fonts, cards, and fields. Appearance uses the portrait-sized area as editable text. Player name, character name, pronouns, class, High Score, stats, saves, current/maximum resources, skills, equipment, armor points, credits, trinket/patch, conditions, and notes are editable. Pronouns use a plain text field. Trinket and patch are ordinary lines in the editable Equipment list in both views. High Score and the modal’s Current Health, Wounds, and Stress fields start blank. Entered current values are kept in the URL; clearing an input makes it blank again. The mini card keeps its starting resource values until adjusted. Stress shows its editable Minimum instead of a maximum. The minimum is shared with the mini card and stays fixed when its +/− controls change current Stress. Editing class changes its label and trauma response without rerolling other fields. Status Report puts the read-only, non-resizable trauma response without a heading above an initially empty Conditions field. The right column ends with an initially empty Notes card. Weapons sections and skill training are omitted. Existing weapon items remain in the generated equipment text.

The Image icon inside the bottom right of Appearance replaces the text field with a random portrait from the fixed set of 122 supplied JPGs. Portraits fill the area and crop as needed. Reroll at the bottom left always selects a different portrait; Remove image at the bottom right restores the unchanged appearance text. The portrait number is saved in the character URL and the selected image appears in print.

Modal edits update the same open character and its URL, including manual skill/equipment text and optional detail fields. Old version-1 links without these additions still load; absent pronouns remain blank. Opening and closing the modal does not reroll or reset edits.

The modal's Print button opens the browser print dialog. Printing an open modal includes only its sheet content, with field values instead of editing controls. The print page is A5 portrait with 7 mm margins (134 × 196 mm of usable space), leaving room for two sheets on A4 using the print dialog's two-pages-per-sheet option. The sheet fills one A5 page, with Conditions and Notes aligned at the bottom. Skills and Equipment keep eight and ten printed lines respectively; overflowing text stays within the allocated fields rather than adding pages.

The arrow rolls a fresh mini card. The document action opens the current character for that row without rerolling, or rolls it first when needed. Edits are reflected in its result row; restored URL characters appear at the start of the name list so the document action remains available.
