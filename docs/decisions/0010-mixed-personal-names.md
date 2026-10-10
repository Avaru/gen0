# 0010: Mixed personal names

Date: 2026-10-10
Status: Accepted

## Reason and behavior

Add the requested Mixed category to combine naming traditions without independently shuffling every name part.

- Choose an available surname tradition, then a different given-name tradition. Choose traditions with equal probability within each eligible pool rather than making the largest inherited lists dominate.
- Use the surname tradition's composition rules: Chinese/Japanese surname-first order, Spanish two surnames, Russian optional patronymic, Arabic optional father's given name, and the existing optional-name rules elsewhere.
- Keep every given name in one name's given-name tradition and every surname in its surname tradition. Russian patronymics and Arabic father names remain from the corresponding composition tradition.
- Resolve gender once per generated person. Use that gender for given names, surname forms, and patronymics. Keep stored compound parts whole.
- Reuse the shared name builder, passing generation options into all selections. Exclusions remove unavailable traditions before choosing sources. If no two different suitable traditions remain, report a clear error.
- Add Mixed under the existing personal-name category group. Use the same gender controls, details, batch generation and URL handling. Do not add any other controls or categories.

## Limits

These are fictional mixed-tradition names, not a claim that all such combinations follow a particular country's legal naming practice or imply a particular family background. The same adjustable display probabilities apply as in the source traditions. Existing lists are retained without a new spelling audit.
