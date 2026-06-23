# CausalFunnel -- User Analytics Application

## What This Is

CausalFunnel helps e-commerce businesses understand user behavior through session tracking and analytics. This project is a working implementation of that idea: a lightweight JavaScript tracker captures page views and clicks on any webpage, sends the data to a backend API, and a dashboard visualizes everything in real time.

---

## What It Does

### Event Tracking (Client Side)

A standalone JavaScript tracking script (`packages/tracker`) can be embedded in any webpage with a single `<script>` tag. It works exactly like Google Analytics or Mixpanel -- the website owner drops the script into their page and it starts collecting data automatically.

The tracker captures two types of events:

- **page_view** -- Fired once when the tracker initializes. Records the page URL and a timestamp.
- **click** -- Fired on every mouse click. Records the page URL, timestamp, and the exact X/Y coordinates of the click.

Each event is tied to a **session**. The session ID is generated using `crypto.randomUUID()` and stored in a browser cookie that expires when the tab closes. This means a returning user who closed and reopened their browser gets a new session, which is consistent with how most analytics platforms define sessions.

Events are sent to the backend using `navigator.sendBeacon`, which reliably delivers data even when the user closes the tab or navigates away. A `fetch` fallback is included for older browsers.

### Backend API

A Node.js + Express API (`apps/backend`) receives tracking events and stores them in MongoDB. It exposes four endpoints:

| Method | Path                           | Purpose                                                      |
|--------|--------------------------------|--------------------------------------------------------------|
| POST   | /api/v1/events                 | Receive and store an event from the tracker                  |
| GET    | /api/v1/events/heatmap?url=    | Return click coordinates for a specific page (for heatmap)   |
| GET    | /api/v1/sessions               | List all sessions with event counts and pagination           |
| GET    | /api/v1/sessions/:id/events    | Return all events for a session in chronological order       |
| GET    | /api/v1/pages                  | Return distinct tracked page paths for dropdown filters      |

Incoming events are validated using **Zod** before being saved to MongoDB. The Zod schema serves as the single source of truth for both TypeScript types and runtime validation, so they can never fall out of sync.

Full API documentation with request/response examples and test commands is in [API_DOCS.md](./API_DOCS.md).

### Dashboard

A Next.js dashboard (`apps/dashboard`) provides two views:

- **Sessions View** -- A table listing every tracked session with its total event count and last active timestamp. Clicking a session expands it to show the full ordered list of events, representing the user's journey through the website.
- **Heatmap View** -- A dropdown to select a tracked page URL. Once selected, click positions are rendered as dots on an overlay, visualizing where users are clicking on the page.

### Demo Page

A Next.js demo page (`apps/demo-web`) serves as a test website with the tracker already embedded. Open it in a browser, click around, and the events appear in the dashboard immediately.

---

## Tech Stack

| Layer          | Technology                          | Why                                                         |
|----------------|-------------------------------------|-------------------------------------------------------------|
| Monorepo       | Turborepo + pnpm workspaces         | Shared configs, single install, parallel dev across all apps |
| Backend        | Node.js, Express, TypeScript        | Assignment requirement. TypeScript adds type safety          |
| Database       | MongoDB (Atlas)                     | Assignment requirement. Document model fits event data well  |
| Validation     | Zod                                 | Single source of truth for types and runtime validation      |
| Dashboard      | Next.js 16, React, TypeScript       | Assignment requirement (React/Next.js)                       |
| Tracker Script | TypeScript, esbuild (IIFE bundle)   | Framework-agnostic output, works with any website            |
| Styling        | Tailwind CSS v4                     | Rapid UI development with consistent design tokens           |

---

## Repository Structure

```
CausalFunnel-task/
├── apps/
│   ├── backend/           Express API -- receives events, serves analytics data
│   ├── dashboard/         Next.js -- sessions table, heatmap visualization
│   └── demo-web/          Next.js -- test page with tracker script embedded
├── packages/
│   ├── tracker/           Browser tracking script (standalone IIFE bundle)
│   ├── ui/                Shared React component library
│   ├── tailwind-config/   Shared Tailwind CSS configuration
│   ├── typescript-config/  Shared TypeScript configuration
│   └── eslint-config/     Shared ESLint rules
├── API_DOCS.md            Full API documentation with test commands
├── turbo.json             Turborepo pipeline configuration
└── pnpm-workspace.yaml    Workspace definition
```

---

## Database Design

All events are stored in a single `events` collection. Each document has the following shape:

