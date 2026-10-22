# 0004: Interface and routes

Use shared controls and setting themes so generators and character sheets stay consistent without duplicating presentation or state handling.

- Support 320px phones and current browsers without horizontal page scrolling. Keep visible, document, and keyboard order aligned. Use native controls, explicit labels, visible focus, readable contrast, accessible dialogs, and status announcements. Aim for WCAG 2.2 AA; respect reduced motion and forced colors.
- Shared `Ui*` components own scoped presentation and control feedback. Central variables and `src/styles/themes/` own themes, selected reactively from the setting registry. Cyberpunk flavors share one theme; flavor selection changes content. Pages coordinate state rather than duplicating control styles. Share reusable behavior through composables.
- Show the setting picker only when multiple settings are registered and flavor controls only when multiple flavors exist. Use the shared modal and category picker, preserving keyboard access and returning focus when closed.
- Keep generator settings in routes: `/cyberpunk/:flavor/:category` and `/never-midnight/:category`, with applicable query options and About routes. Normalize legacy or invalid links with history replacement. User selections add history entries; reload and Back/Forward restore settings and generate fresh results.
- Results are temporary. Details visibility stays in app state, survives navigation, and resets on reload. Manual generation may reveal results; automatic generation and route restoration do not scroll. Append more results without moving the viewport.
- Sheets use dedicated routes and Pinia stores. CBR+PNK fixes Cyberpunk/Generic; Never Midnight uses its own setting and feature gate. Share basic sheet components, URL compression, and synchronization while keeping each sheet's fields and rules separate.
- Save sheet edits locally and share them through versioned, compressed URLs. Valid URL data takes priority over local storage. Validate versions and size bounds; invalid links retain existing edits and show an error. Automatic URL updates replace history and must not overwrite newer edits. Generator and About links omit sheet data.
- Sheet generation reuses existing generators and approved profiles. Targeted rerolls preserve unrelated edits. Portrait actions copy prompts without changing saved characters. Sheets remain editable aids rather than rules validators; see the [character data model](../character-data-model.md).
- Keep CBR+PNK printing separate from screen layout: A4 portrait, wrapping entered text, no interactive chrome, and readable selections with backgrounds disabled. Preserve component state across responsive layouts. Long text may require extra pages; claim print fit only after browser/PDF verification.

Exact copy, field layouts, animation timings, and control dimensions belong in components, styles, and tests.
