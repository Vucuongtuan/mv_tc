---
name: scss-styling
description: Guide for writing SCSS Modules combined with TailwindCSS in the portfolio project. Use this skill when styling components, creating CSS animations, and working with design tokens.
license: MIT
metadata:
  author: portfolio-team
  version: "1.0.0"
  category: styling
  tags: scss, tailwindcss, css-modules, design-system
---

# SCSS Styling Guide

Comprehensive guide for writing styles following the portfolio_astro project conventions.

## When to Use This Skill

Activate this skill when:

- Creating styles for new components
- Adding animations and transitions
- Working with responsive design
- Configuring design tokens and CSS variables

## Styling Tech Stack

- **SCSS Modules** (`.module.scss`)
- **TailwindCSS 3.4** with `@apply` directive
- **CSS Variables** for theming
- **PostCSS** with autoprefixer

## SCSS Module File Structure

```scss
// ========== SECTION/WRAPPER ==========
.section {
  @apply relative w-full;
  // Custom CSS if Tailwind is insufficient
}

// ========== CONTAINER ==========
.container {
  @apply max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24;
}

// ========== SUB-COMPONENTS ==========
.card {
  @apply relative;

  // Pseudo-elements
  &::before {
    content: "";
    @apply absolute inset-0;
  }

  // States
  &:hover {
    @apply bg-black text-white;
  }

  // Nested selectors
  &Inner {
    @apply p-8;
  }
}

// ========== ANIMATIONS ==========
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animated {
  animation: fadeIn 0.3s ease-out;
}
```

## Design Tokens (CSS Variables)

### Global Variables (`src/styles/global.css`)

```css
:root {
  --bg-pure: #ffffff;
  --text-stark: #000000;
  --accent-subtle: #e5e7eb;
}

.dark {
  --bg-pure: #0a0a0a;
  --text-stark: #ffffff;
  --accent-subtle: #262626;
}
```

### Tailwind Config (`tailwind.config.js`)

```javascript
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "bg-pure": "#ffffff",
        "text-stark": "#000000",
        "accent-subtle": "#e5e7eb",
      },
      fontFamily: {
        mono: ["'Space Mono'", "monospace"],
      },
    },
  },
};
```

## Naming Convention Rules

### ClassName Pattern

| Type        | Pattern                             | Example                        |
| ----------- | ----------------------------------- | ------------------------------ |
| Wrapper     | `.section`, `.ctn`, `.wrapper`      | `.section`                     |
| Container   | `.container`, `.box`                | `.container`                   |
| Columns     | `.[side]Col`                        | `.leftCol`, `.rightCol`        |
| Cards       | `.card`, `.cardInner`, `.cardTitle` | `.card`                        |
| Decorations | `.cardDeco[Position]`               | `.cardDecoTop`                 |
| States      | `.filled`, `.active`, `.hidden`     | `.filled`                      |
| Utilities   | `.[action][Target]`                 | `.skillGrid`, `.originWrapper` |

### Nesting Pattern

```scss
// Good ✅ - Flat structure with related classes
.card {
}
.cardInner {
}
.cardTitle {
}
.cardContent {
}

// Bad ❌ - Deep nesting
.card {
  .inner {
    .title {
    }
  }
}
```

## Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Example                       |
| ---------- | --------- | ----------------------------- |
| `sm`       | 640px     | `@apply sm:px-12`             |
| `md`       | 768px     | `@apply md:flex-row`          |
| `lg`       | 1024px    | `@apply lg:px-24`             |
| `xl`       | 1280px    | `@apply xl:max-w-7xl`         |
| `2xl`      | 1536px    | `@apply 2xl:max-w-screen-2xl` |

### Mobile-First Pattern

```scss
.container {
  // Mobile (default)
  @apply px-6;

  // Tablet
  @apply sm:px-12;

  // Desktop
  @apply lg:px-24;
}
```

## Transitions & Animations

### Standard Transitions

```scss
.element {
  @apply transition-all duration-300 ease-out;

  // Or custom cubic-bezier
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Hover Effects Pattern

```scss
.card {
  @apply relative;

  &Inner {
    @apply bg-white border-4 border-black;
    box-shadow: 10px 10px 0px 0px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease-out,
      box-shadow 0.3s ease-out;
  }

  &:hover &Inner {
    box-shadow: 15px 15px 0px 0px rgba(0, 0, 0, 0.15);
  }
}
```

### CSS Keyframe Animations

```scss
@keyframes mouse-scroll {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(12px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.scrollIcon {
  animation: mouse-scroll 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
```

## Special Techniques

### Text Effects (Brutalist Style)

```scss
.heading {
  @apply font-serif font-black leading-[0.8] tracking-tighter select-none mix-blend-multiply;
  font-size: clamp(5rem, 12vw, 8rem);
  color: transparent;
  -webkit-text-stroke: 2px #000;
  background: linear-gradient(180deg, #000 0%, #000 100%);
  background-clip: text;
  -webkit-background-clip: text;
  background-size: 100% 0%;
  background-repeat: no-repeat;

  &.filled {
    background-size: 100% 100%;
    -webkit-text-stroke: 0px;
  }
}
```

### Background Patterns

```scss
.bg-pattern {
  background-image: radial-gradient(
    circle at 2px 2px,
    var(--accent-subtle) 1px,
    transparent 0
  );
  background-size: 80px 80px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4));
}

.line-pattern {
  background:
    linear-gradient(90deg, var(--accent-subtle) 1px, transparent 1px) 0 0 /
      120px 120px,
    linear-gradient(0deg, var(--accent-subtle) 1px, transparent 1px) 0 0 / 120px
      120px;
  opacity: 0.1;
}
```

### Decorative Shapes

```scss
.cardDecoTop {
  @apply absolute -top-4 -left-4 w-full h-full border-2 border-accent-subtle/50 -z-10;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  .card:hover & {
    @apply -top-2 -left-2;
  }
}
```

## Code Rules

### MUST DO ✅

1. **Use `@apply`** for Tailwind utilities
2. **CSS Variables** for theming values
3. **Mobile-first** responsive approach
4. **Flat nesting** - maximum 2 levels
5. **Comment sections** with `// ========== SECTION ==========`
6. **Consistent naming** following module pattern

### MUST NOT DO ❌

1. **!important** - avoid completely
2. **Deep nesting** > 3 levels
3. **Magic numbers** - use Tailwind spacing/sizing
4. **Inline styles** in components
5. **Global selectors** in SCSS modules

## New Style Checklist

- [ ] Create `.module.scss` file in same folder as component
- [ ] Import with `import st from './[name].module.scss'`
- [ ] Use `st.className` in JSX
- [ ] Add responsive styles (mobile-first)
- [ ] Add hover/focus states
- [ ] Test dark mode if using CSS variables
- [ ] Verify with Prettier formatting
