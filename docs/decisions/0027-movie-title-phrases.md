# 0027: Movie title phrase positions

Date: 2026-10-11
Status: Accepted

Movie title fragments need positions that fit their wording. Keep the existing human-made entries, tagging all former title-object phrases as title-object-end. Give noun phrases such as Chronicles, Diaries, Files, and Saga the additional title-object-start tag; join those beginnings to a subject with "of the". Phrases such as "with chainsaws" remain ending-only. The existing title-prefix pool remains available in the same opening slot.

Reduce the final title-suffix chance from 60% to 20%. This applies to the existing combined pool of sequel numbers, subtitles, edition labels, and other suffixes. Normalize joining spaces and preserve the original phrase casing after the main subject.

No list entries are invented or removed. Flavor filtering and nested personal-name options remain unchanged. These position tags improve phrase placement but do not check every combination for grammatical agreement or match titles to genres.

The user later supplied additional title fragments. Store them in the same list with tags for each suitable position, extending existing Driver and Nightmare entries rather than duplicating them. Normalize the supplied "New of the" to "News of the". The user agreed that "No time to" should select an existing verb: tag that opening as title-prefix-action and Spy, return, and party as title-action. This avoids pairing that opening with arbitrary nouns. No additional words are authored.
