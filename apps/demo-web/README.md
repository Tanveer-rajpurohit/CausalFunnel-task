# Demo Web

A demo webpage used to generate tracking data for the analytics pipeline. The browser tracker script is injected into the page via the Next.js layout.

---

## How the Tracker Is Loaded

A `TrackerScript` client component loads `/tracker.js` using `next/script` with `strategy="afterInteractive"`. Once the script has loaded, it calls `window.initTracker({ backendUrl })` to start capturing events.

The `tracker.js` file itself is not authored in this app. It is built in `packages/tracker` and copied into `public/tracker.js` during the tracker build step (via a postbuild script).

---

## Environment Variables

| Variable                | Example                  | Description                        |
|-------------------------|--------------------------|------------------------------------|
| NEXT_PUBLIC_BACKEND_URL | http://localhost:8080    | Base URL of the backend API        |

---

## Run Locally

From the monorepo root (runs on port 3001):

```bash
pnpm run dev
```

Make sure the tracker has been built first so that `public/tracker.js` exists:

```bash
cd packages/tracker
pnpm build
```

---

## Deploy

Deployed on **Vercel**.

1. Connect the repository to Vercel and set the root directory to `apps/demo-web`.
2. Set the `NEXT_PUBLIC_BACKEND_URL` environment variable to the production backend URL (e.g., `YOUR_RAILWAY_URL`).

Production URL: `YOUR_VERCEL_URL`
