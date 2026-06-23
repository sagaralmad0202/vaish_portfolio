# DESIGN.md — Vaishnavi Hiremath Portfolio

> **Purpose**: Single source of truth for the visual identity, component rules, and interaction patterns of this portfolio. Every UI decision—by human or AI—must follow this document. The goal is a clean, human-crafted feel that avoids generic "template" aesthetics.

---

## 1. Design Philosophy

**"Warm Minimalism"** — Inspired by Resend's editorial clarity and Vercel's functional elegance. The design should feel like a well-curated magazine spread, not a Bootstrap template.

### Core Principles

| Principle           | What it means in practice                                                                 |
|---------------------|-------------------------------------------------------------------------------------------|
| **Intentional space** | Generous whitespace. Never cram sections. Let content breathe.                            |
| **Quiet hierarchy**   | Readers should know where to look without needing bold colors screaming at them.           |
| **Warm, not cold**    | Light warm canvas (off-white, ivory) — not stark `#ffffff`. Earthy accent, not neon blue. |
| **Human texture**     | Subtle imperfections: slight border-radius variance, organic transitions, no pixel-perfect robotic grids. |
| **Editorial pacing**  | Each section should feel like turning a page. Sections should have clear beginnings and ends with breathing room between them. |

### Anti-Patterns (Things That Make It Look AI-Generated)

- ❌ **Perfectly symmetrical hero layouts** — avoid left-text / right-image with 50/50 split
- ❌ **Rainbow gradient accents** — no neon, no purple-to-blue gradients
- ❌ **Card grids with identical sizing** — vary visual rhythm
- ❌ **Generic typing-cursor effects** as the only hero animation
- ❌ **Section titles that say "My ____"** — e.g., "My Portfolio", "My Skills" feels templated
- ❌ **Hover effects that uniformly `translateY(-8px)`** on every element
- ❌ **Tech tag pills** that all look the same with identical styling
- ❌ **Empty placeholder icon areas** in project cards
- ❌ **Over-use of box-shadow** on every card

---

## 2. Color Palette

The palette is warm, muted, and low-contrast on backgrounds. High contrast is reserved for text readability only.

### Tokens

```
--color-canvas:          #F7F5F0       /* warm off-white, main background */
--color-surface:         #FFFFFF       /* cards, elevated elements */
--color-surface-alt:     #F0EDE6       /* alternating section backgrounds */
--color-border:          #E8E4DC       /* warm gray borders, subtle */
--color-border-hover:    #D4CFC5       /* borders on hover/focus */

--color-ink:             #1C1917       /* primary text — stone-900 */
--color-ink-secondary:   #57534E       /* secondary text — stone-600 */
--color-ink-tertiary:    #A8A29E       /* captions, meta — stone-400 */

--color-accent:          #8B6F4E       /* warm brown — primary accent */
--color-accent-hover:    #6B5438       /* darker brown on hover */
--color-accent-subtle:   rgba(139, 111, 78, 0.08)   /* accent tinted backgrounds */
--color-accent-ring:     rgba(139, 111, 78, 0.20)   /* focus ring */
```

### Usage Rules

- **Accent color is used sparingly**: only on primary CTAs, active nav indicators, and links. Never as a full section background.
- **No more than 2 surface colors** visible at once. Alternate between `--color-canvas` and `--color-surface-alt` for sections.
- **Borders are optional**. Default to `transparent` or `--color-border` only when distinction is needed.
- **Never use pure black** (`#000000`) for text. Use `--color-ink` instead.
- **Never use pure white** (`#FFFFFF`) as a page background. Use `--color-canvas`.

---

## 3. Typography

### Font Stack

```
--font-heading:  'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-body:     'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

Load via Google Fonts:
```
Montserrat: 400, 500, 600, 700
Poppins:    400, 500
```

### Type Scale

| Token         | Size     | Weight | Line-height | Letter-spacing | Used For                        |
|---------------|----------|--------|-------------|----------------|---------------------------------|
| `display`     | 3rem     | 700    | 1.1         | -0.025em       | Hero name only                  |
| `heading-1`   | 2rem     | 600    | 1.2         | -0.02em        | Section titles                  |
| `heading-2`   | 1.25rem  | 600    | 1.3         | -0.01em        | Card titles, subsection heads   |
| `heading-3`   | 1rem     | 600    | 1.4         | 0              | Sub-headings, labels            |
| `body`        | 0.9375rem| 400    | 1.7         | 0              | Paragraphs, descriptions        |
| `body-small`  | 0.8125rem| 400    | 1.6         | 0              | Meta text, dates, captions      |
| `caption`     | 0.75rem  | 500    | 1.5         | 0.04em         | Tags, badges, overlines         |
| `overline`    | 0.6875rem| 600    | 1.5         | 0.08em         | Category labels (uppercase)     |

### Typography Rules

- **Section titles**: Use `heading-1` in `--color-ink`. No colored accent on partial words (e.g., no "My **Portfolio**" with the second word colored).
- **Hero name**: `display` size. The name should be the only element at this scale.
- **Body copy max-width**: `600px` on desktop to maintain readable line lengths.
- **No ALL-CAPS headings** except for `overline` category labels.
- **Font-weight 700** is reserved for the hero name and section headings only.

---

## 4. Spacing & Layout

### Spacing Scale

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   24px
--space-6:   32px
--space-7:   48px
--space-8:   64px
--space-9:   96px
--space-10:  128px
```

