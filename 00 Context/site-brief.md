# Site Brief

Baseline: the existing Framer portfolio at https://markalexis.framer.website. Match its structure, content and feel as closely as possible unless a rule below says otherwise. Use placeholders for anything not yet decided (images, case study content).

## Structure
- Multi-page: a home page, an About page, and one page per case study.
- The home page shows all five projects. Each card links to its own case study page (e.g. `projects/tvguideplus.html`). Each case study's "All projects" link goes back to the cards on the home page (`index.html#work`).
- Projects page: hidden for now. `projects.html` stays in the folder but nothing links to it, and search engines are asked to skip it. Bring it back (nav link and back links) once there are more than five projects.
- About page: yes
- Navigation: top bar with Home, About, Contact. Contact opens an email (mailto link). Visible on every page.

## Home page content (from the Framer baseline)
- Availability note at the top: "Available for Full-Time Roles from Oct 1, 2026"
- Hero: the sentence "I turn complexity into clarity." in white, then in grey "with AI-powered" and a line that rotates through "Research Synthesis", "Prototyping", "Design-to-Code", "Usability Testing" (each slides up and out as the next slides in)
- With animation turned off (reduced motion), only "I turn complexity into clarity." shows
- Project cards, in this order: SpringIn (2026, Healthcare; replaced zengo; first because it shows the AI-assisted process), tvguideplus (2025, Media / Publishing), yumm (2024, Media / Publishing), pflegePro (2023, Healthcare), roverride (2023, Media / Publishing)
- Contact section labeled ".say hello", with the line "Hiring a product designer who brings AI into the process? Let's talk." and a "contact me" button. Do not repeat the availability date here: the note at the top already says it, and the line should point toward a role, never invite unpaid design work.
- Footer with a "Last updated" note

## Case Study Display
- Index: cards with a thumbnail image, year, category and project name. Placeholder images until real ones exist.
- Card hover: the image zooms to about 120% inside its frame, a color overlay fades in, and a "Read Case Study" button appears.
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

## Do NOT generate
- Animations that delay or block reading the content or using the navigation.
- Hidden or hard-to-find navigation (no hamburger-only menu on desktop, no nav that disappears).
- A single long page holding every project.
- Any content, project or page not listed above.
