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
Framed project images keep their dark panels in both themes; they're images, not page colors.

## Highlighted phrases (case studies)

One or two key phrases per case study section get a pastel yellow marker (#FFE680, owner's choice; the only use of yellow on the site). Light mode: a band behind the lower half of the words, text in full color. Dark mode: the marker covers the full line and the text turns near-black (15.9:1), since white can't sit on yellow. Never a thin underline, which reads as a link. Use it for the point of the paragraph, not for decoration.

## Big numbers

Stats inside the case studies use the same type as the numbers on the home page cards: Manrope 300, tight letter-spacing, 48–88px depending on screen width (36–56px for longer before → after pairs). Three across on desktop, two across on phones.

## AI notes (case studies)

Where AI shaped a decision, a short note sits at the end of that section: a soft panel with a blue left edge, labeled "How AI shaped this" in mono with the same spark as the nav. Skill names in mono. Only write what the project files show; never invent how AI was used.

## One prototype per decision, with numbered notes (case studies)

Each design decision is shown once: a short claim, then one interactive prototype. No screenshot strip and no separate component tiles repeating the same screens. The components behind the decision become numbered notes beside the prototype (under it on screens narrower than 900px): a blue numbered circle, a plain name, and one or two plain sentences on what it does for the user and whether it was added to or changed in the design system. Small blue pins with the same numbers sit next to those parts inside the prototype. No tags, pills or jargon. Only use components and states the project files show.

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
