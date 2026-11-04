# Visual direction

Source: the owner's Framer portfolio, https://markalexis.framer.website (values read from the published page's styles, 2026-11-03)
Character: Dark, high contrast and typographic: a large light-weight hero sentence on black, generous space between sections, small mono labels for metadata, and motion carrying the energy instead of decoration.

## Colors

Background: #000000
Text primary: #FFFFFF
Text secondary: #FFFFFF at 60% opacity (rgba(255, 255, 255, 0.6)), 7.37:1 on black, passes WCAG AAA. Raised from 50% (5.32:1) because body text uses Manrope Light.
Divider and subtle surfaces: #FFFFFF at 10% opacity (rgba(255, 255, 255, 0.1))
Accent: #1F00FF (buttons, card hover overlay). Never for focus outlines or text on black: only 2.5:1. Focus outlines are white.
Do not introduce any other colors.

## Light theme (optional, visitor's choice)

Dark stays the default. A "Light mode" toggle switch sits last in the nav on every page (on = light, blue track; off = dark, outlined track), and the choice is remembered in the visitor's browser. On phones only the switch shows; its label stays readable by screen readers.
Palette based on danielautry.com's light mode:
Background: #E9E9E9
Text primary: #0A0A0A
Text secondary: #4A4A4A (7.3:1 on #E9E9E9, WCAG AAA). The reference uses #6A6A6A, which is only 4.4:1 and fails AA.
Hero rotating line only (64px, large text): #686868 (4.59:1, AAA for large text), lighter than other secondary text so it separates from the headline the way it does in dark mode.
Dividers and lines: black at 10–55% opacity (the same roles as the white values in dark mode). Background stripes are lighter, black at 8% at their darkest.
Accent: #1F00FF, unchanged. Text on the accent is always white (--on-accent), in both themes.
Framed project images keep their dark panels in both themes; they're images, not page colors.

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
