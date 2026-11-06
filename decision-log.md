# Decision log

Key build decisions on this portfolio. Each one records what Claude suggested, what I decided, and the criterion I used to decide.

---

## 1. How visitors contact me

**Claude suggested:** a standard `mailto:` email link in the contact section and nav.

**I decided:** no mailto links and no contact form. The email shows as visible text with a "Copy email" button, plus a LinkedIn link. The address is stored in pieces in the code and joined by the script, so it never appears whole in the page source.

**Criterion:** a mailto link opens a mail app, which felt jarring. A form needs an outside service holding visitors' data. Splitting the address keeps it away from spam scrapers.

*Commit: 9849d5a, 2026-11-04*

---

## 2. Grey text contrast in light mode

**Claude suggested:** the reference site's grey, #6A6A6A, for secondary text.

**I decided:** #4A4A4A (7.3:1) for secondary text, and raised the dark-mode grey from 50% to 60% white (7.37:1).

**Criterion:** #6A6A6A is only 4.4:1 and fails WCAG AA. My body text uses Manrope Light, which is thin, so I aimed for AAA instead of the minimum.

*Commit: 16a89c6, 2026-11-03*

---

## 3. How the projects appear on the home page

**Claude suggested:** a spiral of curved project cards with metrics.

**I decided:** dropped the spiral after trying it, and replaced it with a fly-through: scrolling moves the camera forward and each project grows from an outlined box into its card. Screen readers and reduced motion get a plain list.

**Criterion:** the projects have to be easy to find and read. The spiral was busy and the cards were hard to read at an angle. One centered project at a time keeps the focus on the work while keeping the motion I want on the site.

*Commits: 3a30e6b, 37c8433, 2026-11-05*

---

## 4. "How I work" on the About page

**Claude suggested:** a circle diagram of my process loop.

**I decided:** four numbered steps (Research, Synthesis, Prototype, Test) with a bracket from the last step back to the first, and blue "AI" badges on the steps where AI drafts and I decide.

**Criterion:** readability. The circle's small text didn't read well, especially on phones. The steps keep the loop and stay legible at every size.

*Commit: ffdfcfd, 2026-11-04*

---

## 5. How I describe my role at Bauer Media Group

**Claude suggested:** "the UX designer" on the CMS and design system rebuild.

**I decided:** "part of the team rebuilding a legacy content management system and a new design system."

**Criterion:** accuracy. I worked inside a larger product and design team, and a hiring manager will check claims in the interview. Overclaiming costs more than it gains.

*Commit: 1300a9e, 2026-11-03*
