# Character data and CBR+PNK sheet

The active CBR+PNK definitions and archetype profiles are local editable data, separate from the generator's `RawBit` fragment pools. CBR+PNK is a rules system; Generic, Shadowrun, and CP 2020/77 remain the three route flavors.

## Files

- `src/data/characters/types.ts`: sheet state, definition, archetype, and profile types.
- `src/data/characters/cbr-pnk.ts`: active definitions, archetypes, source profiles, and source notes, checked with `satisfies CharacterCatalogue`.
- `src/data/characters/cbr-pnk-sheet.ts`: labels, gear, expertise choices, and wording matches transcribed from the supplied sheet.
- `src/data/augmentations.ts`: the shared random augmentation pool and its archetype links.
- `src/stores/character.ts`: editable sheet state and profile application.

Unused import tables for augmentation categories, imported augmentations, system bindings, module configuration, and flavor configuration have been removed, along with their unused types. The app uses route flavor filtering and the shared augmentation pool. Stable IDs, active labels, rating vectors, expertise suggestions, and source mapping notes remain unchanged. Mage still has no profile.

## Sheet behavior

The sheet reads its system, attribute, and skill definitions from this catalogue. Pinia (`src/stores/character.ts`) holds a `CharacterSheet` with nullable ratings restricted to 0, 1, or 2, per-skill lists of selected preset expertises, and glitch marks linked by definition IDs, and Harm descriptions and independent slot marks for levels 1–3. Harm slot counts follow the supplied image (2/2/1), with no automatic escalation. Each editable rating uses two cumulative + checkboxes (maximum 2). Expertise presets come from the supplied Skills card and allow zero through all choices independently of ratings; selections start empty. Glitched is a separate boolean that shows the negative name beside the original and switches the color, never a rating of 3. Generate copies the linked CBR+PNK profile’s Approaches and Skills by definition ID. A stored skill rating of 3 becomes two rating points plus one randomly selected matching expertise, as clarified by the user. Other ratings copy directly, including explicit zeroes. Choosing an archetype in the Generate picker replaces prior ratings and expertise selections; a missing profile leaves these fields blank. Harm, Stress, and Approach Glitched marks keep their existing values. Choosing an archetype also fills the first augmentation slot with one randomly selected linked entry from `src/data/augmentations.ts`, using current route flavor naming and the existing augmentation generator’s optional descriptor, purpose text when present, and manufacturer. These parts are joined with ` · ` in the editable line. It clears the other two augmentation descriptions and all augmentation Glitched marks. With no linked entries, all three slots stay blank. After choosing an archetype and applying its profile, Approaches and Skills each independently have a 20% chance to move one point from a field rated 1 or 2 to another nonblank field below 2. Each total stays the same, ratings remain 0–2, and expertise stays with its original skill. Missing profiles are not varied. Each application starts from the source profile rather than accumulating moves. Source profiles remain unchanged. The sheet also stores a runner alias and a combined name/description. The Runner card’s Generate button fills these fields and the runner’s `archetypeId` from the existing Runners name category using the current route flavor. Display labels in `cbr-pnk-sheet.ts` are transcribed from the user-supplied sheet image; they do not add numerical rules. Attune is shown with a Weird label, without enabling or enforcing modules. Edits survive navigation and reloads through local storage (`gen0.character`). The sheet loads usable saved data once and saves edits automatically; missing, invalid, or unreadable data leaves the default blank sheet. Every runner profession bit references an existing archetype through `archetypeId` (for example, Netrunner → `hacker`). The main profession supplies the generated runner’s link; optional secondary profession text does not change it. Generate and Reset share the Runner heading row. Generate opens the same picker component used for categories, without its search field, listing existing catalogue archetypes. Choosing one generates the runner and applies its profile; cancelling leaves the sheet unchanged. The selected ID is saved with the sheet, with no dropdown on the card. Older saved runner fields without an archetype link remain usable. Main professions are filtered by the chosen archetype after flavor filtering, keeping duplicate weights; when no matching profession exists, the role uses the existing catalogue archetype name. Broad matches use Marksman for Gun Nut, Infiltrator for Assassin/Corporate Spy/Thief, Face for Job Contact/Fixer, Brawler for Adept/Martial Artist, and Mage for Mage Adept/Combat Mage.


## CBR+PNK profiles

Attributes are generic model entities but belong to their system. CBR+PNK calls them Approaches. Their values here are dice ratings, not universal ability scores. Keep Skills separate from Attributes.

Profiles provide complete rating vectors, including explicit zeroes for source-omitted ratings. A zero is different from an unavailable attribute or skill. Skill Attune is marked Weird on the sheet; module requirements remain source metadata and are not enforced.

