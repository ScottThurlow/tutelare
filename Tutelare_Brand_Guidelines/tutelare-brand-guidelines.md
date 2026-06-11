# Tutelare — Brand & Web Guidelines

> Reference spec for building Tutelare web properties. Tutelare is an **AI strategy & governance consultancy** focused on **scaling human oversight** as organizations adopt AI. The brand should read **cutting-edge, expert, scalable, and safe** — institutional and trustworthy, never loud.

This document is self-contained. The repo ships a ready-to-use stylesheet (`tutelare.css`) and logo assets (`/svg`); prefer using those tokens and classes over inventing new ones.

---

## 1. Brand essence

- **Name:** Tutelare (from Latin *tutelaris* — "guardian / protector").
- **Positioning:** A measured, forward-looking advisory practice for AI strategy, governance, risk, and assurance.
- **Personality:** Expert, calm, precise, human-centered. Think trusted advisory firm with the technical credibility of a frontier lab.
- **Logo concept ("Scan"):** A ring + a horizontal axis + a core = a *watch-point on an axis of observation*. It signals oversight, observability, and precision, and stays crisp from a 16px favicon to signage.

**Tone in writing:** confident and plain. Short sentences. No hype, no fear-mongering. Oversight is framed as the thing that *enables* safe acceleration, not a brake.

---

## 2. Logo

Assets live in `/svg` (all vector, transparent unless noted):

| File | Use |
|---|---|
| `tutelare-mark.svg` | Primary mark — navy + teal, light backgrounds |
| `tutelare-mark-reverse.svg` | Mark for dark backgrounds (light strokes + cyan) |
| `tutelare-app-icon.svg` | Rounded navy tile — favicon, app icon, avatars |
| `tutelare-lockup.svg` | Horizontal mark + wordmark, light backgrounds |
| `tutelare-lockup-reverse.svg` | Lockup for dark backgrounds |

**Rules**
- Use the **lockup** wherever space allows; use the **standalone mark** for avatars, app icons, and tight spaces.
- **Clear space:** keep at least the ring's diameter of empty space on all sides.
- **Minimum size:** mark ≥ 24px; lockup ≥ 120px wide.
- **Don't:** recolor outside the palette, add shadows/gradients/outlines to the mark, stretch, rotate, or rebuild the wordmark in another typeface.
- The wordmark is **Hanken Grotesk SemiBold (600)** with a teal period. The lockup SVGs render the wordmark via a live web-font link — **outline text to paths** for print/Illustrator use.

### Mark geometry (if regenerating)
`viewBox 0 0 100 100`, `fill="none"`:
```xml
<circle cx="50" cy="50" r="29" stroke="#14233E" stroke-width="5"/>
<line x1="6" y1="50" x2="94" y2="50" stroke="#168E9C" stroke-width="3.6" stroke-linecap="round"/>
<circle cx="50" cy="50" r="8" fill="#14233E"/>
<circle cx="50" cy="50" r="3.2" fill="#168E9C"/>
```
On dark: strokes/seat `#EAF1F3`, axis/pupil `#4BC8D2`.

---

## 3. Color

Deep institutional **navy** carries the brand; a single technical **teal** does all accenting (links, highlights, the axis). On dark fields, swap teal for the brighter **cyan**. Keep saturation restrained.

| Token (CSS var) | Hex | Role |
|---|---|---|
| `--navy` | `#14233E` | Primary ink & brand color |
| `--navy-900` | `#0D1729` | Darkest — hero / footer fields |
| `--navy-700` | `#1A2C4B` | Hover / elevated navy |
| `--teal` | `#168E9C` | Accent · links · highlights · the axis |
| `--teal-700` | `#0F7480` | Link hover / pressed |
| `--teal-100` | `#E4F2F3` | Teal wash (badges, selection) |
| `--cyan` | `#4BC8D2` | Accent for dark backgrounds |
| `--slate` | `#3A4658` | Body text |
| `--slate-2` | `#56616F` | Secondary text |
| `--muted` | `#7C8796` | Captions, meta, mono labels |
| `--line` | `#E4E8ED` | Hairline borders |
| `--paper` | `#F7F8FA` | Tinted background block |
| `--paper-2` | `#EDF0F4` | Inline code / chips |
| `--white` | `#FFFFFF` | Base background |

**Accessibility:** navy/slate on white and white/cyan on navy-900 all clear WCAG AA for body text. Don't put teal text on white at small sizes for long copy — use it for links, labels, and accents.

---

## 4. Typography

Two families, used with discipline:

- **Hanken Grotesk** (humanist sans) — all headings and body. Warm enough to feel human-centered, precise enough to feel expert.
- **JetBrains Mono** — eyebrows/kickers, labels, data, code.

