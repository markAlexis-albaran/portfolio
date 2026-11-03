# Visual direction

Source: the owner's Framer portfolio, https://markalexis.framer.website (values read from the published page's styles, 2026-11-03)
Character: Dark, high contrast and typographic: a large light-weight hero sentence on black, generous space between sections, small mono labels for metadata, and motion carrying the energy instead of decoration.

## Colors

Background: #000000
Text primary: #FFFFFF
Text secondary: #FFFFFF at 50% opacity (rgba(255, 255, 255, 0.5))
Divider and subtle surfaces: #FFFFFF at 10% opacity (rgba(255, 255, 255, 0.1))
Accent: #1F00FF (buttons, card hover overlay, focus states)
Do not introduce any other colors.

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
