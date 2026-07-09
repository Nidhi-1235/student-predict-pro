# Student Performance Prediction System (SPPS)

A modern web application for managing student records, predicting academic outcomes, and visualizing performance metrics. Built with TanStack Start, React, TypeScript, Tailwind CSS, and Lovable Cloud (Supabase).

![Tech Stack](https://img.shields.io/badge/TanStack%20Start-React%2019-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4.2-38B2AC)
![Supabase](https://img.shields.io/badge/Backend-Lovable%20Cloud-green)

## Features

- **Student Management**: Add, view, search, and delete student records
- **Performance Prediction**: Predict pass/fail outcomes based on attendance, internal marks, and assignment marks
- **Analytics Dashboard**: Visualize student performance with charts and statistics
- **Authentication**: Secure login with email/password and Google OAuth
- **Mobile-First Design**: Responsive, card-based UI optimized for all screen sizes
- **Real-time Sync**: Data persists in Lovable Cloud database

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19 + Vite 8)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.2 + shadcn/ui components
- **State Management**: TanStack Query 5
- **Backend/Auth**: Lovable Cloud (Supabase)
- **Routing**: TanStack Router (file-based)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Package Manager**: Bun

## Prerequisites

Before running this project locally, make sure you have:

- [Node.js](https://nodejs.org/) 18+ installed
- [Bun](https://bun.sh/) installed (`npm install -g bun`)
- A Lovable Cloud project with Supabase connected
- Your `.env` file from Lovable (contains backend credentials)

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the project root and add your Lovable Cloud credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

   > ⚠️ **Important**: Never commit `.env` to GitHub. It is already added to `.gitignore` by default.

## Running Locally

Start the development server:

```bash
bun dev
```

The app will be available at: [http://localhost:8080](http://localhost:8080)

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start the development server |
| `bun build` | Build for production |
| `bun build:dev` | Build in development mode |
| `bun preview` | Preview the production build |
| `bun lint` | Run ESLint |
| `bun format` | Format code with Prettier |

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components (shadcn/ui + custom)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Lovable Cloud / Supabase integration
│   ├── lib/               # Utility functions, store, business logic
│   ├── routes/            # TanStack file-based routes
│   │   ├── __root.tsx     # Root layout
│   │   ├── index.tsx      # Splash screen
│   │   ├── login.tsx      # Authentication page
│   │   └── _authenticated/# Protected routes
│   │       ├── dashboard.tsx
│   │       ├── add-student.tsx
│   │       ├── students.tsx
│   │       ├── predict.tsx
│   │       ├── analytics.tsx
│   │       └── profile.tsx
│   ├── router.tsx         # Router configuration
│   ├── start.ts           # TanStack Start server config
│   └── styles.css         # Global styles & design tokens
├── supabase/              # Supabase configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Authentication

The app uses Lovable Cloud authentication:

- **Email/Password**: Sign up and sign in with email verification
- **Google OAuth**: One-click sign-in with Google

Protected routes are wrapped under `/_authenticated` and redirect unauthenticated users to `/login`.

## Prediction Formula

The prediction score is calculated as:

```
Score = (Attendance × 0.35) + ((Internal / 30) × 100 × 0.45) + ((Assignment / 20) × 100 × 0.20)
```

- **Pass**: Score ≥ 55
- **Confidence**: Derived from the score, capped between 50% and 99%

## Deployment

### Option 1: Lovable (Recommended)

Push changes to your connected GitHub repo and Lovable will automatically sync and deploy.

### Option 2: Self-Hosting

Build the project and deploy the `dist/` folder to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

```bash
bun build
```

> Note: If self-hosting, configure the same Supabase environment variables in your hosting platform.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public API key |

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Built with ❤️ using [Lovable](https://lovable.dev)
