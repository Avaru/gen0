# 0011: Eight sourced modern naming pools

Date: 2026-10-10
Status: Accepted

Add the requested first batch: Dutch, Turkish, Ukrainian, Swedish, Korean, Vietnamese, Hindi-speaking Indian, and Tamil names. Use public, documented name collections, with Statistics Sweden's population table for Swedish names. Keep editable TypeScript entries, source links, and original spellings for names converted to Latin. Record exact source versions, counts, cleaning, and limitations in [name data sources](../name-data-sources.md). Include the required reuse notices in the static app files.

Dutch, Swedish, Turkish, Ukrainian, and Hindi names use one given name and one surname as a simple everyday display. Preserve multiword names and surname particles as stored. Ukrainian output omits patronymics; use the source's separate surname gender forms and link matching forms. Do not invent patronymics or extra surname forms.

Korean names use surname first, then one complete given name. Vietnamese names use surname first, then one complete stored given-name phrase, which may already contain middle-name material. Do not independently shuffle syllables or insert an additional middle name. Nicknames follow the complete name in both traditions.

Tamil output uses the initial of a male Tamil given name followed by the person's given name. This models one common father's-initial display, not every Tamil naming practice. Do not copy the source generator's reuse of all given names as surnames. Tamil has a given-name pool but no hereditary surname pool: Mixed can draw Tamil given names with another tradition's surnames, but cannot choose Tamil as its surname tradition. Reusable Tamil surname lookup reports an empty pool.

All new data is shared by the existing flavors and passes through existing exclusions and nested generation options. No additional settings, flavors, remote dependencies, import tools, or changes to pgen are introduced.

## Limits and references

The pools provide variety, not population-weighted samples. The requested minimum applies to distinct source names per naming pool, not generated full-name combinations. Some pools have thousands of entries; others have several hundred. Smaller surname inventories reflect available verified collections, not an assertion that only those surnames exist.

Hindi and Tamil cover the named source collections, not all Indian communities. Tamil uses scholarly Latin transliteration with diacritics rather than claiming one standard English spelling. Source collections retain some historical, uncommon, regional, or imperfectly classified names; these additions are not a full native-speaker spelling audit.

- [India passport knowledge-base profile](https://www.gov.uk/government/publications/india-knowledge-base-profile/india-knowledge-base-profile): father-initial naming forms.
- [W3C personal names guide](https://www.w3.org/International/questions/qa-personal-names): order, compound names, and regional variation.
- [Vietnamese Name Database](https://github.com/duyet/vietnamese-namedb): name components and complete given-name phrases.
