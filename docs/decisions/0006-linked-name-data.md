# 0006: Typed and linked personal names

Date: 2026-10-10
Status: Accepted

## Reason

Keep additions such as gendered surnames and Russian patronymics easy to edit without replacing the shared generator or adding a separate rule language.

## Decision

- Store personal names by tradition under `src/data/names/`. `rl-names-modern.ts` combines those lists for existing generators. Preserve all 19,478 entries and their original values, types, genders, and tags.
- Use `NameEntry` from `src/data/nameTypes.ts`. Name parts have a fixed set of types; name gender is `m`, `f`, or omitted for an invariant form. Other generator entries continue using `RawBit`.
- Keep a stable `id` only on given names referenced by `fatherNameId` or `givenNameIds`. Keep these IDs when correcting spellings. Ordinary names and duplicate inherited rows need no IDs; this does not remove entries or change their selection weight.
- Only related male/female surname forms have a `formGroupId` and share the group, including multiple inherited male spellings with the same female form. Invariant surnames remain usable by either gender.
- Patronymics reference a male given-name entry through `fatherNameId`. Supported alternative father spellings are stored as `aliases` on that referenced entry. Explicit father-name lookup uses the link rather than parsing a tag.
- Retain the existing `father:*` tags for compatibility with include/exclude options.
- Nicknames may reference formal given names through `givenNameIds`. Link Dima, Misha, and Vanya to the already established formal names. Leave other inherited informal forms unlinked until their relationships are reviewed.
- Keep composition order and optional-part probabilities in the nationality functions. Preserve flavor filtering, explicit options through nested generation, and error behavior for empty pools or unsupported fathers.

## Limits

The combined list is now grouped by tradition. Random selection keeps the same entries and weights, but the same random seed can produce a different result where a generator samples across the whole list. The lists still ship with the app, and no family generator or automatic nickname selection is added.

Links describe the relationships already represented in the data; they do not constitute an editorial audit of every inherited spelling or cultural convention.

## Cleanup

Updated 2026-10-10 at the user’s request: remove unused entry IDs and surname group IDs. Retain only existing name relationships; random selection does not require identity fields.
