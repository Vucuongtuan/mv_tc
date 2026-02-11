# Agents - TC Phim Project

## Overview

This file describes the **Agent patterns** and rules for working effectively with the TC Phim project - an online movie streaming application built with **Next.js 16** and **React 19** and using **Cache Components**.

---

## 📁 Project Structure

```
src/
├── api/                # API handlers and services
├── app/                # App Router (Next.js 16+)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   ├── globals.css     # Global styles
│   └── ...
├── components/         # React components
│   ├── Commons/        # Shared/reusable components
│   ├── Layouts/        # Layout components (Header, Footer, etc.)
│   └── Sections/       # Section components for pages
├── hook/               # Custom React hooks
├── lib/                # Utilities and helpers
│   ├── redux/          # Redux store and slices
│   ├── stores/         # Zustand stores
│   └── utils.ts        # Helper functions
├── stores/             # State management stores
└── types/              # TypeScript type definitions
```

---

## 🛠️ Tech Stack

| Technology            | Version | Purpose                         |
| --------------------- | ------- | ------------------------------- |
| Next.js               | 16.1.6  | Core framework                  |
| React                 | 19.2.4  | UI Library                      |
| TypeScript            | 5.9.3   | Type safety                     |
| Tailwind CSS          | 3.4.19  | Utility-first CSS               |
| SCSS Modules + @apply | -       | Component styling with Tailwind |
| Redux Toolkit         | 2.11.2  | Global state management         |
| Zustand               | 5.0.11  | Lightweight state management    |
| Framer Motion         | 11.18.2 | Animations                      |
| React Hook Form       | 7.71.1  | Form handling                   |
| Zod                   | 3.25.76 | Schema validation               |
| Swiper                | 11.2.10 | Carousel/Slider                 |

---

## 📋 Agent Skills

### 1. 🧩 Feature-Based Component Architecture

**Description:** Organize components using a feature-based architecture optimized for Server Components and caching.

**Structure Pattern:**

```
ComponentName/
├── index.tsx              # Main component (Server Component)
├── SubComponent.tsx       # Child components (PascalCase)
├── ClientPart.tsx         # Client Components with 'use client'
└── component.module.scss  # Styles with @apply
```

**Rules:**

- `index.tsx` - **Server Component** by default, orchestrates layout
- Child components - Use **PascalCase** naming (e.g., `Logo.tsx`, `SearchBar.tsx`)
- Add `'use client'` directive only for components that need:
  - State (`useState`, `useReducer`)
  - Effects (`useEffect`)
  - Browser APIs
  - Event handlers
- Keep Client Components small and focused
- Static parts should remain as Server Components

**Example - Header Component:**

```
Header/
├── index.tsx           # Server Component - layout orchestrator
├── Logo.tsx            # Server Component - static content
├── Navigation.tsx      # Server Component - static menu
├── SearchBar.tsx       # Client Component - input interaction
├── MobileNav.tsx       # Client Component - has state
├── AuthButton.tsx      # Client Component - auth logic
├── NotificationBell.tsx # Client Component - click handler
└── header.module.scss  # Styles with Tailwind @apply
```

**Benefits:**

- Better SSR performance
- Smaller client bundle
- Easy auth integration without affecting other components
- Better cache utilization

---

### 2. 🎨 Styling with SCSS Modules + Tailwind @apply

**Description:** Use SCSS modules combined with Tailwind's `@apply` directive for component styling.

**Rules:**

- Create `.module.scss` files for component-specific styles
- Use `@apply` to apply Tailwind utility classes
- Keep custom CSS (like gradients) alongside `@apply`
- Use responsive modifiers with `@media` queries
- Organize styles by component sections with comments

**Example:**

```scss
// header.module.scss

.header {
  @apply sticky top-0 z-[100] w-full h-16;
  @apply bg-black/95 backdrop-blur-xl;
  @apply border-b border-white/10;
}

.logo {
  @apply flex items-center gap-1.5;
  @apply no-underline flex-shrink-0;
}

.logoIcon {
  @apply flex items-center justify-center;
  @apply w-8 h-8 rounded-lg;
  @apply text-lg font-extrabold text-black;
  background: linear-gradient(135deg, #f5c518 0%, #e6b800 100%);
}

.button {
  @apply px-5 py-2.5 rounded-full;
  @apply text-sm font-semibold text-white;
  @apply transition-all duration-200 ease-out;

  &:hover {
    @apply -translate-y-0.5;
  }

  @media (max-width: 640px) {
    @apply px-3;

    span {
      @apply hidden;
    }
  }
}
```

