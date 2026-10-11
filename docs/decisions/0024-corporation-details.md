# 0024: Generated corporation details

Date: 2026-10-10
Status: Accepted

Add a CEO to generated corporations. AA and AAA include a founding year; AA includes one dated event, while AAA includes one or two subsidiaries and two or three distinct event templates. Use 2077 as the current year in every flavor. Draw founding years from 2020 through 2077, draw all events between the founding year and 2077.

Start with the twelve existing event texts from namegenerator/routes/single/sets/corporations.js in src/data/corporation-events.ts. Omit their stock-price effects, graphs, and all other old financial data. Compose CEO names, subsidiary names, and event placeholders using existing flavor-filtered name and product fragments. Additional event content must come from the user. Subsidiaries request names alone, avoiding recursive company details. They are distinct from the parent and one another, with bounded retries and an existing-fragment fallback for small or fixed-random pools.

Details use the existing multiline result text and Show details control. Known corporations remain names only: all added people, dates, subsidiaries, and events are fictional details of generated companies, not claims about canon corporations. AA event lines have no heading. The earliest founding year is 2020 as requested; event dates span the full company history without a recent-year restriction. No new category, graph, or control is added.

Product placeholders use the weapon category's model with either a quoted series or, when the series is absent, a weapon type. Do not add parentheses, a manufacturer, or modifications. The fallback type prevents bare model fragments such as 200. Both generators share the same name helper and pass flavor and tag settings through it. This applies to market launches, sales, recalls, and design reactions. The weapon category continues to show its type in the existing details line.

On 2026-10-11, add the user's wording variations and five new event types: headquarters moves, insider leaks, agreements, investments, and influencer promotions. Keep one pool entry per event type so types with more wording choices do not become more frequent. Resolve each inline `[a|b]` choice independently before generating name placeholders; AAA still chooses distinct event types. Keep all wording in the data file. Cities temporarily use the user's seven names, with a TODO to move them into a separate shared pool later. No additional event ideas or list entries are authored by AI.
