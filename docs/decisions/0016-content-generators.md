# 0016: Weapons, menus, shops, and device contents

Date: 2026-10-10
Status: Accepted

Bring these four generators over from the saved cyberpunk collections in the neighboring namegenerator project. Keep their useful composition patterns and editable fragments, without its server, database, import tooling, corporation detail pages, or extra location categories.

Store the adapted lists in src/data/weapons.ts, food-menu.ts, shops.ts, and device-data.ts. Register them through the same local loader and category registry. Shared fragments remain available in every flavor. Tag magical and metahuman references as Shadowrun; tag Cyberpunk-specific fragments separately. Alternate device, specialist, runner, payment, and video terms use stable IDs and flavorNames. Include/exclude rules continue to apply, with exclusions winning; every nested name and corporation receives the same options.

Device data is called Commlink data in Shadowrun and Shard data in Cyberpunk 2020/2077. Retain photos/recordings, access credentials, technical files, travel records, and maps. Supporting addresses are generated internally. Cities and Streets & plazas were subsequently requested as categories in decision 0028. Shops retain goods, shop types, appearance, and business hooks. Weapon modifications intended for firearms are omitted for melee weapons.

Weapons use generated manufacturers or available setting manufacturers with newly composed model/series names. These are invented products, not verified canon models or rules profiles. Shared model words such as Dragon do not imply magic. Cyberpunk includes Smart and Tech weapon descriptions; Shadowrun includes metahuman customization. Food prices are fictional 1–30 amounts in generic credits, Shadowrun ¥, or Cyberpunk €$; this is not an economy or price guide.

Sources: local dump/generator/cyberpunk-{names-shadowrun,nouns,attributes}.bson in namegenerator; existing gen0 corporation/name lists. Typographical errors and setting references in the imported fragments were reviewed during adaptation. Cyberpunk terminology checks: https://www.cyberpunk.net/en/news/42203/patch-1-52 (shards), https://www.cyberpunk.net/en/dlc (eddies), https://www.cyberpunk.net/en/news/49060/update-2-0 (Smart/Tech weapons). Kibble terminology: https://rtalsoriangames.com/2022/07/26/cyberpunk-red-alert-collecting-the-random-dlc/ (Cyberpunk setting food). The combined flavor is a broad setting pool, not a restriction to a particular year. No remote data is needed during generation.