**Usage in Component:**

```tsx
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>...</div>
    </header>
  );
}
```

**Benefits:**

- Consistent with Tailwind design tokens
- Scoped styles (no class name conflicts)
- Readable and organized
- Easy hover/responsive states with SCSS nesting
- Custom CSS when Tailwind isn't enough

---

### 3. 🔄 State Management

**Description:** Manage state with Redux Toolkit and Zustand.

**Rules:**

- **Redux Toolkit:** For complex global state (user, app-wide data)
- **Zustand:** For lightweight state, component-level or feature-specific
- Place Redux slices in `src/lib/redux/`
- Place Zustand stores in `src/lib/stores/`
- Keep state close to where it's used

---

### 4. 📝 Form Handling

**Description:** Handle forms with React Hook Form and Zod validation.

**Rules:**

- Use `react-hook-form` for form management
- Use `zod` for schema validation
- Integrate with `@hookform/resolvers` for validation

**Example:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

---

### 5. 🎬 Animation with Framer Motion

**Description:** Create smooth animations with Framer Motion.

**Rules:**

- Use `motion` components for animations
- Define `variants` for complex animations
- Use `AnimatePresence` for exit animations
- Keep animations in Client Components

---

### 6. ⚡ Cache Components (React 19 + Next.js)

**Description:** Leverage React 19's `cache` function and Next.js caching strategies for optimal performance.

**Rules:**

- Use `cache()` from React to deduplicate data fetching in Server Components
- Implement `unstable_cache` from Next.js for persistent caching
- Use `revalidatePath` and `revalidateTag` for cache invalidation
- Separate Client Components to avoid cache invalidation of static parts

**Example:**

```tsx
import { cache } from "react";

// Deduplicate requests within a single render pass
export const getMovie = cache(async (id: string) => {
  const res = await fetch(`/api/movies/${id}`);
  return res.json();
});

// Usage in Server Component
async function MovieDetails({ id }: { id: string }) {
  const movie = await getMovie(id);
  return <div>{movie.title}</div>;
}
```

**Next.js Cache Patterns:**

```tsx
import { unstable_cache } from "next/cache";

// Persistent cache with tags for invalidation
const getCachedMovies = unstable_cache(
  async () => {
    const res = await fetch("/api/movies");
    return res.json();
  },
  ["movies"], // cache key
  {
    revalidate: 3600, // revalidate every hour
    tags: ["movies"],
  },
);
```

**Component Caching Strategy:**

```tsx
// index.tsx (Server Component) - Cached
// ├── StaticPart.tsx (Server) - Cached with parent
// ├── DynamicPart.tsx (Client) - Not cached, hydrated
// └── AuthButton.tsx (Client) - Isolated, doesn't invalidate parent cache
```

---

### 7. 🌐 API Integration

**Description:** Integrate with backend APIs.

**Rules:**

- Place API calls in `src/api/`
- Use environment variables for API endpoints
- Handle errors consistently
- Leverage Server Components for data fetching when possible

---

## 🚀 Commands

```bash
# Development
pnpm dev          # Run dev server

# Build
pnpm build        # Build for production

# Start
pnpm start        # Start production server

# Lint
pnpm lint         # Run ESLint
```

---

## 📌 Best Practices

1. **TypeScript First:** Always use TypeScript, avoid `any`
2. **Server Components Default:** Start with Server Components, add `'use client'` only when needed
3. **Component Separation:** Split components to optimize caching and reduce client bundle
4. **Feature-Based Structure:** Use `index.tsx` + PascalCase child components pattern
5. **SCSS + @apply:** Use SCSS modules with Tailwind `@apply` for organized, scoped styles
6. **Cache Strategy:** Use React 19 `cache()` and Next.js caching for performance
7. **Accessibility:** Ensure a11y with proper ARIA labels
8. **Performance:** Use `next/image` for images, lazy loading when needed
9. **SEO:** Metadata in layout and page components

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Tailwind @apply](https://tailwindcss.com/docs/reusing-styles#extracting-classes-with-apply)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
