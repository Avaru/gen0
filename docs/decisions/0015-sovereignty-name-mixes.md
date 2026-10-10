# 0015: Names by sovereignty

Date: 2026-10-10
Status: Accepted

## Reason and behavior

The user requested names for setting-specific states, using existing nationality pools, and asked for compact choices rather than another exhaustive country list. Nationalities are the least important picker group and appear last.

- Add Names by sovereignty before Names by nationality. Hide it in generic cyberpunk; show only entries tagged for the selected setting. The picker, generation, URL normalization and flavor changes use the same availability rules. Programmatic tag overrides remain supported; exclusions win.
- Keep distinctive states such as UCAS, CAS, ADL, Aztlan and NUSA. Combine European countries into Europe, Cyberpunk's Free States into one choice, and Shadowrun's Native American Nations and Chinese successor states into umbrella choices. These umbrellas are browsing conveniences, not claims that they are single sovereign countries.
- Shared concepts retain stable IDs and use flavor names, such as Japan / Japanese Imperial State and India / Indian Union. ADL is Shadowrun-only; Cyberpunk uses Europe instead of a duplicate Germany category.
- Store state labels, flavor tags, lore links and editable relative nationality weights in `src/data/sovereignties.ts`. Select a complete naming tradition per person and reuse its gender, order and composition rules. These weights are editorial generator choices, not canon population percentages. The existing Mixed category still combines traditions within individual names.
- Keep missing pools as empty TypeScript arrays in `src/data/names/pending.ts`, with visible X TODO entries under nationality. Skip them in sovereignty generation and show which pools are pending. An entirely empty state explains what is missing instead of inventing names. Filling a placeholder also requires sourced data, suitable composition rules and removing its TODO status.
- Changing to a flavor where the selected state is unavailable falls back to Runners. Shared state selections retain their ID and change their displayed name. Existing known-corporation fallback remains Corporations.

## Limits

The combined Cyberpunk flavor spans several eras. NUSA is the later-era label; Free State status and boundaries change over time. There is no date control or claim of a single exact-year political map.

Missing Indigenous, Irish, Mexican, Brazilian, Filipino and other data makes several mixes incomplete. The inherited general Native American pool is not substituted for specific peoples. Europe, China and India are broad convenience mixes, not comprehensive coverage of their languages or cultures. See `docs/sovereignty-name-sources.md` for the checked sources and practical limits.
