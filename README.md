# Student Performance Prediction System

A simple web app to manage student records, predict academic outcomes, and visualize performance metrics.

## Features

- **Student Management** – Add, view, search, and delete student records
- **Performance Prediction** – Predict pass/fail based on attendance, internal marks, and assignment marks
- **Analytics Dashboard** – View student performance with charts and statistics
- **Authentication** – Secure login with email/password and Google OAuth
- **Responsive Design** – Works on desktop, tablet, and mobile

## Tech Stack

- **Framework:** TanStack Start with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State Management:** TanStack Query
- **Backend & Auth:** Lovable Cloud (Supabase)
- **Charts:** Recharts
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Bun](https://bun.sh/)
- Lovable Cloud project credentials (`.env` file)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Add environment variables

   Create a `.env` file in the project root:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

   > Keep `.env` private. It is already listed in `.gitignore`.

### Run Locally

```bash
bun dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── integrations/        # Lovable Cloud / Supabase integration
├── lib/                 # Utilities and business logic
├── routes/              # TanStack file-based routes
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Landing page
│   ├── login.tsx        # Login page
│   └── _authenticated/  # Protected routes
├── router.tsx           # Router configuration
├── start.ts             # TanStack Start config
└── styles.css           # Global styles
```

## Prediction Formula

```
Score = (Attendance × 0.35)
      + ((Internal / 30) × 100 × 0.45)
      + ((Assignment / 20) × 100 × 0.20)
```

- **Pass:** Score ≥ 55
- **Confidence:** Based on the score, capped between 50% and 99%

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start the development server |
| `bun build` | Build for production |
| `bun preview` | Preview the production build |
| `bun lint` | Run ESLint |
| `bun format` | Format code with Prettier |

## Deployment

### Option 1: Lovable (Recommended)

Connect your GitHub repo to Lovable. Changes pushed to GitHub will sync and deploy automatically.

### Option 2: Self-Hosting

Build the project and deploy the `dist/` folder to any static host.

```bash
bun build
```

Make sure the same Supabase environment variables are set on your hosting platform.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public API key |

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request

## License

This project is open-source under the [MIT License](LICENSE).

---

Built with [Lovable](https://lovable.dev)
