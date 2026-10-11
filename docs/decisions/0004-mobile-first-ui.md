# 0004: Mobile-first, accessible generator UI

Date: 2026-10-10
Status: Accepted

## Requirements

- Design for small phones first, including 320 CSS pixels wide. Use a single column on phones and a settings/results split when there is room. Support zoom and long generated names without horizontal page scrolling.
- Accessibility is a core requirement. Aim for WCAG 2.2 AA: visible keyboard focus, readable contrast, explicit labels, semantic headings and lists, native keyboard behavior, and at least 44px touch targets. Announce generation status to screen readers and show errors without reading the entire results list or moving focus unexpectedly.
- Support current evergreen browsers. Older browsers are not a target.
- Use the expressive cyberpunk themes described in decisions 0012 and 0020. Appearance follows the selected flavor; no dark/light switch is required.
- Use reusable Vue components with the `Ui` prefix, such as `UiButton`. Keep page/layout CSS minimal; put presentation in components with scoped CSS.
- Centralize repeated colors, spacing, radii, and control sizes in CSS custom properties. Global CSS covers tokens and basic document defaults.
- Use VueUse when a behavior needs it. Do not add it merely to wrap behavior already covered by Vue, Vue Router, or native HTML.
- Prefer toggles or segmented controls for short lists. Use the searchable grouped dialog from decision 0013 for the main category list. Generate 10 names initially and on selection changes; scrolling to the bottom appends 20. No batch-size control.
- Follow pgen's visible option selection pattern while keeping gen0's existing categories and flavor rules.
- Update the route when settings change. Opening a link, reloading, and browser Back/Forward restore flavor, category, applicable gender/size options. Generated results are temporary and are not encoded in the URL.

## Implementation

Use `/:flavor/:category` paths with applicable `gender`/`size` query parameters. Legacy root query links redirect to these paths. See decision 0026. Missing or invalid values normalize to defaults; a known-corporations link without a setting flavor falls back to composed corporations. Hide and remove irrelevant category options from the route. Generate 10 names immediately on opening the page and whenever a selection changes, including browser Back/Forward. Replace the previous batch; scrolling down to the page bottom appends another 20 without moving the viewport. There is no Generate more button. Keep a manual generation button for rerolling the current selection. Remove legacy `count` query parameters. Discard generation that completes after its settings have changed.

Segmented controls use native radio groups: Tab enters the group and arrow keys change its selected option. The three flavor options and their labels stay in one row, including on small phones. Options size to their labels and share the available space; use smaller text on small phones so labels fit without wrapping. The main category uses the searchable grouped dialog from decision 0013. Layout, form, and results have scoped styles; the routed page coordinates state without its own CSS.

Provide a general details toggle, on by default, for all secondary result fields (job/title, age, appearance, extra description, and rating). Keep it in app state across category changes, Back/Forward, and visits to About. Reloading starts with details visible. Do not read or save it in the URL; old `details` query parameters are removed when links are normalized. Toggling details only changes presentation and must not regenerate names. Updated 2026-10-11: this display preference does not need to be part of shared links.

Keep results free of counters, row numbers, ready messages, and decorative empty states. Keep a visually hidden status announcement for accessibility.

## Limits

This replaces the initial unstyled UI decision. No new generators, saved names, clipboard tools, theme picker, persistence, or publishing are included. Static hosts must serve the app entry point for every generator and About path. Automated checks do not replace screen-reader and real-device accessibility testing.