| Field     | Type                     | Notes                                    |
|-----------|--------------------------|------------------------------------------|
| sessionId | String                   | Indexed. Groups events by user session   |
| eventType | String (enum)            | `"page_view"` or `"click"`               |
| pageUrl   | String                   | The full URL of the page                 |
| timestamp | Date                     | When the event occurred                  |
| coordX    | Number (optional)        | Click X coordinate. Only for click events|
| coordY    | Number (optional)        | Click Y coordinate. Only for click events|

Two compound indexes are defined for query performance:

- `{ sessionId: 1, timestamp: -1 }` -- Used when fetching a session's events in chronological order.
- `{ pageUrl: 1, eventType: 1 }` -- Used when fetching click data for the heatmap.

A single flat collection was chosen over separate collections for different event types because the assignment requires fetching all events for a session as a single ordered list (user journey). Splitting events across collections would require querying multiple collections and merging results in application code.

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- pnpm 10 or later (`npm install -g pnpm`)
- A MongoDB connection string (Atlas or local)

### 1. Clone and install

```bash
git clone YOUR_GITHUB_URL
cd CausalFunnel-task
pnpm install
```

### 2. Build the tracker

```bash
pnpm --filter tracker build
```

This bundles the tracker script into a single IIFE file at `packages/tracker/dist/tracker.js`. A `postbuild` script then automatically copies it to `apps/demo-web/public/tracker.js` so the demo page can load it via a `<script>` tag.

If you ever modify the tracker source, just run this command again and the demo page picks up the changes.

### 3. Set up environment variables

**apps/backend/.env**

```
PORT=8080
MONGODB_URI=your_mongodb_connection_string
```

**apps/dashboard/.env.local**

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

**apps/demo-web/.env.local**

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### 4. Start everything

```bash
pnpm run dev
```

| App       | URL                      |
|-----------|--------------------------|
| Dashboard | http://localhost:3000     |
| Demo Web  | http://localhost:3001     |
| Backend   | http://localhost:8080     |

Open `http://localhost:3001` to generate tracking events. View them at `http://localhost:3000`.

---

## Deployment (AWS EC2 -- Self-Hosted)

All three services run on a single **t2.micro** EC2 instance (AWS Free Tier).

### Build for Production

```bash
# Build the tracker (output goes to demo-web/public/tracker.js via postbuild)
pnpm --filter tracker build

# Build the dashboard
pnpm --filter dashboard build

# Build the demo web
pnpm --filter demo-web build
```

### Run in Production

Install [PM2](https://pm2.keymetrics.io/) as a process manager:

```bash
npm install -g pm2
```

Start all services:

```bash
pm2 start "pnpm --filter backend run dev" --name backend
pm2 start "pnpm --filter dashboard run start" --name dashboard
pm2 start "pnpm --filter demo-web run start -- -p 3001" --name demo-web
pm2 save
```

### Environment Variables

| App        | Variable                 | Value                           |
|------------|--------------------------|----------------------------------|
| Backend    | `MONGODB_URI`            | MongoDB Atlas connection string |
| Backend    | `PORT`                   | `8080`                          |
| Dashboard  | `NEXT_PUBLIC_BACKEND_URL`| `http://YOUR_SERVER_IP:8080`    |
| Demo Web   | `NEXT_PUBLIC_BACKEND_URL`| `http://YOUR_SERVER_IP:8080`    |

| Service   | Port | URL                        |
|-----------|------|----------------------------|
| Backend   | 8080 | `http://YOUR_IP:8080`      |
| Dashboard | 3000 | `http://YOUR_IP:3000`      |
| Demo Web  | 3001 | `http://YOUR_IP:3001`      |

---

## Assumptions and Trade-offs

- **Single collection for all events.** Compound indexes ensure query performance even at scale. If event volume reached billions, the next optimization would be MongoDB Time Series Collections or the Bucket Pattern.
- **sendBeacon over fetch.** Analytics data must not be lost when a user closes a tab. `sendBeacon` handles this reliably. A `fetch` fallback covers older browsers.
- **Session cookies without max-age.** Closing the browser starts a new session. This is a deliberate design choice consistent with how most analytics platforms define a session.
- **Framework-agnostic tracker.** The tracker is bundled as a standalone IIFE and loaded via a `<script>` tag. Any website can use it, regardless of framework. This mirrors how production analytics SDKs like Google Analytics are distributed.
- **Zod for validation.** The Zod schema is the single source of truth. TypeScript types are inferred from it using `z.infer`, eliminating the risk of type definitions and validation logic drifting apart.
- **Turborepo monorepo.** Keeps the tracker, backend, dashboard, and demo page in one repository with shared configurations. A single `pnpm install` and `pnpm run dev` starts everything.
