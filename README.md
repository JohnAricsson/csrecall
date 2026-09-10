# CSRecall

CSRecall is an interactive computer science interview preparation platform. It helps users rapidly review core concepts, data structures, and algorithms while actively practicing with flashcards and interview "traps" (common mistakes and tricky questions).

## Features

- **12 Arcade-Style Levels**: Progressive chapters from fundamentals to system design.
- **Interactive Flashcards**: Over 200+ memory cards to drill definitions and core concepts.
- **Trap Defusal Arena**: 60+ common interview traps and gotchas to master.
- **Progress Tracking**: Level up, earn XP, unlock achievements, and build streaks.
- **Bilingual Hybrid UI**: English technical content with Bengali micro-copy for better local accessibility.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth.js
- **State Management**: Zustand
- **Validation**: Zod

## Getting Started

1. Copy `.env.example` to `.env.local` and configure the required keys.
2. Run `npm install`
3. Run `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

- `/src/data/chapters/` - Core educational JSON data. (Immutable architecture)
- `/src/components/` - React components including chapter arenas, learning modes, and dashboards.
- `/src/app/` - Next.js routes and API endpoints.

## Contributing

This project relies on immutable JSON chapter structures. Please avoid modifying `/src/data/chapters/` directly unless necessary for content updates.
