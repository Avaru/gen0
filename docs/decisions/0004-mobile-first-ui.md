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
- Prefer toggles or segmented controls for short lists. Use the searchable grouped dialog from decision 0013 for the main category list. Always generate 10 names per batch; no batch-size control.
- Follow pgen's visible option selection pattern while keeping gen0's existing categories and flavor rules.
- Update the route when settings change. Opening a link, reloading, and browser Back/Forward restore flavor, category, applicable gender/size options. Generated results are temporary and are not encoded in the URL.

## Implementation

Use the root route with explicit query parameters: `flavor`, `category`, and applicable `gender`/`size`. Missing or invalid values normalize to defaults; a known-corporations link without a setting flavor falls back to composed corporations. Hide and remove irrelevant category options from the route. Generate 10 names immediately on opening the page and whenever a selection changes, including browser Back/Forward. Replace the previous batch; Generate more appends another 10. Keep a manual generation button for rerolling the current selection. Remove legacy `count` query parameters. Discard generation that completes after its settings have changed.

Segmented controls use native radio groups: Tab enters the group and arrow keys change its selected option. Controls wrap on small screens. The main category uses the searchable grouped dialog from decision 0013. Layout, form, and results have scoped styles; the routed page coordinates state without its own CSS.

Provide a general Show details toggle, on by default, for all secondary result fields (job/title, age, appearance, extra description, and rating). Keep it across category changes and restore it from `details=false` in the URL. Toggling details only changes presentation and must not regenerate names.

Keep results free of counters, row numbers, ready messages, and decorative empty states. Keep a visually hidden status announcement for accessibility.

## Limits

This replaces the initial unstyled UI decision. No new generators, saved names, clipboard tools, theme picker, persistence, or publishing are included. Static hosts must serve the app entry point for the root route; settings use query strings rather than additional paths. Automated checks do not replace screen-reader and real-device accessibility testing.
