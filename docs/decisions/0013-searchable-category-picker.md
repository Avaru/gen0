# 0013: Searchable grouped category dialog

Date: 2026-10-10
Status: Accepted

## Reason

The category list has groups and enough entries to benefit from search and more space than a native dropdown. Use a full-screen picker on small phones and a centered panel from 640px, preserving the cyberpunk theme.

## Behavior

- `UiCategoryPicker` receives the available categories and current selection. It emits the same category change as the former select; route restoration, flavor restrictions, and generation behavior stay unchanged.
- Use native `<dialog>` with `showModal()`, native search input, group headings, and ordinary buttons. This is a dialog picker, not an ARIA tree or listbox. No Floating UI or custom combobox keyboard model.
- Opening resets search. On small screens or touch devices, focus the Close button so the on-screen keyboard stays closed until the user taps search. On larger screens with a mouse, focus search. Search matches all typed words against category and group labels, ignoring case and extra whitespace. Empty groups disappear; a status message reports match count or no matches.
- Tab/Shift+Tab navigate within the modal, Enter/Space activate category buttons, and Escape or the Close button cancels. Enter in search selects only a single unambiguous result. Selection closes the dialog. Focus returns to the trigger on closing.
- Keep the title, Close button, and search outside the scrolling choices. Use dynamic viewport height, 44px controls, and a single choice column on phones; two columns on larger screens. CSS locks background scrolling while a dialog is open.
- Search is temporary and does not alter the route or generate names. Selected category is visibly marked and exposed with `aria-current`.
- After choosing a category in the single-column layout (below 56rem), scroll to the Generate names button once its settings have updated. In the desktop split layout, leave the scroll position alone because controls and results are side by side. Generate more scrolls toward the first newly added name, stopping at the page's natural end when a batch is too short to fill the screen; do not add empty space below Generate more. Both use smooth scrolling unless reduced motion is requested. Opening, cancelling, and route restoration do not trigger these scrolls.
- Clicking Generate names scrolls just enough to reveal the first name if it is outside the viewport. Leave the scroll position alone when that name is already fully visible. Automatic generation does not trigger this scroll.

## Limits

This replaces the native grouped-select requirement in decision 0004. Groups stay expanded; no nested tree expansion or new category data is added. Browser checks cover native dialog focus behavior; unit tests use a minimal dialog lifecycle stub because jsdom does not implement it. Manual screen-reader and real phone keyboard testing remain separate checks.
