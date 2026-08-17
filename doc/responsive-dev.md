# Mobile-First Responsive Development Playbook & Engineering Standard

> **Derivative Genius Engineering Manifesto**  
> *"Mobile is not a scaled-down desktop; desktop is an expanded mobile."*  
> In a mobile-first world, every digital experience Derivative Genius crafts must not merely "work" on a smartphone—it must be **effortless, ergonomic, lightning-fast, and deeply enjoyable**.

---

## 1. 🎯 Core Philosophy & Ergonomic Principles

### The 4 Pillars of Mobile-First Development
1. **Touch-First Ergonomics**: Mouse cursors are precise to $1\text{px}$; human thumbs are soft contact pads requiring $\ge 48\text{px}$ target zones.
2. **Interruption-Resilient UX**: Mobile users interact in 15-second micro-sessions while walking, commuting, or multitasking. Context must never be lost.
3. **Network & Hardware Restraint**: Design for variable 4G/3G network latency, low-battery CPU throttling, and high-DPI OLED screens.
4. **Progressive Enhancement**: Build the absolute best core experience for a $320\text{px}$ viewport first, then enhance for wide screens using CSS Container Queries and `@media (min-width: ...)`.

---

## 2. 📱 Thumb Zone Topology & Touch Psychology

### The Ergonomic Screen Map

```
┌──────────────────────────────────────┐
│           STRETCH / HARD             │ ← Top Navigation, back arrows, status icons
│         (Secondary Actions)          │
├──────────────────────────────────────┤
│               NATURAL                │ ← Reading area, inline media, secondary buttons
│        (Content Interaction)         │
├──────────────────────────────────────┤
│               EASY                   │ ← Primary CTAs, bottom tab navigation,
│       (Thumb's Natural Arc)          │    floating actions, drawer triggers
└──────────────────────────────────────┘
                  [  BAR  ]
```

### Fitts' Law for Mobile Touch
* **Minimum Touch Target**: Every interactive element (buttons, icon links, inputs, checkboxes) MUST have an active tap area of at least **$48\text{px} \times 48\text{px}$** ($44\text{pt}$ on iOS).
* **Target Isolation**: Maintain a minimum gap of **$8\text{px}$** between neighboring tap targets to prevent accidental mis-taps.
* **Primary Actions**: Place key conversion actions (e.g., "Submit", "Call Now", "Book Scoping Call") within the **Bottom Ergonomic Zone** ($0 - 200\text{px}$ from viewport bottom).

---

## 3. 📐 Responsive Layout Architecture & Breakpoints

### Mobile-First CSS Query Hierarchy
Write all base CSS for mobile viewports without media queries, adding layout enhancements as viewports expand:

| Breakpoint Name | Media Query | Target Viewports | Layout Strategy |
| :--- | :--- | :--- | :--- |
| **Mobile (Base)** | Default (No Query) | $320\text{px} - 639\text{px}$ | Single column flex, full-width cards, fixed bottom CTA bar |
| **Tablet Small (`sm`)** | `@media (min-width: 640px)` | $640\text{px} - 767\text{px}$ | 2-column grid cards, expanded spacing |
| **Tablet Large (`md`)** | `@media (min-width: 768px)` | $768\text{px} - 1023\text{px}$ | 2 or 3-column layouts, sticky sidebar navigation |
| **Desktop (`lg`)** | `@media (min-width: 1024px)` | $1024\text{px} - 1279\text{px}$ | Multi-column grid, persistent sidebars, hover state enhancements |
| **Wide Desktop (`xl`)** | `@media (min-width: 1280px)` | $1280\text{px}+$ | Max-width content containers (`max-w-7xl`), generous whitespace |

### Modern Fluid Typography & Spacing Scale
Utilize CSS `clamp()` functions to transition typography seamlessly across screens without abrupt breakpoint jumps:

```css
:root {
  /* Fluid Typography Scale */
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);        /* 14px -> 16px */
  --font-size-base: clamp(1rem, 0.92rem + 0.4vw, 1.125rem);       /* 16px -> 18px */
  --font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);        /* 20px -> 24px */
  --font-size-xl: clamp(1.75rem, 1.4rem + 1.75vw, 2.5rem);        /* 28px -> 40px */
  --font-size-display: clamp(2.25rem, 1.5rem + 3.75vw, 4.5rem);    /* 36px -> 72px */

  /* Fluid Spacing Scale */
  --space-gutter: clamp(1rem, 4vw, 3rem);
  --space-card-padding: clamp(1rem, 3vw, 2rem);
}
```

### Viewport & Notch Safety (`env()`)
Ensure content is never obscured by device notches, rounded corners, or home indicators:

```css
.mobile-header {
  padding-top: max(1rem, env(safe-area-inset-top));
}

.mobile-bottom-bar {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
```

---

## 4. ⚡ Mobile Core Web Vitals Standards

Every page built by Derivative Genius must meet or exceed these mobile performance benchmarks on simulated **Slow 4G** devices:

