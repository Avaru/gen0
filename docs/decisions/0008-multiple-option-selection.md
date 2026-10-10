# 0008: Multiple selections for name gender and corporation size

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Allow any combination of given-name genders or corporation sizes without a separate Any choice. Use shared native checkbox groups; all choices start checked and the last checked choice is disabled until another is selected. Flavor remains a single choice and category remains a grouped select.

Store selected choices as arrays in settings and generation options. Each result picks one checked choice with equal probability. Resolve name gender once per person so gendered surnames, patronymics and other name parts remain consistent. Parent corporations retain their existing explicit mega size. Existing name entries and their grammatical gender fields remain unchanged.

Keep settings in the URL with comma-separated gender/size values, in the displayed order. Omit a group when all its choices are selected or the category does not use it. Continue supporting old single-value links and accept repeated query values. Ignore duplicates and unsupported values; empty or entirely invalid selections default to all. Reload and Back/Forward restore the selection.

This updates the single-choice gender/size controls in decision 0004. No categories, flavors or data groups are added. Random batches may contain an uneven mix of the selected choices.
