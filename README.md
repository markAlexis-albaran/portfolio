# Mark Alexis Albaran — Portfolio

My UX / product design portfolio, built with Claude Code.

**Live site:** https://markalexis-albaran.github.io/portfolio/

---

## Product overview

A portfolio for mid-level UI / UX / product design roles. It shows five case studies and how I bring AI into research, prototyping and design-to-code.

**Who it's for:** hiring managers and design leads who want to see how I think, not only what the screens look like.

**What's on it**

- **Home** — a hero that types my AI-assisted skills and the tools behind each, then a scroll-driven fly-through of the five projects, then contact.
- **About** — my "How I work" loop (Research, Synthesis, Prototype, Test), my stack and my experience.
- **Five case studies** — SpringIn, tvguideplus, Columna, yumm and pflegePro. Each one has an anchor menu, interactive "Try it" prototypes, "How AI shaped this" notes and a walkthrough that plays the prototype from start to finish.

**Built for everyone:** WCAG 2.2 AA throughout. Skip link, visible focus outlines, AAA contrast on body text, a pause button on every animation that runs longer than 5 seconds, and a plain list in place of the 3D view for screen readers and reduced motion.

---

## Usage

**Visit it:** open the live link above. Light mode is the default; the Dark mode switch is in the nav.

**Run it on your own computer:** download the repository and open `02 Site/index.html` in a browser. No install step.

**Change it:**

1. Edit the files in `02 Site/`.
2. Save a new version with Git and send it to GitHub (in this project, `/github-update` walks through it).
3. GitHub Pages republishes the site on its own within a few minutes (`.github/workflows/pages.yml`).

---

## Tech stack

| Part | What I used |
| --- | --- |
| Pages | HTML, one file per page |
| Styles | One shared CSS file |
| Interaction | Plain JavaScript (`main.js`) |
| Fonts | Manrope and DM Mono (Google Fonts) |
| Hosting | GitHub Pages, published by GitHub Actions |
| Built with | Claude Code, with rules in `CLAUDE.md` |

No frameworks, no build tools, no npm, no dependencies.

---

## Repository structure

```
portfolio-os/
  CLAUDE.md               Rules Claude follows: who I am, platform, tone, file structure
  README.md               This file
  decision-log.md         Key build decisions: what Claude suggested, what I chose, and why
  .claude/                Voice guide and skills (/site-brief, /visual-direction, /case-study)
  .github/workflows/      Publishes 02 Site to GitHub Pages
  00 Context/             Site brief, visual direction and bio. Claude reads these every session
  01 Projects/            One folder per project: case study draft and HiFi board sources
  02 Site/                The live site: index, about, projects, case studies, style.css, main.js
```

Kept off GitHub on purpose (see `.gitignore`): original research files with client branding and participant quotes, and my LinkedIn export.

---

## Known gaps

- **Placeholder content in two walkthroughs.** tvguideplus shows placeholder news items and pflegePro uses a placeholder video player.
- **Projects page is hidden.** `projects.html` exists but nothing links to it. It comes back once there are more than five projects.
- **All five case studies are anonymized.** Client details are changed or left out, so the case studies can't be linked one-to-one to the real products.
- **No contact form.** Visitors copy my email or use LinkedIn. A form would need an outside service holding visitors' data.
- **Two large files.** `main.js` is about 1,800 lines and `style.css` about 3,500. Splitting them per page would make changes easier.
- **No automated tests.** Accessibility was checked with axe and by hand. The fly-through hasn't been tested on older or low-power phones.
