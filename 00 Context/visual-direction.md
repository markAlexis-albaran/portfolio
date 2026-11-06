# Visual direction

Source: the owner's Framer portfolio, https://markalexis.framer.website (values read from the published page's styles, 2026-11-03)
Character: Dark, high contrast and typographic: a large light-weight hero sentence on black, generous space between sections, small mono labels for metadata, and motion carrying the energy instead of decoration.

## Colors

Background: #000000
Text primary: #FFFFFF
Text secondary: #FFFFFF at 60% opacity (rgba(255, 255, 255, 0.6)), 7.37:1 on black, passes WCAG AAA. Raised from 50% (5.32:1) because body text uses Manrope Light.
Divider and subtle surfaces: #FFFFFF at 10% opacity (rgba(255, 255, 255, 0.1))
Accent: #1F00FF (buttons, card hover overlay). Never for focus outlines or text on black: only 2.5:1. Focus outlines are white.
Do not introduce any other colors (one exception: the pastel yellow highlight, below).

## Light theme (the default)

Light is the default (changed 2026-11-04 at the owner's request). A "Dark mode" toggle switch sits last in the nav on every page (on = dark, blue track; off = light, outlined track), and the choice is remembered in the visitor's browser. On phones the label stays visible too, at 12px, with tighter nav spacing so everything fits down to a 320px-wide screen.
Palette based on danielautry.com's light mode:
Background: #E9E9E9
Text primary: #0A0A0A
Text secondary: #4A4A4A (7.3:1 on #E9E9E9, WCAG AAA). The reference uses #6A6A6A, which is only 4.4:1 and fails AA.
Hero rotating line only (64px, large text): #686868 (4.59:1, AAA for large text), lighter than other secondary text so it separates from the headline the way it does in dark mode.
Dividers and lines: black at 10–55% opacity (the same roles as the white values in dark mode). Background stripes are lighter, black at 8% at their darkest.
Accent: #1F00FF, unchanged. Text on the accent is always white (--on-accent), in both themes.
Redesign screens in the case studies are HiFi boards (owner's choice, 2026-11-05): the screens rebuilt from my designs and shown on a light grey board in white phones with a status bar, with small labels in the top corners (project name, what the screens show), after the owner's reference. Stock photos (Unsplash License) stand in for the original photos. The boards are images with 18px corners, the same in both themes; their source pages and render script are in 01 Projects/boards. The "before" screenshots of the original products stay as they are.

Walkthroughs use the same HiFi look, started with SpringIn (owner's choice, 2026-11-05): the prototype plays on a light grey board in a white phone with a status bar, island and home indicator; the top-left label names the project and the top-right label the current step. Inside the phone the screens get a proper app UI: one card style with a soft shadow, one 50px button style, larger titles, back links on pushed screens and a tab bar on Home. pflegePro, tvguideplus and yumm followed (2026-11-05); the status bar takes the app's top color (navy with white text on tvguideplus). Columna is a desktop tool, so its board holds a browser window with colored window dots instead of a phone. Walkthroughs use flat illustrations instead of photos (owner's choice): simple figures in the app's own colors with soft tinted backgrounds, drawn as inline SVG. pflegePro's interactive prototypes use the same white HiFi phone (status bar, island, home indicator) and the same illustrations instead of the black frame and grey placeholders. Every phone fits the screen (owner's request, 2026-11-05): walkthrough phones and fixed-size prototype phones keep their design size and are scaled down to fit the width and the height left under the sticky bars; prototype phones that grow with their content stop at that height and scroll inside. Two-phone prototype panels (pflegePro) show the phones side by side when both fit at full size; on a narrower panel the first screen shows alone, and the first tap shrinks it to the left while an arrow and the second screen come in beside it. On phones both screens are made smaller so the same shrink-and-reveal fits (owner's choice, 2026-11-06). The whole walkthrough board fits the screen, not only the phone, and a thin progress line with the time played (mono, "0:12 / 0:30") sits along the bottom of the board, like a video player, so both stay in view while the phone plays (owner's request, 2026-11-06).

## Highlighted phrases (case studies)

One or two key phrases per case study section get a pastel yellow marker (#FFE680, owner's choice; the only use of yellow on the site). Light mode: a band behind the lower half of the words, text in full color. Dark mode: the marker covers the full line and the text turns near-black (15.9:1), since white can't sit on yellow. Never a thin underline, which reads as a link. Use it for the point of the paragraph, not for decoration.

## Big numbers

Stats inside the case studies use the same type as the numbers on the home page cards: Manrope 300, tight letter-spacing, 48–88px depending on screen width (36–56px for longer before → after pairs). Three across on desktop, two across on phones.

## AI notes (case studies)

Where AI shaped a decision, a short note sits at the end of that section: a soft panel with a blue left edge, labeled "How AI shaped this" in mono with the same spark as the nav. Skill names in mono. Only write what the project files show; never invent how AI was used.

## One prototype per decision, with numbered notes (case studies)

Each design decision is shown once: a short claim, then one interactive prototype. No screenshot strip and no separate component tiles repeating the same screens. The components behind the decision become numbered notes beside the prototype (under it whenever the panel is narrower than about 730px, so a small desktop window or a tablet gets them under the phone too): a blue numbered circle, a plain name, and one or two plain sentences on what it does for the user and whether it was added to or changed in the design system. Small blue pins with the same numbers sit next to those parts inside the prototype. No tags, pills or jargon. Only use components and states the project files show.

## Interactive examples ("Try it" panels)

Every interactive section sits in a panel, like a worked example in a textbook: a solid blue tint (#E4E6FB in light mode, #0D0A3A in dark), a thin blue edge, 18px corners, and a header with a filled blue "INTERACTIVE" badge (hand icon, mono caps) followed by a short title of what to do. A mono caption underneath says where it comes from. The example inside keeps its own product colors.

## Typography

Heading: Manrope, weight 300, 64px on desktop (40px on mobile), line-height 1, letter-spacing -2.7px (scale proportionally on mobile)
Subheading: Manrope, weight 500, 20–32px, line-height 1.35
Body: Manrope, weight 300, 16–20px, line-height 1.5
Label / caption (year, category, ".say hello", availability note, nav): DM Mono, weight 400, 12–14px, line-height 1.4
Do not introduce other font families.
Load via: Google Fonts link tag
`<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;500&family=DM+Mono:wght@400&display=swap" rel="stylesheet">`

## Layout

Max content width: 1920px
Side padding: 80px desktop, 48px tablet (810–1023px), 20px mobile (below 810px)
Base spacing unit: 4px (used values: 8, 16, 20, 24, 36, 48, 80)
Section padding: 180px between major sections on desktop, 80px on mobile
Breakpoints: 810px, 1024px, 1440px

## Background

A fixed layer behind all content on every page: 9 vertical 1px lines, evenly spaced with 120px side padding on desktop (the page gutter on smaller screens, and every other line hidden on phones). Each line fades from white at 0% opacity at the top to white at 25% opacity at the bottom. It slides up from below the screen over about one second as the page opens.

## Do NOT generate

- Light or white page backgrounds
- Drop shadows
- Decorative gradients, illustrations or background patterns, other than the striped background above
- Heavy font weights (nothing above 500)
- Colors outside the palette above, including for hover states
- Rounded "pill" or bubbly shapes as decoration

Projects overview (owner's choice and reference, 2026-11-05): the fly-through on Home and Projects ends in an overview of all five projects (desktop): the covers scattered at different sizes, the first project largest, with a "Get in touch with me" pill and a down chevron in the middle that scrolls to the contact section. Clicking a cover (or Enter on it) opens a full-screen view under the top bar, in the page color with no box (owner's choice, 2026-11-05): "← All projects" top-left, a large cover on the left that grows out of its spot in the overview and shrinks back on close, and the name, field, year, reading time, result, description and "Read case study" on the right. "← All projects", Esc and Back close it; the page under it doesn't scroll. "← All projects" on every case study opens the page straight on this overview (#all). On phones (owner's choice, 2026-11-05) the overview is a collage of square covers (owner's suggestion, 2026-11-05), cropped to the middle of each cover so the logo shows larger: SpringIn and tvguideplus on top, Columna and yumm under them, pflegePro centered below, with the "Get in touch with me" pill under it; a short screen scales the collage down. During the flight the covers keep their wide shape and turn square as they settle. On phones the same full-screen view puts the cover on top, the details under it and "Read case study" pinned to the bottom of the screen.

Case study navigation (owner's request, 2026-11-05): the end of each case study has "← All projects" (to the overview, #all) and the next project's name, large, on the right. The order follows Home and wraps around: SpringIn, tvguideplus, Columna, yumm, pflegePro. Case studies have no contact section, and the sticky section bar only holds the section links.
