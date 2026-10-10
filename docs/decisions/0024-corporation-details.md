# 0024: Generated corporation details

Date: 2026-10-10
Status: Accepted

Add a CEO to generated corporations. AA and AAA include a founding year; AA includes one dated event, while AAA includes one or two subsidiaries and two or three distinct event templates. Use 2077 as the current year in every flavor. Draw founding years from 2020 through 2077, draw all events between the founding year and 2077.

Migrate only the twelve existing event texts from namegenerator/routes/single/sets/corporations.js into src/data/corporation-events.ts. Omit their stock-price effects, graphs, and all other old financial data. Compose CEO names, subsidiary names, and event placeholders using existing flavor-filtered name and product fragments; do not add new authored list content. Subsidiaries request names alone, avoiding recursive company details. They are distinct from the parent and one another, with bounded retries and an existing-fragment fallback for small or fixed-random pools.

Details use the existing multiline result text and Show details control. Known corporations remain names only: all added people, dates, subsidiaries, and events are fictional details of generated companies, not claims about canon corporations. AA event lines have no heading. The earliest founding year is 2020 as requested; event dates span the full company history without a recent-year restriction. No new category, graph, or control is added.
