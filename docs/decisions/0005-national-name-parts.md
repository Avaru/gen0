# 0005: Modern Russian, Polish and Greek name parts

Date: 2026-10-10
Status: Accepted

gen0 is the active app. Work on it only; pgen is being retired.

Keep editable name parts in the existing local TypeScript list. Gendered surnames use separate male and female entries; invariant surnames have no gender. Russian patronymics have their own type and father-name tags, including supported spelling variants. Given names, surnames and patronymics are separately reusable, with generation options passed through each call.

Russian display names include a patronymic 75% of the time and otherwise use given name plus surname. Polish names have a 25% chance of a second given name and a 10% chance of a hyphenated double surname. Greek names have a 10% chance of a second given name and one surname. These adjustable rates provide plausible variation, not measured demographic frequencies. Picks exclude duplicate name parts.

Patronymics cover 30 common father names plus spelling aliases. An unsupported explicit father name raises an error rather than inventing a form. Common informal Russian names remain available as nickname parts instead of formal given names. This is a construction update, not an audit of every inherited spelling.

This supersedes the unchanged composition rules for these three nationalities in decision 0001. Other nationality patterns remain unchanged.
