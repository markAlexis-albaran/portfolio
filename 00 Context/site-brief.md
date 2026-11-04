# Site Brief

Baseline: the existing Framer portfolio at https://markalexis.framer.website. Match its structure, content and feel as closely as possible unless a rule below says otherwise. Use placeholders for anything not yet decided (images, case study content).

## Structure
- Multi-page: a home page, an About page, and one page per case study.
- The home page shows all five projects. Each card links to its own case study page (e.g. `projects/tvguideplus.html`). Each case study's "All projects" link goes back to the cards on the home page (`index.html#work`).
- Projects page: hidden for now. `projects.html` stays in the folder but nothing links to it, and search engines are asked to skip it. Bring it back (nav link and back links) once there are more than five projects.
- About page: yes
- A small "built with Claude ;-)", led by a small drawn spark (eight rays, in the text color, a nod to Claude's mark but not the official logo) (written exactly like that, owner's request) in grey mono directly under the nav name on screens 810px and wider, and as the last line of the phone menu. Plain text, not a link.
- Name in the nav: "markAlexis-Albaran" at every screen size, with "built with Claude ;-)" under it (9px on phones, 11px on larger screens; the "mA" mark is no longer used). On phones the nav is a floating rounded bar inset from the edges, with a subtle two-line menu button that opens a small floating panel (Home, About, Contact, Dark mode switch); it closes on Escape, a tap outside, or choosing a link. Desktop keeps the full nav, no menu button. Screen readers hear "Mark Alexis Albaran, home".
- Navigation: top bar with Home, About, Contact, then a "Dark mode" toggle switch. Light mode is the default. Contact scrolls to the contact section at the bottom of the current page (no mailto links anywhere: they open a mail app, which felt jarring). Visible on every page.

