# Character generator data model

This document describes the character data model and initial CBR+PNK catalogue imported from the supplied `character-generator-model.zip` into gen0. The archive was removed after import and exact seed comparison. The types and seed now also back a blank editable CBR+PNK runner sheet. No character generator, database, or remote data service is added.

## Files

- [`src/data/characters/types.ts`](../src/data/characters/types.ts): TypeScript interfaces for all entities.
- [`src/data/characters/cbr-pnk.ts`](../src/data/characters/cbr-pnk.ts): `cbrPnkCatalogue`, checked with `satisfies CharacterCatalogue`; preserves every supplied JSON value, ID, array order, and duplicate.
- This document: architecture, mappings, selection rules, and integration limits.

The existing `RawBit` type describes text fragments, not linked system ratings. This catalogue stays separate from those pools and from `src/data/augmentations.ts`. `CharacterCatalogue`, `CharacterFlavor`, and `CharacterGeneratorContext` distinguish the imported model from current generator types. Fields retain the supplied camelCase names. Flavor IDs use the existing `Flavor` union from `src/generator/options.ts`: `cyberpunk` (Generic), `shadowrun`, and `cyberpunk2020-2077` (CP 2020/77). CBR+PNK is a rules system, not a fourth flavor. The sheet reads its system, attribute, and skill definitions from this catalogue. Pinia (`src/stores/character.ts`) holds a `CharacterSheet` with nullable ratings restricted to 0, 1, or 2, free-text expertise, and glitch marks linked by definition IDs, and Harm descriptions and independent slot marks for levels 1–3. Harm slot counts follow the supplied image (2/2/1), with no automatic escalation. Each editable rating uses two cumulative + checkboxes (maximum 2). Glitched is a separate boolean that shows the negative name beside the original and switches the color, never a rating of 3. Source profile ratings remain preserved separately, including provisional values of 3; they are not applied to this sheet. No archetype profile is applied. Display labels in `cbr-pnk-sheet.ts` are transcribed from the user-supplied sheet image; they do not add numerical rules. Attune is shown with a Weird label, without enabling or enforcing modules. Edits survive navigation and reset on reload. Existing bits may later reference stable archetype IDs (for example, a “Netrunner” bit linking to `hacker`); no bit links or new bit fields are added here.

## Separation of responsibilities

| Entity | Responsibility |
| --- | --- |
| System | Rules identity, e.g. CBR+PNK. Owns the label “Approaches”. |
| Attribute | A system-specific attribute definition; CBR+PNK has Aggressive, Smart, Empathic, Stealthy. |
| Skill | A separate system-specific skill definition, with optional module requirements. |
| SystemModule | Core or optional rules, e.g. CBR+PNK Weird. Independent of flavor. |
| Archetype | Stable generic identity, description, and default name. No system statistics. |
| ArchetypeSystemProfile | Complete attribute and skill ratings for one archetype in one system, expertise suggestions, and augmentation suggestions. |
| AugmentationCategory | Generic capability category such as hacking, communication, or resilience. |
| Augmentation | Generic augmentation identity with one or more categories. No invented numerical effects. |
| AugmentationSystemBinding | System/source-specific display name for a generic augmentation. Multiple names may refer to the same capability. |
| CharacterFlavor | Setting or aesthetic identity. Uses gen0 flavor IDs; no availability or override rows are seeded. |
| FlavorSystem | Explicit supported attributes, skills, and augmentation support for one flavor/system pairing. |
| FlavorArchetype | Flavor-specific availability, name, and description overrides for an archetype. |
| FlavorAugmentation | Flavor-specific availability and display-name override for an augmentation. |

All IDs are stable, opaque strings from the app's perspective. The readable seed IDs ease review. Rename labels without renaming IDs. References use IDs, never array positions or display names. `schemaVersion` versions the catalogue format, not the game edition.

## CBR+PNK profiles

Attributes are generic model entities but belong to their system. CBR+PNK calls them Approaches. Their values here are dice ratings, not universal ability scores. Keep Skills separate from Attributes.

Profiles provide complete rating vectors, including explicit zeroes for source-omitted ratings. A zero is different from an unavailable attribute or skill. Skill Attune belongs to the Weird module: an explicit zero in a core profile does not make Attune available.