Load (already handled by `tutelare.css`):
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Role | Size token | Weight | Notes |
|---|---|---|---|
| Display | `--fs-display` clamp(2.9→4.6rem) | 700 | Hero only; line-height 1.02, tracking -0.03em |
| H1 | `--fs-h1` clamp(2.3→3.4rem) | 700 | tracking -0.022em |
| H2 | `--fs-h2` clamp(1.6→2.1rem) | 600 | |
| H3 | `--fs-h3` 1.4rem | 600 | |
| Lead | `--fs-lead` 1.31rem | 400 | Intro paragraph, color `--slate-2` |
| Body | `--fs-body` 1.0625rem (17px) | 400 | line-height 1.62 |
| Eyebrow | `--fs-eyebrow` 0.78rem | 500 mono | UPPERCASE, letter-spacing 0.22em, teal |

**Rules:** headings use `text-wrap: balance`; body uses `text-wrap: pretty`. Cap readable text at `--measure` (68ch). One eyebrow per section, in mono, to anchor it.

---

## 5. Spacing, radii, elevation

- **Space scale (4px base):** `--s-1` 4px · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128. Section padding is typically `--s-9`.
- **Radii:** `--r-sm` 8px · `--r` 12 · `--r-lg` 18 · `--r-pill` 999px (buttons & badges are pill).
- **Shadow:** `--shadow-sm` for resting cards, `--shadow` on hover. Elevation is subtle — no heavy drop shadows.
- **Layout:** `--container` 1120px max width, centered, `--s-5` inline padding. Use `.grid`, `.grid--2`, `.grid--3` with `gap: var(--s-6)`.

---

## 6. Components (`tutelare.css`)

Drop the stylesheet in and use these classes — no extra CSS needed for the basics:

```html
<link rel="stylesheet" href="tutelare.css">
```

- **Eyebrow / kicker:** `<p class="eyebrow">01 · Governance</p>`
- **Buttons:** `.btn` (navy, primary), `.btn .btn--accent` (teal), `.btn .btn--ghost` (outline). All pill-shaped, lift on hover.
- **Card:** `.card` — white, hairline border, lifts on hover. Pair with an `.eyebrow` + `h3` + `p`.
- **Badge / pill:** `.badge` — mono uppercase on teal wash (e.g. "EU AI Act ready").
- **Blockquote:** teal left rule + optional `<cite>`.
- **Tick list:** `<ul class="ticks">` — teal ring bullets for service/feature lists.
- **Sections:** `.section` (vertical rhythm), `.section--tint` (paper bg), `.section--ink` (navy bg — auto-swaps headings to white and accents to cyan).
- **Code:** inline `<code>` and block `<pre><code>` (dark).
- **Prose links:** wrap long-form copy in `.prose` so links get the underline treatment.

### Minimal page skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tutelare</title>
  <link rel="icon" type="image/svg+xml" href="svg/tutelare-app-icon.svg">
  <link rel="stylesheet" href="tutelare.css">
</head>
<body>
  <section class="section section--ink">
    <div class="container">
      <img src="svg/tutelare-lockup-reverse.svg" alt="Tutelare" width="300">
      <p class="eyebrow">AI Strategy &amp; Governance</p>
      <h1>Scaling human oversight</h1>
      <p class="lead">A forward-looking advisory practice for organizations adopting AI at scale.</p>
      <a class="btn btn--accent">Book an assessment</a>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="eyebrow">What we do</p>
      <div class="grid grid--3">
        <div class="card"><p class="eyebrow">Assess</p><h3>Governance audit</h3><p>Map where AI touches decisions, and where human oversight must sit.</p></div>
        <div class="card"><p class="eyebrow">Design</p><h3>Control frameworks</h3><p>Policies and checkpoints that scale with model capability.</p></div>
        <div class="card"><p class="eyebrow">Assure</p><h3>Ongoing review</h3><p>Standing oversight as your deployment footprint grows.</p></div>
      </div>
    </div>
  </section>
</body>
</html>
```

---

## 7. Do / Don't

**Do**
- Let navy + white carry the page; use teal sparingly as the single accent.
- Use one eyebrow per section to create rhythm.
- Keep imagery and UI restrained, geometric, and high-contrast.
- Use the reverse lockup + cyan on `--navy-900` for heroes and footers.

**Don't**
- Introduce new accent colors or gradients on the mark.
- Use more than the two type families.
- Set long body copy in teal or in all-caps.
- Stretch, recolor, or rebuild the logo.

---

## 8. Asset checklist (ask if missing)

Shipped: SVG mark/reverse/app-icon/lockups, `tutelare.css`, `styleguide.html`.
Not yet generated (request as needed): PNG exports at fixed sizes, `.ico` favicon, OG/social share image (1200×630), email-signature lockup, outlined-text logo files for print.

---

*File map:* `tutelare.css` · `styleguide.html` · `svg/…` · this file (`tutelare-brand-guidelines.md`).
