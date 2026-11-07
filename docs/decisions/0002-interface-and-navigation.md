# 0002: Interface and navigation

Use shared controls and setting themes so generators and character sheets stay consistent without duplicating presentation or state handling.

- Support 320px phones and current browsers without horizontal page scrolling. Keep visible, document, and keyboard order aligned. Use native controls, explicit labels, visible focus, readable contrast, accessible dialogs, and status announcements. Aim for WCAG 2.2 AA; respect reduced motion and forced colors.
- Shared `Ui*` components own scoped presentation and control feedback. Central variables and `src/styles/themes/` own themes, selected reactively from the setting registry. Cyberpunk flavors share one theme; flavor selection changes content. Pages coordinate state rather than duplicating control styles. Share reusable behavior through composables.
- Show setting, flavor, and category pickers when more than one option is available. Use the shared modal and category picker, preserving keyboard access and returning focus when closed.
- Keep generator settings in routes such as `/cyberpunk/:flavor/:category`, `/mothership/:category`, and `/never-midnight/:category`, with applicable query options and About routes. Normalize legacy or invalid links with history replacement. User selections add history entries; reload and Back/Forward restore settings and generate fresh results.
- Every result uses the same three text roles: a main name or heading, optional secondary data that stays visible, and optional extra details controlled by Details. Use one shared secondary style per theme, without category-specific typography. Secondary data alone does not require a Details toggle.
- Results are temporary. Details visibility stays in app state, survives navigation, and resets on reload. Manual generation may reveal results; automatic generation and route restoration do not scroll. Append more results without moving the viewport.
- Character-sheet state, generation, sharing, and printing follow [character sheets and sharing](0005-character-sheets-and-sharing.md).

## Sheet navigation and portrait prompts

The CBR+PNK navigation link opens `/chars/cbrpnk` using Generic, regardless of the selected Cyberpunk flavor. With Details shown, each runner result has an arrow that opens a fresh sheet with its profile stats and augmentation. Never Midnight's Student sheet link opens the feature-gated `/chars/never-midnight` route. Mothership's arrow opens a mini sheet below the category controls on the same page.

Portrait buttons are opt-in through soulless corp mode in About and appear on supported results when Details is shown. They copy prompts without changing saved characters. The runner prompt requests a square portrait using the same name, description, archetype, and CBR+PNK angle, with several lettering styles and name positions. The sheet's description image button uses the same prompt and is hidden when the description is empty. Successful copying triggers a short glitch burst; hovering gives a lighter glitch. Neither shows a success message.

Never Midnight name prompts request realistic, slightly blurry black-and-white 1986 East Berlin mugshot-style portraits, using the generated age, appearance, and occupation. Faces and poses may be expressive. Only the first given name appears, either on an incidental background sign or a visibly handwritten or typewritten name tag; characters never hold signs or boards. The placement stays the same when copying the same character again. Spells have no portrait button.

Exact copy, field layouts, animation timings, and control dimensions belong in components, styles, and tests.