The attribute ratings also express each archetype's attribute focus: higher ratings indicate greater emphasis. A future generator can derive a ranked preference from these ratings, preserving ties. No second, conflicting set of focus weights is stored.

| Generic archetype | Source build | Mapping | Requirements / caveat |
| --- | --- | --- | --- |
| Hacker | Console Cowgirl | Direct rename | Core |
| Driver | Daredevil | Direct rename | Core |
| Face | Face | Direct | Core |
| Rigger | Gearhead | Adapted name | Core; engineering-focused. Puppetmaster is an alternative, not merged. |
| Infiltrator | Infiltrator | Direct | Core; source augmentation entry may be incomplete. |
| Analyst | Investigator | Direct rename | Core; no augmentation suggestions supplied. |
| Marksman | Marksman | Direct | Core |
| Scientist | Weird Scientist | Adapted name | Core + Weird; not a mundane scientist profile. |
| Brawler | Soldier | Adapted name | Core; retains Ranged Combat 2 and all other Soldier ratings. |
| Shaman | Witch Doctor | Adapted name | Core + Weird; expertise remains Artifacts. |
| Technomancer | Technoshaman | Adapted name | Core + Weird; expertise remains Spirits. |
| Mage | None | Unconfigured | Archetype exists; no CBR+PNK profile. |
| Street Samurai | Street Samurai | Direct | Core |

Source builds Mastermind, Medic, Ninja, and Puppetmaster are not seeded as profiles because they have no agreed mapping in the requested list. Brawler, Rigger, Scientist, Shaman, and Technomancer mappings are provisional design decisions. Source ratings remain unchanged; a renamed archetype does not imply redesigned mechanics.

Each configured profile has attribute total 4 and skill total 8, matching the displayed list. Expertise is preserved as a suggested choice of one listed option. The seed does not settle whether the source's “3 with expertise” should be interpreted as three skill dice or a total allocation including an expertise cost. Verify that against the edition used by the app before generating playable sheets. Do not automatically add a bonus die or independently spend expertise points from this data.

## Augmentation categories

Categories are many-to-many capability tags. They are independent of attributes and skills: an augmentation tagged agility does not automatically increase any CBR+PNK Approach. Several examples distinguish frequently conflated capabilities.

| Category | Examples / meaning |
| --- | --- |
| Agility | Wired reflexes, adrenal booster |
| Strength | Power legs |
| Mobility | Power legs, prehensile tail |
| Perception | Enhanced eyes, sonar, ocular drone |
| Communication | Vocal synthesizer, A/V effects, wireless datajack |
| Negotiation | Pheromone excretor, provisionally inferred as social influence |
| Hacking | Biochip, wireless datajack |
| Device control | Drone control, remote firing, kill switch |
| Stealth | Appearance scrambler |
| Combat | Razor claws, toxin fangs, remote firing |
| Resilience | Armor, resuscitation |
| Analysis | Chemical analyzer, biochip |
| Engineering | Multitool hand |

The source provides augmentation names rather than mechanical descriptions. Categorization is therefore inferred and each augmentation records `categorizationBasis`. Uncertain capabilities have notes. Communication and negotiation remain distinct: a new voice does not automatically improve persuasion. Likewise, reflexes do not automatically grant strength.

Brand names are retained in `augmentationSystemBindings`, while generic capability names live in `augmentations`. Datatek and Ivaldi & Sons Biochips share the Biochip identity; Weyland and Caliburn multitool hands share the Multitool hand identity. This grouping is for suggestions, not a claim that differently branded equipment has identical mechanics. Split them into separate entities if detailed item rules later differ.

The prior conversation normalized the source's apparent “Invalid and Sons” to “Ivaldi & Sons”. The seed preserves that normalization; check original pages before treating it as an authoritative brand spelling. The augmentation list covers suggestions in the requested profiles and retained source names from the preceding list. It does not import the full random augmentation/brand tables.

## Flavor naming and unavailable aspects

Use the unconfigured catalogue when `CharacterGeneratorContext.flavorId` is null. For a concrete flavor, require an enabled `FlavorSystem`, enabled `FlavorArchetype`, and any required enabled `FlavorAugmentation` entries. Missing entries mean unavailable; do not silently treat an unconfigured flavor as generic.

