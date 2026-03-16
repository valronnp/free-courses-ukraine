# Free Courses Ukraine 🇺🇦

A polished, searchable directory of free online courses for people in Ukraine and the Ukrainian diaspora.

Built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**. Deployment-ready for Vercel.

---

## Features

- 🔍 **Live search** — filter by keyword across titles, descriptions, tags, and providers
- 🎛 **Multi-dimensional filters** — by category, language, level, and certificate availability
- 📱 **Fully responsive** — mobile-first design with collapsible filter panel
- 🇺🇦 **Ukraine-specific notes** — highlights special free access programs (e.g. Coursera Ukraine)
- ⚡ **Static generation** — all course pages are pre-rendered at build time
- 🎨 **DM Serif Display / DM Sans** typography with minimal editorial aesthetic

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Homepage with hero, stats, featured courses
│   ├── layout.tsx                # Root layout with Header + Footer
│   ├── not-found.tsx             # Custom 404 page
│   └── courses/
│       ├── layout.tsx            # Suspense wrapper for useSearchParams
│       ├── page.tsx              # Courses listing with search + filters
│       └── [slug]/
│           └── page.tsx          # Individual course detail page
├── components/
│   ├── Header.tsx                # Sticky nav header
│   ├── Footer.tsx                # Footer with category links
│   ├── CourseCard.tsx            # Card component used in listings
│   └── Filters.tsx               # Filter sidebar/panel (client)
├── lib/
│   └── courses.ts                # Mock data + search/filter helpers
└── tailwind.config.ts
```

---

## Adding Courses

Edit `lib/courses.ts` and add a new object to the `courses` array:

```ts
{
  slug: "your-course-slug",          // URL-safe, unique
  title: "Course Title",
  provider: "Provider Name",
  description: "Short description (1–2 sentences)",
  longDescription: "Full description shown on course page.",
  category: "Technology",            // Must match CATEGORIES list
  subcategory: "Web Development",
  language: "English",               // Must match LANGUAGES list
  duration: "4 weeks",
  level: "Beginner",                 // Beginner | Intermediate | Advanced
  format: "Video",                   // Video | Text | Interactive | Mixed
  certificate: true,
  url: "https://...",
  tags: ["React", "JavaScript"],
  rating: 4.7,
  students: 50000,
  updatedAt: "2024-01",
  featured: false,
  ukraineNote: "Optional note about Ukraine-specific access",
}
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deployments on push.

No environment variables required — all data is local.

---

## Customisation

- **Colors**: Edit `tailwind.config.ts` — the `ukraine` and `accent` tokens drive the palette
- **Fonts**: Swap the Google Fonts import in `app/globals.css`
- **Categories**: Update the `CATEGORIES` array in `lib/courses.ts`

---

## License

MIT — free to use, modify, and deploy.
