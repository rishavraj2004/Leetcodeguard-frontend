Test

# LeetCode Streak Guard — Frontend

Frontend for [LeetCode Streak Guard](https://leetcode-guard.onrender.com), a service that tracks your daily LeetCode activity and sends Telegram reminders before your streak breaks.

Built with React 18 + Vite. No UI library, no component framework — just CSS and a few small components.

---

## What it does

- Landing page explaining what the service does and how to set it up
- Registration form to connect a LeetCode username with a Telegram Chat ID
- Full-page success state after registration with next steps
- 404 page for unmatched routes

---

## Tech stack

| Tool         | Version | Purpose                |
| ------------ | ------- | ---------------------- |
| React        | 18.3    | UI                     |
| React Router | 6       | Client-side routing    |
| Vite         | 5       | Dev server and bundler |
| ESLint       | 9       | Linting                |

No Axios. No UI library. Native `fetch` for API calls.

---

## Project structure

```
src/
├── api/
│   └── register.js       # fetch wrapper + ApiError class
├── components/
│   └── Navbar.jsx        # sticky nav with active-link detection
├── hooks/
│   └── useRegister.js    # form state, validation, submission logic
├── pages/
│   ├── HomePage.jsx      # landing page
│   ├── RegisterPage.jsx  # registration form + full-page success state
│   └── NotFoundPage.jsx  # 404
├── App.jsx               # router + layout shell
├── App.css               # all component styles
├── index.css             # design tokens + global reset
└── main.jsx              # entry point
```

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repo
git clone https://github.com/your-username/leetcode-streak-guard-frontend.git
cd leetcode-streak-guard-frontend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local if you're running the backend locally

# 4. Start dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Environment variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=https://leetcode-guard.onrender.com
```

| Variable       | Description                 | Default                               |
| -------------- | --------------------------- | ------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API | `https://leetcode-guard.onrender.com` |

If `VITE_API_URL` is not set, the app falls back to the production URL.

---

## Available scripts

```bash
npm run dev      # start development server with HMR
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

---

## Pages and routes

| Route       | Component      | Description                      |
| ----------- | -------------- | -------------------------------- |
| `/`         | `HomePage`     | Landing — features, how it works |
| `/register` | `RegisterPage` | Registration form                |
| `*`         | `NotFoundPage` | 404 fallback                     |

---

## Form validation

Validation runs client-side before any API call is made. Both fields are checked on submit; errors clear individually as the user edits.

| Field             | Rules                                                              |
| ----------------- | ------------------------------------------------------------------ |
| LeetCode username | Required. Alphanumeric + `_` `-`, 3–25 characters.                 |
| Telegram Chat ID  | Required. Must be a numeric string (positive or negative integer). |

API errors are caught and mapped to safe user-facing copy by HTTP status code — no raw backend messages are shown.

## Deployment

The app is a standard Vite SPA. Build and serve the `dist/` folder from any static host.

```bash
npm run build
# deploy dist/ to Vercel, Netlify, Render static site, or any CDN
```

**Netlify**

Add a `netlify.toml` for SPA redirect support:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Backend

This frontend talks to a separate Node.js / Express backend. See the backend repo for API docs, cron job setup, and Telegram bot configuration.

Backend endpoint used by this frontend:

```
POST /api/register
Content-Type: application/json

{ "leetcodeUsername": "string", "telegramChatId": "string" }
```

---

##Author
Rishav Raj
