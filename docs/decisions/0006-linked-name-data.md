# 0006: Personal names and regional mixes

Model naming traditions explicitly so direct, mixed, regional, and nested generators follow the same composition rules rather than treating every name as interchangeable parts.

- Keep typed lists under `src/data/names/`. Centralize tradition IDs, labels, order, and composition rules in `src/patterns/cyberpunk/nationality/traditions.ts`.
- Preserve compound names, diacritics, and reviewed name relationships. Retain IDs needed for patronymics or nickname links; unsupported explicit father lookups report errors. Deduplicate only where distinct parts are required.
- Select masculine/feminine forms once per person, equally when unrestricted, independently of pool sizes. Keep all parts consistent with that selection. Name forms do not determine a character's gender or identity.
- Mixed names combine different compatible given-name and surname traditions. Surname rules determine order; each tradition supplies its own name-part rules. Regional mixes choose one complete tradition using editable weights. Neither choice implies citizenship or ancestry.
- Probabilities and regional weights are generator choices, not demographic claims. Exact composition rules live in code. Skip excluded or incomplete traditions and explain exhausted pools.
- Pending traditions need sourced names and composition rules before activation. Keep coverage limits visible; do not substitute a general inherited pool for specific peoples.

Sources, reuse terms, and spelling conversions belong in [personal-name sources](../name-data-sources.md) and [regional sources](../sovereignty-name-sources.md). Required notices ship in `public/name-data-notices.txt`.