```
┌───────────────────────────────┬───────────────────┬────────────────────┐
│ Metric                        │ Target Threshold  │ Primary Technique  │
├───────────────────────────────┼───────────────────┼────────────────────┤
│ Largest Contentful Paint (LCP)│ ≤ 1.8s            │ Next.js Image      │
│                               │                   │ optimization &     │
│                               │                   │ preloaded hero     │
├───────────────────────────────┼───────────────────┼────────────────────┤
│ Interaction to Next Paint(INP)│ ≤ 100ms           │ Passive listeners, │
│                               │                   │ non-blocking JS,   │
│                               │                   │ GPU animations     │
├───────────────────────────────┼───────────────────┼────────────────────┤
│ Cumulative Layout Shift (CLS) │ ≤ 0.05            │ Explicit aspect-   │
│                               │                   │ ratio, font-display│
│                               │                   │ swap stabilization │
└───────────────────────────────┴───────────────────┴────────────────────┘
```

### Mobile Layout & Animation Safeguards
* **Prevent Unintended Horizontal Scrolling**:
  ```css
  body {
    overflow-x: hidden;
    touch-action: manipulation; /* Prevents double-tap zoom delays */
  }
  ```
* **Hardware-Accelerated Mobile Animations**:
  Animate ONLY `transform` and `opacity` to avoid triggering heavy CPU layout reflows on mobile GPUs.

---

## 5. 📝 Mobile Input & Form Design Standards

Forms on mobile are the highest point of user friction. Follow these strict guidelines:

1. **Prevent Automatic iOS Form Zoom**:
   All form input font sizes MUST be at least `16px` (`1rem`) on mobile viewports so iOS Safari does not zoom in automatically when an input is focused.
   ```css
   input, select, textarea {
     font-size: max(16px, 1rem);
   }
   ```
2. **Context-Aware Virtual Keyboards**:
   Specify correct HTML `inputmode` and `type` to pop up the optimal keyboard layout immediately:
   * **Phone**: `type="tel"` `inputmode="tel"`
   * **Email**: `type="email"` `inputmode="email"`
   * **Numeric/Prices**: `type="text"` `inputmode="decimal"`
   * **Verification Codes**: `type="text"` `inputmode="numeric"` `autocomplete="one-time-code"`
3. **Touch-Friendly Form Components**:
   Replace dense native dropdown `<select>` boxes with full-width bottom sheet selection drawers or styled mobile segment buttons for options $\le 4$.

---

## 6. 📱 Interactive Touch Feedback & Micro-Interactions

Mobile users expect tactile responsiveness:
* **Active Tap Feedback**: Every interactive component must provide instantaneous visual feedback using `:active` states or Tailwind active classes (e.g., `active:scale-95 active:opacity-80`).
* **Disable Highlight Callouts**:
  ```css
  a, button, input {
    -webkit-tap-highlight-color: transparent;
  }
  ```
* **Visual Haptics & Loading States**: Show immediate optimistic loading spinners or micro-skeleton placeholders on tap so users know their action was registered.

---

## 7. 🚀 Mobile-First Developer Checklist

Before any feature or page in `dg-web` is considered complete, perform this checklist on a physical mobile device or DevTools Mobile Emulator:

- [ ] **Viewport Check**: Verified on $360\text{px}$ (small Android), $390\text{px}$ (iPhone), and $414\text{px}+$ viewports. Zero horizontal scrollbar.
- [ ] **Touch Target Audit**: All buttons, links, and icons are $\ge 48\text{px} \times 48\text{px}$ with $\ge 8\text{px}$ spacing.
- [ ] **Thumb Access**: Primary conversion action is anchored in the lower thumb-friendly zone.
- [ ] **iOS Zoom Test**: Tapping inputs does NOT cause iOS Safari to auto-zoom the page.
- [ ] **Keyboard Shift Test**: Form inputs remain visible above the software keyboard when focused.
- [ ] **Performance Audit**: LCP $\le 1.8\text{s}$, INP $\le 100\text{ms}$, CLS $\le 0.05$ on mobile 4G throttling.
- [ ] **Notch & Safe Areas**: Layout respects `safe-area-inset-top` and `safe-area-inset-bottom`.
- [ ] **Tap State Feedback**: `-webkit-tap-highlight-color: transparent` configured with active scale/opacity states.

---

## 8. 🛡️ Mobile-Native Architecture & Safety Decisions

### Bottom Drawers & Sheet Interactions
* **Maintained Primitive Only**: Use accessible dialog primitives styled as bottom sheets on mobile viewports (< $768\text{px}$) and centered modals on desktop.
* **Appropriate Use Cases**: Quick actions (call outcomes, lead assignments, pipeline stage changes, date picks, suppression confirms).
* **Forbidden Use Cases**: Large data tables, detailed prospect profiles, or multi-step forms. Use dedicated screens.

### Service Worker & Offline Data Scope (PWA)
* **App Shell Caching**: Cache HTML shell, CSS, JS, fonts, icons, and static assets for instant load and installability.
* **Strict Network-Only Policy**: Never cache prospect records, PII, enrichment data, call notes, suppression lists, or auth responses. Outdated cached suppression states can cause opt-out compliance violations.

### Tactile Vibration API (`provideTactileFeedback`)
* **Progressive Enhancement**: Treat `navigator.vibrate()` as an optional enhancement guarded by feature detection.
* **Restricted Triggers**: Limit to high-confidence actions (drag-and-drop stage moves, task completions, call outcome saves, destructive warnings). Never trigger on basic navigation, typing, or standard scrolling.