### Layout Constraints

| Element                | Max-width | Padding (horizontal) |
|------------------------|-----------|----------------------|
| `.container`           | 1080px    | 24px                 |
| Narrow content (about) | 680px     | 24px                 |
| Wide content (grid)    | 1080px    | 24px                 |

### Section Spacing

- **Between sections**: `--space-9` (96px) top padding, `--space-9` bottom padding
- **Section title → content**: `--space-7` (48px) gap
- **Between cards in a grid**: `--space-5` (24px) gap
- **Inside cards**: `--space-6` (32px) padding

### Grid Rules

- **Specialization cards**: 3-column on desktop, 1-column on mobile
- **Project cards**: 2-column on desktop, 1-column on mobile
- **Contact**: 2-column (info | form) on desktop, stacked on mobile
- **Never use equal-height cards** that force awkward stretching. Let content dictate height.

---

## 5. Components

### 5.1 Navbar

```
Position:     fixed, top: 0
Background:   rgba(247, 245, 240, 0.85) with backdrop-filter: blur(12px)
Height:       56px
Border:       none by default, 1px solid var(--color-border) when scrolled
Shadow:       none (no box-shadow ever on the navbar)
```

- **Logo**: Text-based, `heading-3` weight 600, color `--color-ink`. No icon.
- **Nav links**: `body-small` weight 500, color `--color-ink-secondary`.
- **Active link**: color `--color-ink`, with a 2px bottom border in `--color-accent`.
- **Hover**: color `--color-ink`, no underline.
- **Transition**: `color 200ms ease`.

### 5.2 Buttons

**Primary**:
```
Background:     var(--color-accent)
Color:          #FFFFFF
Padding:        12px 24px
Border-radius:  6px
Font:           caption weight 600, uppercase, letter-spacing 0.04em
Hover:          background var(--color-accent-hover), translateY(-1px)
Transition:     all 200ms ease
Shadow:         none (no box-shadow)
```

**Secondary/Outline**:
```
Background:     transparent
Border:         1.5px solid var(--color-accent)
Color:          var(--color-accent)
Hover:          background var(--color-accent-subtle)
```

**Button Rules**:
- Max 2 buttons side-by-side
- Primary button always on the left
- Never stack buttons vertically on desktop
- Button text should be action-oriented: "Get in Touch", "View Project", not "Click Here"

### 5.3 Cards

```
Background:     var(--color-surface)
Border:         1px solid var(--color-border)
Border-radius:  8px
Padding:        var(--space-6)
Shadow:         none by default
Hover shadow:   0 2px 12px rgba(0,0,0,0.04)
Hover border:   var(--color-border-hover)
Transition:     border-color 200ms ease, box-shadow 200ms ease
```

**Card Rules**:
- **No translateY on hover**. Cards stay in place. Only border and shadow change.
- **No colored borders on hover**. Use `--color-border-hover` (neutral gray), not accent color.
- **No icon circles** with background fills. Use plain line icons if needed.
- Cards should not have headers with colored backgrounds.

### 5.4 Tags / Badges

```
Background:     var(--color-accent-subtle)
Color:          var(--color-accent)
Font:           caption
Padding:        4px 10px
Border-radius:  4px
Border:         none
```

### 5.5 Timeline (Experience)

```
Line:           2px solid var(--color-border), not gradient
Dot:            10px circle, background var(--color-accent), no border
Card:           standard card component (see 5.3)
```

- No gradient on the timeline line
- Dots are small (10px), not large decorative circles

### 5.6 Form Inputs

```
Background:     var(--color-canvas)
Border:         1px solid var(--color-border)
Border-radius:  6px
Padding:        12px 16px
Font:           body
Focus border:   var(--color-accent)
Focus ring:     0 0 0 3px var(--color-accent-ring)
Transition:     border-color 200ms ease, box-shadow 200ms ease
```

---

## 6. Interactions & Animations

### Core Principles
- **Subtle over dramatic**. No element should move more than 4px.
- **Fast transitions**. 200ms for color/opacity, 300ms for layout shifts.
- **No bounce easing**. Use `ease` or `cubic-bezier(0.4, 0, 0.2, 1)`.

