# Design System Specification

## 1. Overview & Creative North Star: "The Silent Architect"
This design system is built upon the philosophy of **"The Silent Architect."** Much like high-end editorial magazines or premium architectural monographs, the interface does not shout for attention; it commands it through precision, absence, and mathematical intent.

The goal is to move beyond the "templated" look of modern SaaS. We achieve this by breaking the rigid, boxy grid in favor of **intentional asymmetry** and **tonal depth**. This system prioritizes the content by treating the screen as a gallery space—using generous margins and high-contrast typography to create a "quiet" but authoritative atmosphere. We replace decorative noise with sophisticated glassmorphism and light-based layering.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, cinematic slate that provides a "darkroom" effect, allowing the Electric Blue accent and crisp typography to pop with clinical precision.

### The Foundation
- **Base Background:** `neutral_color_hex` (#202020).
- **Core Accent:** `primary_color_hex` (#3B82F6) for high-impact highlights and interactive surfaces.

### The "No-Line" Rule
To maintain a premium editorial feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries between content areas must be defined exclusively through background color shifts or vertical white space.
- *Example:* A side navigation panel should not have a border; instead, use a slightly lighter background against a `neutral_color_hex` main content area.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials. Use the `surface-container` tiers to create "nested" depth:
- **Base Level:** `neutral_color_hex`
- **Secondary Sections:** Slightly lighter shade of `neutral_color_hex`
- **Interactive Cards/Floating Elements:** Lightest shade of `neutral_color_hex`

### The "Glass & Gradient" Rule
To avoid a flat, "Bootstrap" appearance:
- **Glassmorphism:** For overlays, modals, or floating navigation, use a slightly lighter shade of `neutral_color_hex` at 10-15% opacity with a `backdrop-filter: blur(20px)`.
- **Signature Gradients:** Main CTAs and Hero accents should utilize a subtle linear gradient based on `primary_color_hex` (#3B82F6) at a 135-degree angle. This adds a "lithographic" quality that flat colors lack.

---

## 3. Typography
We utilize **Inter** exclusively. The identity of this system relies on a massive contrast between high-end display sizes and utilitarian labels.

- **Display Scale:** Use `display-lg` (3.5rem) for hero statements. Increase letter-spacing slightly (-0.02em) to lean into the "Apple-esque" precision.
- **The Editorial Hook:** Use `headline-md` for section titles, but pair it with a `label-sm` "eyebrow" text in `primary_color_hex` to anchor the eye.
- **Readability:** All body text must use `body-md` (0.875rem) with a generous line-height to ensure the deep background doesn't cause eye fatigue.
- **Hierarchy:** Use a lighter tint of `neutral_color_hex` for secondary information to create a natural visual recedence, keeping the interface "quiet."

---

## 4. Elevation & Depth
Elevation is communicated through **light and tone**, not structural lines.

- **The Layering Principle:** Place a lighter card on a slightly lighter background. The subtle 2-3% shift in hex value is enough to signify depth to the human eye without creating visual clutter.
- **Ambient Shadows:** Standard drop shadows are forbidden. If a floating element (like a dropdown) requires a shadow, use a "Tinted Ambient Shadow": 
    - *Blur:* 40px-60px.
    - *Opacity:* 6%.
    - *Color:* A soft blue-tinted shadow to mimic natural light refraction.
- **The "Ghost Border" Fallback:** For accessibility on interactive inputs, use a "Ghost Border"—the outline color at 10% opacity. It should be felt, not seen.
- **Glassmorphism:** Apply a `1px` stroke using the outline color at 20% opacity to glass containers to simulate the "edge" of a pane of glass.

---

## 5. Components

### Buttons
- **Primary:** Gradient from `primary_color_hex` (#3B82F6) to a slightly darker shade of `primary_color_hex`. Text color `on_primary`. Roundedness `3` (maximum, pill-shaped).
- **Secondary:** A lighter shade of `neutral_color_hex` background with a "Ghost Border."
- **Tertiary:** Pure text using `title-sm` typography with an `8` (2.75rem) horizontal padding to ensure a large hit-target despite the minimal visual footprint.

### Cards & Lists
- **No Dividers:** Never use horizontal rules (`<hr>`). Separate list items using the Spacing Scale (`3` units).
- **Interactive State:** On hover, a card should shift from a slightly lighter `neutral_color_hex` to the lightest `neutral_color_hex`. No movement, just a tonal "glow."

### Input Fields
- **Styling:** Use the lowest `neutral_color_hex` shade for the field background to create an "inset" look. 
- **Rounding:** Consistent `md` (0.75rem) for internal utility elements.
- **Focus:** Transition the "Ghost Border" from 10% to 100% opacity of the `primary_color_hex` token.

### Featured Component: The "Focus Plate"
For high-priority content, use a "Focus Plate"—a large-scale glass container (lightest `neutral_color_hex` at 10% opacity) with a `24` (8.5rem) top margin. This forces the user to focus on a single stream of information, mimicking a premium physical reading experience.

---

## 6. Do's and Don'ts

### Do:
- **Embrace the Void:** Use the `16` (5.5rem) and `20` (7rem) spacing tokens to push elements away from each other.
- **Use Tonal Transitions:** Only change background colors when moving between functional areas (e.g., Header to Body).
- **Check Contrast:** Ensure all text meets AA standards against the `neutral_color_hex` background.

### Don't:
- **Don't use "Dark Grey":** Always use the slate/charcoal tokens provided. Pure greys look "cheap"; these blue-tinted slates look "premium."
- **Don't use 90-degree corners:** Stick strictly to the `3` (maximum, pill-shaped) rounding scale to maintain the soft-tech aesthetic.
- **Don't crowd the edges:** Maintain at least a `6` (2rem) padding from the viewport edge at all times.