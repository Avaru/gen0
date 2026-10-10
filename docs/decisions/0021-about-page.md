# 0021: Small About page

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Provide a short introduction and author credit, adapted from pgen and namegenerator, at `/about`.
A top-right header link opens it; the same position offers Back to generator on the About page.
Both links carry the generator query settings so the selected flavor, category and options survive
the visit. The About page uses the selected flavor's existing theme and contains text only.

## Limits

Generated names remain temporary and are regenerated on returning. Static hosts must serve the app
entry point for `/about` as well as `/`. This extends decision 0004's root-only routing requirement.
