# Backend API

Node.js + Express + TypeScript API that receives tracking events from the browser tracker and serves analytics data to the dashboard.

---

## API

Base path: `/api/v1`

### POST /events

Receives and stores a single tracking event.

**Request body** (validated with Zod):

| Field       | Type   | Required | Notes                              |
|-------------|--------|----------|------------------------------------|
| sessionId   | string | yes      |                                    |
| eventType   | string | yes      | `page_view` or `click`             |
| pageUrl     | string | yes      |                                    |
| timestamp   | string | yes      | ISO 8601                           |
| coordX      | number | no       | Present on `click` events          |
| coordY      | number | no       | Present on `click` events          |

**Response:** `201 Created` with the saved event document.

### GET /events/heatmap?url={pageUrl}

Returns click coordinates for a specific page URL.

**Query parameters:**

| Param | Required | Description                |
|-------|----------|----------------------------|
| url   | yes      | The page URL to filter by  |

**Response:** Array of objects containing `coordX`, `coordY`, and `timestamp`.

### GET /sessions

Returns all sessions with aggregated metadata. Uses MongoDB aggregation (`$group`, `$sort`) to compute event counts and the last active timestamp for each session.

**Response:** Array of session objects, each with session ID, event count, and last active time.

### GET /sessions/:sessionId/events

Returns every event belonging to a session, sorted chronologically by timestamp.

**Response:** Array of event documents.

---

## MongoDB Schema

Collection: `events`

| Field      | Type   | Notes                          |
|------------|--------|--------------------------------|
| sessionId  | String | Indexed                        |
| eventType  | String | Enum: `page_view`, `click`     |
| pageUrl    | String |                                |
| timestamp  | Date   |                                |
| coordX     | Number | Optional                       |
| coordY     | Number | Optional                       |

**Indexes:**

- Compound index on `{ sessionId, timestamp }`
- Compound index on `{ pageUrl, eventType }`

---

## Environment Variables

| Variable    | Default | Description                        |
|-------------|---------|------------------------------------|
| PORT        | 8080    | Port the server listens on         |
| MONGODB_URI | --      | MongoDB connection string          |

---

## Run Locally

From the monorepo root:

```bash
pnpm install
```

Then start the backend in development mode (uses nodemon + ts-node):

```bash
cd apps/backend
pnpm run dev
```

The server starts on `http://localhost:8080`.

---

## Deploy

Deployed on **Railway**.

1. Connect the repository to Railway.
2. Set the `MONGODB_URI` environment variable to your MongoDB Atlas connection string.
3. Railway auto-detects the start command and deploys.

Production URL: `YOUR_RAILWAY_URL`
