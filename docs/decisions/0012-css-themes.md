# 0012: Shared cyberpunk CSS theme

Date: 2026-10-10
Status: Accepted

## Reason

The generator should look expressive, drawing on Cyberpunk 2077 and CBR+PNK: stark yellow, near-black surfaces, cyan and coral accents, condensed headings, and mono controls. Future settings such as Shadowrun should be able to change their appearance through CSS.

## Behavior

- `src/styles/themes/cyberpunk.css` owns colors, fonts, and decorative theme tokens. `base.css` owns document defaults and shared spacing; scoped components own layout and presentation.
- `data-theme="cyberpunk"` on the document selects the shared theme. The root fallback uses the same tokens. Future theme files can override them with a different `data-theme` selector.
- Every generator flavor uses this theme. Flavor and appearance remain separate; no automatic flavor-based theme selection or theme picker is introduced.
- Google Fonts supplies Barlow Condensed and IBM Plex Mono with `display=swap` and local fallbacks. Font loading needs a connection; name generation does not.
- Keep the 320px single-column layout, larger-screen split, native controls, visible focus, and 44px touch targets. No motion or decorative result counters.

## Limits

Only one theme exists today. Future themes must supply the same tokens and preserve readable contrast and mobile behavior. This supersedes the neutral appearance and no-theme boundary of decision 0004, without changing generator data or route settings.
