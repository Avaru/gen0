# 0020: Reactive themes by flavor

Date: 2026-10-10
Status: Accepted

## Reason

CP 2020/77 should recall the game's narrow typography and red/cyan interface. Generic should be more expressive, with small printed details inspired by CBR+PNK. Shadowrun has no separate theme yet and uses Generic's appearance. Keep the existing layout and controls.

## Behavior

- `src/styles/themes/index.ts` maps flavors to themes. `App.vue` computes the theme from normalized route settings and binds `data-theme` on `UiShell`. CSS `:root:has()` selects document tokens, including the page background and native control color scheme, without browser API calls or watchers that change the document.
- Generic and Shadowrun use `cyberpunk.css`: yellow, dark panels, grain, halftone dots, offset lettering, short registration marks and fine broken rules, with framed segmented controls and checkbox labels. CP 2020/77 uses `cyberpunk2077.css`: dark background with red haze, fine rules, open panels, angled outline actions, cyan toggle indicators and Rajdhani typography. Its checkbox labels and flavor tabs have no extra enclosing frame. Disabled choices stay visibly selected but use muted grey labels and indicators; the default theme also uses a dashed disabled border.
- All themes use the same scoped components, layout, controls, focus outlines and touch targets. Decorative marks are empty CSS pseudo-elements or backgrounds; no extra interface, content, animations or theme selector.
- Flavor links, reload and Back/Forward select the corresponding theme through the existing route. No separate theme setting or storage is needed.

## Limits

This supersedes decision 0012's shared-theme-only and separate-from-flavor boundaries. CSS `:has()` requires current browsers, as already specified in decision 0004. Google Fonts needs a connection; Barlow Condensed, IBM Plex Mono and Rajdhani have local fallback stacks. Generation still runs locally.

Visual references: [CBR+PNK publisher artwork](https://www.myth.works/pages/cbr-pnk), [creator's pamphlet previews](https://emanoelmelo.itch.io/cbrpnk-core), and [official Cyberpunk interface screenshots](https://www.cyberpunk.net/en/news/49591/update-2-1-accessibility-features). The styling is an interpretation; reference artwork is not bundled.