| Generic archetype | Source build | Mapping | Requirements / caveat |
| --- | --- | --- | --- |
| Hacker | Console Cowgirl | Direct rename | Core |
| Driver | Daredevil | Direct rename | Core |
| Face | Face | Direct | Core |
| Rigger | Gearhead | Adapted name | Core; engineering-focused. Puppetmaster is an alternative, not merged. |
| Infiltrator | Infiltrator | Direct | Core |
| Analyst | Investigator | Direct rename | Core |
| Marksman | Marksman | Direct | Core |
| Scientist | Weird Scientist | Adapted name | Core + Weird; not a mundane scientist profile. |
| Brawler | Soldier | Adapted name | Core; retains Ranged Combat 2 and all other Soldier ratings. |
| Shaman | Witch Doctor | Adapted name | Core + Weird; expertise remains Artifacts. |
| Technomancer | Technoshaman | Adapted name | Core + Weird; expertise remains Spirits. |
| Mage | None | Unconfigured | Archetype exists; no CBR+PNK profile. |
| Street Samurai | Street Samurai | Direct | Core |

Source builds Mastermind, Medic, Ninja, and Puppetmaster are not seeded as profiles because they have no agreed mapping in the requested list. Brawler, Rigger, Scientist, Shaman, and Technomancer mappings are provisional design decisions. Source ratings remain unchanged; a renamed archetype does not imply redesigned mechanics.

Each source profile has attribute total 4 and skill total 8. The user clarified that a third skill point represents an expertise: the sheet shows two rating points and one expertise, without an extra die. Profile expertise wording maps to existing Skills card choices: Hacking → Hack, Motorcycles → Bikes, Situations → Situation, and Katana/Monofilament whip → Weapon. Options without a matching preset (Planes and Paranormal Sciences) are omitted from automatic selection; other matching source options remain eligible. `cbr-pnk-sheet.ts` holds these wording matches. Profiles with no third skill point select no expertise automatically.

## Random augmentation archetype links

The separate random pool in `src/data/augmentations.ts` now uses `AugmentationBit`, extending `RawBit` with a required `archetypeIds` list. These are editable suitability matches inferred from each existing entry’s purpose, not restrictions, mechanical effects, or canon build recommendations. All existing entries, labels, order, flavor names, and selection weights are retained. The links survive normal `load()` flavor resolution and supply one random linked entry when an archetype is applied to the character sheet. Standalone augmentation generation still uses the full pool. The unused imported augmentation catalogue and profile suggestion links have been removed. Source notes remain for provenance; they do not drive selection.

| Augmentations | Linked archetypes |
| --- | --- |
| Racing legs | Driver, Infiltrator |
| Wired reflexes | Driver, Infiltrator, Street Samurai |
| Thermal vision, Cybereyes, Kiroshi Optics, Low-light vision | Marksman, Infiltrator, Analyst, Street Samurai |
| Augmented strength, Gorilla Arms, Reinforced bones, Muscle replacement, Cyberarm | Brawler, Street Samurai |
| Concealed blade, Mantis Blades, Monowire, Hand razors, Spurs | Brawler, Street Samurai, Infiltrator |
| Chemical reservoir, Nanobot reservoir | Scientist |
| Neural firewall, Implanted cyberdeck, Datajack, Cyberjack | Hacker |
| Behavioral analyzer | Face, Analyst |
| Toxin neutralizer, Fireproof coating, Blood Pump, Biomonitor, Second Heart, Syn-Lungs, Internal air tank | Brawler, Street Samurai |
| Smart targeting link, Ballistic Coprocessor, Projectile Launch System | Marksman, Street Samurai |
| Subdermal armor | Brawler, Street Samurai |
| Sandevistan | Brawler, Marksman, Street Samurai |
| Kerenzikov, Reaction enhancers | Driver, Marksman, Street Samurai |
| Berserk, Microrotors | Brawler, Street Samurai |
| Optical camo, Lynx Paws | Infiltrator |
| Fingertip compartment | Infiltrator, Face |
| Reinforced Tendons, Fortified Ankles, Cyberleg | Infiltrator, Brawler |
| Control rig | Driver, Rigger |
| Implanted communicator | Face, Hacker, Rigger, Analyst |
| Vision magnification, Flare compensation | Marksman, Analyst, Driver |
| Cyberears, Sound filter, Olfactory booster | Analyst, Infiltrator |
| Voice modulator | Face, Infiltrator |
| Skillwires | Brawler, Infiltrator, Driver |
| Simrig | Analyst, Face |
| Chemical analyzer | Analyst, Scientist |

Mage, Shaman, and Technomancer have zero augmentation links, in this random pool, as requested.

## Source

Profiles came from the user-supplied `character-generator-model.zip`, attributed there to Jonathan Loy's [CBR+PNK Character Creation Aid](https://www.scribd.com/document/871960255/CBR-PNK-Character-Creation-Aid). The package did not independently check the original PDF pages. Imported archetype descriptions and provisional mappings are supplied design choices, not independently verified canon. The cleanup adds no list entries and does not change source ratings or expertise wording.
