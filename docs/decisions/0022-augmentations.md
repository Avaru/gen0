# 0022: Augmentations

Date: 2026-10-10
Status: Accepted

Add Augmentations under Equipment. Compose an optional first attribute (25% chance) and one augmentation type from the CBR+PNK, Cyberpunk 2077, and Shadowrun lists discussed with the user. High-class and Low-class are separate attributes. Only obscure augmentation names retain a short description. When present, it comes first, followed by the manufacturer name prefixed with "Manufacturer:" on a new line. Self-explanatory types show only the manufacturer, without a blank description line. Both use the existing details field and Show details control. No additional settings are needed; the existing category URL behavior applies.

Keep attributes and types editable in src/data/augmentations.ts, use the local loader for availability and alternate names, and compose results in src/patterns/cyberpunk/augmentations/. All augmentation types are available in every flavor, including distinctive Shadowrun and Cyberpunk names. This category intentionally has no flavor availability restrictions. Stable concept IDs link shared alternate terms such as Smartlink/Smart Link and Bone lacing/Titanium Bones. Shared alternate spellings still follow the flavor. Include/exclude overrides continue to apply to nested company generation, with exclusions winning; excluding a flavor does not remove augmentation types.

Manufacturers come from the existing flavor-filtered company names, preferring a small list of relevant companies, or from the company-name generator. Kiroshi Optics retains Kiroshi as its manufacturer. Combinations are fictional products, not verified manufacturer catalogues; descriptions state purpose without game statistics. The combined CP 2020/77 flavor includes 2077 concepts without claiming availability in 2020.

Source terminology: the lists discussed in this chat; https://cbrpnk.cabinetofcuriosities.games/docs/en/runnerfile ; https://www.gamesatlas.com/cyberpunk-2077/cyberware/ ; https://inky.org/scratch/shadowrun/QuickStart.pdf ; https://shadowrunsixthworld.com/2019/07/17/the-matrix-in-sr6/ . Descriptions are concise original summaries.