## Home page content (from the Framer baseline)
- Availability note at the top: "Open to full-time positions" (no date; the original Oct 1, 2026 date passed and was removed)
- Hero: the sentence "I turn complexity into clarity." in white, then in grey "with AI-powered" and a line that rotates through "Research Synthesis", "Prototyping", "Design-to-Code", "Usability Testing" (each slides up and out as the next slides in). It loops continuously (owner's choice). A "Pause animation" button stays visible under the hero so visitors can stop it (WCAG 2.2.2).
- With animation turned off (reduced motion), only "I turn complexity into clarity." shows
- Project cards, in this order: SpringIn (2026, Healthcare; replaced zengo; first because it shows the AI-assisted process), tvguideplus (2025, Media / Publishing), Columna (2024, Media / Publishing; made-up name, replaced roverride; anonymized, see 01 Projects/columna/case-study.md), yumm (2024, Media / Publishing), pflegePro (2023, Healthcare)
- Floating "Projects ⌄" button, centered at the bottom of the home page on load (pill, mono, page colors), linking to the cards. It hides as soon as the visitor scrolls, or if the cards already fill the lower half of the screen, and comes back at the top. Cards rise only 40px when they appear, so ones near the bottom on load aren't pushed out of view.
- Contact section labeled ".say hello", with the line "Hiring a product designer who brings AI into the process? Let's talk." then the email address as visible text (one click selects it; stored in the page code in pieces and joined by the script, so it never appears whole in the code; without scripts it shows as "mark.albaran [at] outlook.com"), a "Copy email" button that copies it and shows "Copied", and a LinkedIn link (opens in a new tab). No contact form (owner's choice: a form needs an outside service holding visitors' data). Do not repeat the availability date here: the note at the top already says it, and the line should point toward a role, never invite unpaid design work.
- Tools tied to the rotating skill: a small mono line under the headline names the tools for the skill on screen, and changes with it. Research Synthesis: "with Claude Code and Miro"; Prototyping: "in Figma, Figma Make and Claude Design"; Design-to-Code: "with Claude Code and GitHub"; Usability Testing: "with VWO and moderated sessions". It loops with the skills. Screen readers get all four pairs at once. Hidden when motion is off. (Replaced a scrolling tools slider that made the hero too busy.)
- Footer with a "Last updated" note

## About page
- No photo of the owner (owner's choice), and no page header: the page opens straight on the loop and the intro. The intro sentence is the page's h1.
- Beside the intro, in the left column where a photo would go: "How I work", four numbered steps (01 Research, 02 Synthesis, 03 Prototype, 04 Test), each with its methods at normal reading size, blue "AI" badges on Synthesis and Prototype, subtle down arrows between the numbers, and a bracket on the left from 04 back to 01. Legend: "AI drafts, I review and decide". Same layout on phones. Chosen over a circle diagram because the circle's small text didn't read well.
- Intro from 00 Context/bio.md, then Stack and Experience (design roles only, earlier jobs in one sentence). No Education section (owner's choice: hired on the work, not the degree).
- Stack groups: AI (Claude Code, Claude Design); Design (Figma, FigJam, Figma Make, Miro); Research and testing (VWO, usability testing, user interviews); Code (HTML, CSS, JavaScript, GitHub); Collaboration (Jira, Confluence). Left out on purpose: macOS, Teams, Slack, Discord.

## Case Study Display
- Index: cards with a thumbnail image, year, category and project name. Placeholder images until real ones exist.
- Projects (visible h2 "Projects", no divider line before the contact section): the five case studies as a stack of overlapping folders, not a grid of cards. The folders are neutral gray, with a gray bookmark-style tab on each folder's left edge, text running bottom to top like a book spine (no dot). Only the folder on top shows its full name on the tab ("01 SpringIn"); the others show their number, and covered tabs peek out 12px above the next one in the stack (screen readers still get every name). Inside: category · year, then the result as the title (big number plus its line, e.g. "3 problem frames before the right one"), then the one-line description. The project name appears only on the tab. Folders have no hover effects. The folder on top shows its brand logo (the loading-screen image) on the right, as a small square in the top-right corner on phones. The logo fades in while floating up 8px, once the folder has settled on top (no motion when the visitor has reduced motion on). The folders form a stacked deck: the whole stack pins under the nav while the visitor scrolls through the section. Each folder holds the top for a fixed stretch of scrolling (about a sixth of the screen height), then the next one slides up over it, so nothing covers the active folder early. Covered folders keep 12px of their top edge in view. The list takes the height of the stack as it changes, so no empty space is left before the contact section. The folder on top gets a tab in its project's dark brand color with white text (SpringIn #1F5E55, tvguideplus #121585, Columna #C4512A, yumm #2E7D72, pflegePro #D93A30; each at least 4.5:1 against white, checked with axe in both modes) and keeps the light folder color; the other folders and their tabs rest on a darker gray (#DCDCDC in light mode, #1C1C1C in dark). Folders that aren't on top show only their tab and category · year; the result, description and "Read case study" fold away and unfold smoothly when the folder takes the top (screen readers still get all of it). Clicking a folder that isn't on top doesn't open it: the page scrolls until that folder is on top, and a second click on it opens the case study. The folder on top always shows "Read case study →", on every screen size (phones included). Keyboard focus on any folder that isn't on top scrolls until it is. Scrolling alone decides which folder is on top. 
- Inside case study: sections with an anchor menu at the top that jumps to each section.
- Cover images: yes, a large cover image at the top of each case study, above the title and anchor menu. Placeholder until real ones exist.

## Motion and Interaction
- Animation level: 3 (richer)
- Page-load entrance, from the Framer baseline:
  - Hero and project list fade in while rising about 150px, with a slight spring at the end.
  - The striped background (see visual-direction.md) slides up from below the screen over about one second.
  - Footer fades in with a small 10px lift.
- Card hover as described above.
- Smooth scrolling to the case study anchors.

## References
- Like: the Framer portfolio (markalexis.framer.website) because it is the owner's own baseline: keep its structure, content, spacing and feel as much as possible.
- Dislike: dull, static sites with nothing moving, and sites where motion or layout makes it hard to find the work or get around.

## Accessibility (WCAG 2.2 AA)
- White focus outline on every focusable element (the blue accent is only 2.5:1 on black).
- A "Skip to content" link first on every page, pointing to `<main id="main">`.
- No skipped heading levels: the home page has a hidden "Projects" h2 above the cards.
- Nothing moves for more than 5 seconds without a way to pause it.

## Do NOT generate
- Animations that delay or block reading the content or using the navigation.
- Hidden or hard-to-find navigation (no hamburger-only menu on desktop, no nav that disappears).
- A single long page holding every project.
- Any content, project or page not listed above.