`FlavorSystem.availableAttributeIds` and `availableSkillIds` explicitly allow mechanical aspects in that setting. A profile with a positive rating in an excluded aspect is incompatible; reject it rather than silently dropping points. Missing core attributes also make a profile incompatible, even if their rating is zero. Module availability additionally governs skills such as Attune. Setting availability never enables a disabled module.

`supportsAugmentations: false` makes augmentation suggestions unavailable for that flavor/system pairing. An otherwise valid archetype profile can still be selected: augmentation suggestions are optional. Never replace inaccessible suggestions automatically without a documented generator policy.

Display-name resolution:

1. For archetypes: flavor `nameOverride` if non-null, otherwise generic `Archetype.name`.
2. For augmentations: flavor `nameOverride` if non-null, otherwise generic `Augmentation.name`.
3. System binding names are optional edition/source labels for the app to present or select; when multiple exist, do not arbitrarily choose the first.

Example flavor configuration can call the generic Hacker “Netrunner”, disable Mage, and prohibit augmentations. None of these changes affects Hacker's stable ID or its system profile. The app's Generic flavor (`cyberpunk`) is a concrete flavor, distinct from `null`. All flavor arrays remain empty, so no concrete gen0 flavor is configured for CBR+PNK yet. Any future implementation must preserve gen0's flavor labels, `flavorNames`/`flavorShortNames`, exclusions, and nested-option rules; this catalogue does not replace them.

## Future generator selection

1. Resolve the system and enabled module IDs; include its core module and reject foreign module IDs.
2. Resolve optional flavor restrictions.
3. Find the archetype's profile for that system. No profile means unsupported; Mage is currently unsupported in CBR+PNK.
4. Require all profile modules and all positive-rated skills' modules to be enabled. Require flavor compatibility if a flavor is selected.
5. Copy the profile's ratings into a new character, filtering zero-rated unavailable optional skills from display without treating them as purchased skills.
6. Present expertise options as choices and apply the verified system's rules.
7. Filter augmentation suggestions through system binding requirements and flavor availability; present eligible choices. Suggestions are not mandatory equipment.

No generator is implemented in this package. A future generator also needs rules for gear, names, motivations, appearance, and legal character allocation.

## Integrity and local integration

Validate uniqueness of IDs, reference existence, system ownership of ratings, module ownership, finite nonnegative integer ratings, unique rating keys, completeness of rating vectors, expertise skill references, and category references. For this seed, totals are 4 attribute and 8 skill ratings; do not impose those totals globally on other systems.

The initial model has one profile per `(archetypeId, systemId)` and one binding per flavor/system, flavor/archetype, or flavor/augmentation pair. Multiple profiles for one archetype/system pairing are outside this model. Rigger's Gearhead mapping does not silently include Puppetmaster.

Keep this as local editable data. Do not attach flavor overrides or system stats directly to archetypes, reinterpret display-name changes as new archetypes, or store undefined as zero. Empty suggestion arrays mean “no suggestion”, not “forbidden”. Selection rules above describe the supplied model; no filtering or generation is implemented.

## Source and verification

The seed is based on the mechanical list recorded in the supplied package's prior conversation, originally attributed to Jonathan Loy's *CBR+PNK Character Creation Aid*: https://www.scribd.com/document/871960255/CBR-PNK-Character-Creation-Aid. The package states that original PDF pages were not inspected; this import does not independently verify game rules or source spelling. Generic descriptions, mappings, category tags, and model architecture are design work supplied by the package, not independently sourced canon. They are preserved under the explicit request to import this seed; no new list entries were authored during integration.

The original package reports internal reference and rating-vector checks, with all twelve configured profiles retaining totals 4/8, but no TypeScript compilation. The imported seed was compared against the archive and matches exactly. Internal IDs, references, complete rating vectors, module ownership, 4/8 totals, empty flavor configuration, and Mage's missing profile were checked again. gen0 adds a compile-time shape check through `satisfies CharacterCatalogue`. These checks do not certify playable characters or resolve the provisional mappings and expertise interpretation above.
