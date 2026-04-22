# Rishabh Shah Portfolio

High-performance personal portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

The site showcases:

- Projects (with impact, architecture notes, and metrics)
- Publications and research
- Experience, skills, and education
- Interactive UI elements (custom cursor, animated dock, assistant panel)
- SEO-first metadata and structured data output

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Vercel Analytics + Speed Insights

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

Open http://localhost:3000.

## Scripts

```bash
npm run dev      # Start local dev server (Turbopack)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

## Environment Variables

Create a `.env.local` file if you want to override the canonical site URL used for SEO metadata and structured data.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If not set, the app falls back to `VERCEL_URL` (on Vercel) and then a hardcoded default.

## Project Structure

```text
src/
	app/                  # App Router entrypoints, metadata, sitemap/robots/manifest
	components/
		sections/           # Page sections (Hero, Projects, Publications, etc.)
		ui/                 # Shared UI building blocks
		assistant/          # Local portfolio assistant logic and responses
	data/
		index.ts            # Primary portfolio content source
	lib/
		site.ts             # Site URL and metadata helpers
		structured-data.ts  # JSON-LD generation
```

## Content Editing Guide

Most content updates happen in one place:

- `src/data/index.ts`

Update these exported objects/arrays to keep the site fresh:

- `bio`
- `projects`
- `publications`
- `experience`
- `skills`
- `education`

## SEO and Metadata

Key SEO configuration lives in:

- `src/app/layout.tsx` (metadata, Open Graph, Twitter cards)
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/structured-data.ts` (JSON-LD graph)

The app automatically sanitizes metadata strings for consistent social/search previews.

## Deployment

Recommended target: Vercel.

1. Import repository into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` in project environment variables.
3. Deploy.

For non-Vercel hosting:

```bash
npm run build
npm run start
```

## Notes for Next.js 16

This repository is aligned to Next.js 16 behavior (including Turbopack defaults and ESLint CLI usage). If you add new server-side request logic, follow Next.js 16 async request API conventions.
