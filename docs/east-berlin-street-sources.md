# East Berlin street sample

`src/data/east-berlin-streets.ts` contains 250 distinct street names with `district` and `maxHouseNumber`. It is a sample for roughly 1986, not a complete historical street register. The Never Midnight Address category uses this list, choosing a house number from 1 to the maximum and adding an A or B suffix with a combined 25% probability. The district is secondary text.

## Sources

- [Adressen Berlin, Amt für Statistik Berlin-Brandenburg](https://daten.berlin.de/datensaetze/adressen-berlin-wfs-634ab8ba), retrieved 25 October 2026. Official address data, released under **Datenlizenz Deutschland – Zero – Version 2.0**. The published dataset covers January–June 2026.
- [Address field documentation](https://gdi.berlin.de/data/adressen_berlin/docs/Datenformatbeschreibung_Adressen_Berlin.pdf). The relevant fields are `str_nr` (street identifier), `str_name`, `hnr` (numeric house number), and `ort_name` (current locality).
- Existing, human-written street lists and their naming histories: [Mitte](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Mitte), [Prenzlauer Berg](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Prenzlauer_Berg), [Friedrichshain](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Friedrichshain), [Pankow](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Pankow), [Weißensee](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Weißensee), [Alt-Treptow](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Alt-Treptow), [Köpenick](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Köpenick), and [Lichtenberg](https://de.wikipedia.org/wiki/Liste_der_Straßen_und_Plätze_in_Berlin-Lichtenberg), consulted 25 October 2026. Names and dates were used as factual references; descriptive passages were not copied.
- [Berlin: Entstehung und Entwicklung der Bezirke](https://www.berlin.de/politische-bildung/politikportal/politik-in-berlin/hauptverwaltung-und-bezirksverwaltung/entstehung-und-entwicklung-der-bezirke/) explains the historical Stadtbezirke and the later district mergers.

## Interpretation

Street names were selected from the existing lists, checked against their naming dates and histories, and matched to official current addresses. `district` uses the former East Berlin Stadtbezirk, such as Prenzlauer Berg or Treptow, rather than today's merged district. The sample covers eight Stadtbezirke; it does not attempt to cover every part of East Berlin. A street crossing districts appears once, with one applicable historical district.

`maxHouseNumber` is the highest numeric `hnr` in the current official address dataset for the corresponding street identifier. All 402,756 published address records were retrieved, so maxima include sections outside the listed district. Separate streets with identical names were kept separate by identifier. Letter suffixes and gaps are ignored. These numbers are present-day approximations, not reconstructed 1986 numbering; a number between 1 and the maximum need not identify an existing address or lie in the listed district.

The following historical names are paired with the current streets when looking up the maximum:

| Name used in the sample | Current street |
| --- | --- |
| Clara-Zetkin-Straße | Dorotheenstraße |
| Egon-Schultz-Straße | Strelitzer Straße |
| Otto-Grotewohl-Straße | Wilhelmstraße |
| Wilhelm-Pieck-Straße | Torstraße |
| Artur-Becker-Straße | Kniprodestraße |
| Dimitroffstraße | Danziger Straße |
| Willi-Bredel-Straße | Schivelbeiner Straße |
| Bersarinstraße | Petersburger Straße |
| Klement-Gottwald-Allee | Berliner Allee in Weißensee |
| Jacques-Duclos-Straße | Möllendorffstraße |

Historical names and district assignments are an approximate selection around 1986, not a street-by-street verification against a single contemporary map or address book.
