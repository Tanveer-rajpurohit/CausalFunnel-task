# CausalFunnel Analytics API Documentation

Welcome to the CausalFunnel Analytics API. This document details the RESTful endpoints available to track user interactions and retrieve analytical data for our dashboard.

**Base URL:** `http://localhost:8080/api/v1`

---

## 1. Events Tracking

### POST /events
Receives and stores a tracking event from the client-side script.

**Request Body:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "page_view", // or "click"
  "pageUrl": "https://demo.example.com/products",
  "timestamp": 1750672800000,
  "coordX": 340, // Required only if eventType is "click"
  "coordY": 512  // Required only if eventType is "click"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { ...savedEventObject }
}
```

---

## 2. Sessions Management

### GET /sessions
Fetches an aggregated list of user sessions, including their total event counts and last active timestamps. Supports robust sorting and pagination.

**Query Parameters:**
| Param    | Type   | Required | Description                                       |
|----------|--------|----------|---------------------------------------------------|
| `sortBy` | string | No       | Field to sort by: `eventCount` or `lastActive`. Defaults to `lastActive`. |
| `order`  | string | No       | Sort direction: `asc` or `desc`. Defaults to `desc`.     |
| `limit`  | number | No       | Rows per page. Defaults to 10.                    |
| `page`   | number | No       | Current page number. Defaults to 1.               |

**Example Request:**
`GET /api/v1/sessions?sortBy=eventCount&order=desc&limit=25&page=1`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "550e8400-e29b-41d4-a716-446655440000",
      "eventCount": 42,
      "lastActive": "2026-06-23T12:00:00.000Z"
    }
  ],
  "meta": {
    "totalRecords": 1560,
    "totalPages": 63,
    "currentPage": 1
  }
}
```

---

## 3. User Journey (Timeline)

### GET /sessions/:sessionId/events
Fetches the chronological timeline of events for a specific session. Used to render the User Journey view.

**Path Parameters:**
| Param       | Type   | Required | Description           |
|-------------|--------|----------|-----------------------|
| `sessionId` | string | Yes      | The session UUID      |

**Query Parameters:**
| Param  | Type   | Required | Description                                               |
|--------|--------|----------|-----------------------------------------------------------|
| `type` | string | No       | Filter by event type: `page_view` or `click`. If omitted, returns all events. |

**Example Request:**
`GET /api/v1/sessions/550e8400.../events?type=click`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2026-06-23T12:05:00.000Z",
      "eventType": "click",
      "pageUrl": "/about",
      "coordX": 1044,
      "coordY": 42
    }
  ]
}
```

---

## 4. Heatmap Visualizations

### GET /heatmap
A unified API endpoint for fetching aggregated click coordinate data. This powers both the local session heatmaps and the global aggregate heatmaps.

**Query Parameters:**
| Param       | Type   | Required | Description                                       |
|-------------|--------|----------|---------------------------------------------------|
| `url`       | string | Yes      | The page path to retrieve click data for (e.g., `/products`). Automatically matches against full database URLs. |
| `sessionId` | string | No       | If provided, returns clicks ONLY for this session (Local Heatmap). If omitted, aggregates clicks across ALL sessions (Global Heatmap). |

**Example Request:**
`GET /api/v1/heatmap?url=/products`

**Success Response (200):**
*Note: The backend intelligently groups identical coordinates to reduce payload size. The frontend handles visual grid mapping.*
```json
{
  "success": true,
  "data": [
    { "x": 1044, "y": 42, "clicks": 5 },
    { "x": 500, "y": 300, "clicks": 12 }
  ]
}
```

---

## 5. Dynamic Page Filters

### GET /pages
Fetches a distinct list of all unique URL paths (e.g. `/`, `/about`) that have been tracked in the database, automatically extracting them from full URLs. Used to populate frontend URL dropdowns dynamically.

**Example Request:**
`GET /api/v1/pages`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    "/",
    "/about",
    "/products"
  ]
}
```
