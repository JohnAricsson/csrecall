# ⚡ CSRecall — Computer Science Interview Arcade

CSRecall is an interactive, zero-fluff Computer Science interview revision and practice arena designed for students, freshers, and software developers. Built with a high-contrast Neo-Brutalist arcade aesthetic and bilingual (English technical content + Bengali micro-copy) support, CSRecall turns dry technical prep into an engaging revision experience.

---

## 🚀 Key Features

- **12 Progressive Chapters**: Comprehensive coverage ranging from Foundations (DSA, OOP) to Core Engineering (Databases, OS, Networking) and Systems & Defense (System Design, Security, Microservices).
- **Three Arcade Learning Modes**:
  - **Learn Mode**: High-yield conceptual explanations, syntax-highlighted code blocks, comparison tables, and quick Bengali TL;DR summaries.
  - **Practice Mode**: 3D tap-to-flip rapid revision flashcard decks.
  - **Traps Mode**: Gotchas, tricky edge cases, and common interview mistakes to defuse.
- **Player Progression & Trophies**: Earn XP (+10 per topic, +15-20 per trap, +100 per chapter), unlock trophies, track consistency streaks, and persist progress via MongoDB.
- **Secure Authentication & Cloud Sync**: NextAuth.js v5 supporting Credentials and Google OAuth, plus cryptographically secure password reset flow via Resend email dispatch.
- **Guest Play & Member Access**: Chapters 1 & 2 are open to guests; full access unlocks on free registration.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) (Optimistic client store with debounced server synchronization)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (JWT strategy, bcryptjs)
- **Email Service**: [Resend](https://resend.com/)
- **Schema Validation**: [Zod](https://zod.dev/)
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert`)

---

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js 20+ installed
- MongoDB instance (local or MongoDB Atlas cluster)

### 2. Clone and Install

```bash
git clone https://github.com/JohnAricsson/csrecall.git
cd csrecall
npm install
```

### 3. Configure Environment Variables

Copy the template file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials in `.env.local`:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/csrecall?retryWrites=true&w=majority

# NextAuth Configuration
AUTH_SECRET=your_super_secret_min_32_characters_here
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Resend Email Dispatch (Password Reset)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=CSRecall <onboarding@resend.dev>
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script          | Command                           | Purpose                                            |
| :-------------- | :-------------------------------- | :------------------------------------------------- |
| `npm run dev`   | `next dev`                        | Launches local development server                  |
| `npm run build` | `next build`                      | Compiles optimized production build with Turbopack |
| `npm run start` | `next start`                      | Runs compiled production build                     |
| `npm run lint`  | `eslint`                          | Runs ESLint across the codebase                    |
| `npm run test`  | `node --test tests/**/*.test.mjs` | Runs automated unit test suite                     |

---

## 📁 Project Structure

```text
csrecall/
├── public/                 # Static assets and icons
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes (auth, user progress, reset)
│   │   ├── chapter/[id]/   # Dynamic chapter arena pages
│   │   ├── login/          # Auth sign-in & registration
│   │   ├── profile/        # Player profile, stats & trophies
│   │   ├── reset-password/ # Dedicated password reset page
│   │   ├── layout.tsx      # Root layout shell
│   │   └── page.tsx        # Dashboard home & Quest Map
│   ├── components/
│   │   ├── auth/           # ForgotPasswordModal & auth UI
│   │   ├── chapter/        # ChapterArena, LearnMode, PracticeMode, TrapsMode
│   │   ├── dashboard/      # HeroSection, NextMoveWidget, QuestMap
│   │   ├── shell/          # Navbar, Footer, StoreHydrator, Providers
│   │   └── ui/             # Neo-brutalist buttons, badges, cards, progress bars
│   ├── data/
│   │   └── chapters/       # 12 educational chapter JSON files (Immutable data)
│   ├── hooks/              # Custom React hooks (hydration)
│   ├── lib/                # Database connection, schemas, topic utilities
│   ├── models/             # Mongoose User model
│   ├── stores/             # Zustand game progress store
│   ├── auth.ts             # NextAuth configuration
│   └── proxy.ts            # Next.js 16 route proxy (middleware)
├── tests/                  # Automated unit tests
└── package.json
```

---

## 🛡️ Architecture & Guardrails

- **Immutable Data Core**: Chapter curricula in `src/data/chapters/` are strictly validated via Zod schemas and loaded with React `cache()`.
- **Zero Client Secret Leaks**: All credential validation, bcrypt hashing (12 rounds), and password reset tokens are handled server-side in API routes.
- **Graceful Error Handling**: API endpoints sanitize error output to prevent internal database detail disclosure in production.

---

## 📄 License

MIT © 2026 CSRecall. Developed for CS Students & Freshers.
