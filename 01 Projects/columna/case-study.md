## Columna (made-up name)

Two design systems behind a block-based CMS for magazine editors
Media / Publishing · 2024 · replaces roverride in the fifth card

Anonymized at the owner's request (NDA unclear). Real names and the award are in source/private-notes.md, which stays off GitHub. Made-up names on the site: Columna (the CMS and its AI), brands Kochzeit, Sternblick, Fernweg. Checked 2026-11-04: none matched a real media product.

### The problem
Editors across several magazine brands worked in an old, SAP-like legacy CMS full of manual steps. It still worked because they knew it by heart. Columna, a Notion-style block editor built with Vue components and with AI in the writing workflow, was built to replace it step by step.

### Research
Editors drafted in Microsoft Word, then copied text into the old CMS and reformatted it by hand. The CMS was the last step, not where the work happened.

### The insight
If editors can write in the CMS from the first word, the copy-and-reformat step disappears.

### What was made and why
- Write, save, publish and schedule in one place (instead of Word, then CMS).
- Two design systems, two teams: readers' (each brand's identity on the sites) and editors' (one work tool, speed and consistency over brand). One shared system would have pulled two ways. The owner worked across both.
- Tokens, so a brand swaps in without new components.

Visuals: `02 Site/images/columna/` (editor.svg, tokens.svg), recreated in code and labeled as such.

### Outcome
Stopped before its official launch, so no usage numbers. Takeaways: two systems for two audiences; tokens so one component serves many brands.
