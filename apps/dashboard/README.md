# Dashboard

Next.js 16 application that displays analytics data from the backend API.

---

## Views

### Sessions View

A table listing all tracked sessions. Each row shows the session ID and its event count. Clicking a session row expands it to reveal the ordered list of events, showing the full user journey through the site.

### Heatmap View

Provides a dropdown to select a page URL. Once selected, click positions are rendered as dots on a scaled overlay, visualizing where users clicked on that page.

---

## Environment Variables

| Variable                | Example                  | Description                        |
|-------------------------|--------------------------|------------------------------------|
| NEXT_PUBLIC_BACKEND_URL | http://localhost:8080    | Base URL of the backend API        |

---

## Run Locally

Option 1 -- from the monorepo root (runs on port 3000):

```bash
pnpm run dev
```

Option 2 -- directly from the dashboard directory:

```bash
cd apps/dashboard
pnpm dev
```

The dashboard starts on `http://localhost:3000`.

---

## Deploy

Deployed on **Vercel**.

1. Connect the repository to Vercel and set the root directory to `apps/dashboard`.
2. Set the `NEXT_PUBLIC_BACKEND_URL` environment variable to the production backend URL (e.g., `YOUR_RAILWAY_URL`).

Production URL: `YOUR_VERCEL_URL`
