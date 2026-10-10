# 0001: Local cyberpunk generator with configurable flavors

Date: 2026-10-10
Status: Accepted for the initial migration; flavor controls superseded by 0002

## Reason

Reuse pgen's Shadowrun name generation in gen0, while preparing a generic cyberpunk generator whose setting details can be enabled independently. Remove the fantasy generator, old presentation, and spreadsheet imports.

## Decision

- Use the existing Vue/Vite SPA. Bundle all required data with it; generation makes no server requests.
- Copy the active Shadowrun categories: names by nationality, corporations, runners, gangs, restaurants, bars, and movies. Preserve their name composition and descriptive details.
- Convert all four Shadowrun data lists and the shared modern personal names to TypeScript, preserving all 22,676 entries. The Shadowrun name file also retains unused pools for future requested work.
- Keep pgen unchanged. Do not migrate DSA lists, fantasy generators, artwork, themes, or spreadsheet tooling.
- Use generic cyberpunk by default. The Shadowrun flavor enables metahumans, magic/dragons, named Shadowrun corporations, and other setting references. Each group has an independent checkbox.
- Mark relevant entries with both `shadowrun` and a specific feature tag. Shared entries remain available in either flavor. A nickname or mythological company symbol is not automatically a literal setting element.
- Pass settings explicitly through every generation call, including gang leaders, day jobs, and parent corporations. `includeTags` enables a feature independently of flavor; `excludeTags` takes priority. Excluding `shadowrun` removes all tagged setting entries and metahuman species.
- Retain the old species/age rules in Shadowrun mode. Generic cyberpunk uses the old human (`Norm`) age rules.
- Keep selection and composition separate: typed data, reusable pool filters, category functions, and a small category registry. Report empty required pools as an error instead of silently generating incomplete names.

Two inherited bugs were corrected during migration: rounded numbers could fall below their requested minimum, and named parent corporations could accidentally draw from bar names.

## Limits

The original lists contain pop-culture references, typos, adult terms, and some fantasy-themed venue names within the Shadowrun list. They are retained rather than broadly rewriting source content. Setting tags cover identified literal species, magic, named corporations, and lore; future list additions should be tagged explicitly. This is not an exhaustive editorial review.

Unused pools remain data only; there are no new generators for them. No sovereignty generator or dedicated sovereignty list existed among the active Shadowrun categories. The tag mechanism supports adding such entries later without changing the generation engine.

The full data currently ships in one bundle. Static hosting or a local HTTP server serves the built app; name generation itself has no backend or internet requirement. No service worker or installable offline application is included.
