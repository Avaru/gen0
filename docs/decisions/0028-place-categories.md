# 0028: Cities and Streets & plazas categories

Date: 2026-10-11
Status: Accepted

Expose Cities and Streets & plazas in the existing Places group. Keep the current device-data address behavior unchanged. Reuse the existing city suffixes, location prefixes, corporate business fragments, and street types instead of duplicating them.

Migrate the missing 2,009 city-name bases and 33 city attributes from namegenerator/dump/generator/cyberpunk-names.bson and cyberpunk-attributes.bson into src/data/places.ts. Preserve their ordering and duplicate weights. Migrate the two ordinal choices from the old places/streets pattern; correct “disfunctional” to “dysfunctional.” Add no AI-authored list items or alternate wordings. The inherited place-name bases are US-tagged and include real cities and regions; generated names, populations, and economy descriptions are fictional, not real geographic facts.

Cities retain the old optional suffix, population, attribute, and economy pattern. Streets retain prefix/ordinal, city-or-setting-corporation, street type, and optional attribute. Generic falls back to city bases when no setting corporation is available. Reuse the existing corporate business pool for economic descriptions. All nested picks receive the selected flavor and include/exclude tags. Tag magical/metahuman/Matrix attributes as Shadowrun rather than inventing replacement descriptions.

This extends decision 0016's earlier exclusion of standalone place categories. No publishing, new controls, or new flavors are part of this change.
