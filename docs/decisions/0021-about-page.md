# 0021: Small About page

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Provide a short introduction and author credit, adapted from pgen and namegenerator, at `/:flavor/:category/about`; `/about` also remains available. Path routing follows decision 0026.
A top-right header link opens it; the same position offers Back to generator on the About page.
Both links carry flavor and category in the path and other generator options in the query so settings survive
the visit. The About page uses the selected flavor's existing theme and contains text only.

## Limits

Generated names remain temporary and are regenerated on returning. Static hosts must serve the app
entry point for all generator and About paths.