### Scroll Animations

```
Initial:        opacity: 0, translateY(16px)
Final:          opacity: 1, translateY(0)
Duration:       500ms
Easing:         cubic-bezier(0.4, 0, 0.2, 1)
Trigger:        IntersectionObserver at 15% visibility
Stagger:        100ms between consecutive items
```

### Hover Effects

| Element       | Effect                                                      |
|---------------|-------------------------------------------------------------|
| Nav links     | Color change only                                           |
| Buttons       | Background darken + translateY(-1px)                        |
| Cards         | Border color change + subtle shadow                         |
| Links         | Color change only, no underline animation                   |
| Social icons  | Background fill + color invert                              |

### Hero Animation
- **Typing effect**: Keep it, but slow down. 100ms per character (type), 50ms (delete), 3000ms pause.
- **Hero image**: Gentle float with `translateY(±8px)` over 8s, not 6s. More subtle.
- **No particle effects, no gradient blobs, no cursor followers.**

---

## 7. Responsive Breakpoints

```
--bp-sm:   640px    /* Mobile landscape */
--bp-md:   768px    /* Tablet portrait */
--bp-lg:   1024px   /* Tablet landscape / small desktop */
--bp-xl:   1280px   /* Desktop */
```

### Mobile Rules (< 768px)
- Navbar becomes hamburger menu
- All grids collapse to single column
- Hero becomes full-width stacked layout (text → image)
- Section padding reduces to `--space-8` (64px)
- `display` font-size reduces to `2.2rem`
- Container padding increases to `20px`

---

## 8. Section-Specific Guidelines

### Hero
- **Layout**: Asymmetric — text block takes ~60%, visual takes ~40%
- **Greeting line**: `overline` style, uppercase, `--color-accent`
- **Name**: `display` size, `--color-ink`
- **Role typing**: `heading-2` size, `--color-accent`
- **Description**: `body` size, `--color-ink-secondary`, max-width 480px
- **CTAs**: Inline, primary + outline
- **Social links**: Small circles (36px), border only, no fill

### About
- **Single column layout**, centered, max-width 680px
- **No profile image grid** — keep it text-focused
- **Details grid**: 2-column on desktop, labels in `--color-ink` bold, values in `--color-ink-secondary`
- **Resume button**: Primary button style

### Specialization
- **3-column card grid**
- **Icons**: Simple line SVGs, 24px, `--color-accent`. No circular backgrounds.
- **Card title**: `heading-2`
- **Card body**: `body-small`, `--color-ink-secondary`

### Portfolio
- **2-column card grid**
- **Project image area**: Subtle gradient background using `--color-accent-subtle`, show actual SVG icon related to the project
- **Category label**: `overline` style
- **Tech tags**: Use component 5.4
- **Project link**: `body-small` weight 600, `--color-accent`, with `→` arrow

### Experience
- **Timeline layout** with vertical line on left
- **Date badges**: `caption` style with `--color-accent-subtle` background
- **List items**: Prefixed with `▹` in `--color-accent`

### Education
- **Single centered card** for degree
- **Certifications**: Stacked list cards, no icons, clean text only

### Contact
- **2-column**: Info cards (left) + Form (right)
- **Info cards**: Icon (line SVG) + text, compact
- **Form**: Clean inputs, no labels (placeholder only is fine), single submit button

---

## 9. File Structure Conventions

```
src/
├── index.css          # All styles — single CSS file, no modules
├── App.jsx            # Single-page component
├── main.jsx           # React entry point
└── assets/            # Static imports if needed

public/
├── developer-character.jpg
├── avatar.jpg
├── favicon.svg
└── Vaishnavi_Hiremath_Resume.pdf
```

### CSS Organization
Styles in `index.css` should follow this order:
1. Reset & CSS custom properties
2. Base styles (body, links, container)
3. Navbar
4. Hero
5. Sections (shared)
6. About
7. Specialization
8. Portfolio
9. Experience
10. Education
11. Contact
12. Footer
13. Animations
14. Responsive overrides

---

## 10. Checklist: Does It Look Human-Made?

Before shipping, verify:

- [ ] No section uses more than 2 colors (background + accent)
- [ ] Body text line-length stays under 70 characters
- [ ] Cards don't jump on hover — only border/shadow changes
- [ ] Section spacing feels generous, not cramped
- [ ] No identical hover effects across all interactive elements
- [ ] Typography hierarchy is clear without relying on color
- [ ] The accent color appears in < 20% of the viewport at any scroll position
- [ ] Mobile layout doesn't just shrink desktop — it restructures
- [ ] No empty placeholder areas or dummy icons
- [ ] The page feels like it was designed for *this specific person*, not a template
