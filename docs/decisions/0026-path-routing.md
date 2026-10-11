# 0026: Flavor and category in paths

Date: 2026-10-11
Status: Accepted

Use `/:flavor/:category` for generator links, such as `/shadowrun/runners`. The user requested paths instead of query parameters for these two settings. Keep existing flavor and category IDs; gender and corporation size stay in the query. Details remains app state.

The root path and old query links normalize to the new paths without adding a history entry. Missing or invalid path settings use existing defaults and category fallbacks. Path settings take precedence over old query values. Selection changes add history entries; Back/Forward restores the selection and generates a new batch.

About uses `/:flavor/:category/about` so its theme and return link keep the current settings. `/about` remains available with default settings or legacy query settings.

Static hosts must serve `index.html` for these paths. Build and route tests cannot confirm a host's fallback configuration.
