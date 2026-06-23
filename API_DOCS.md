# API Documentation

Base URL: `http://localhost:8080/api/v1`

---

## Events

### POST /events

Receive and store a tracking event from the client-side script.

**Request Body:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "page_view",
  "pageUrl": "https://demo.example.com/products",
  "timestamp": 1750672800000
}
```

For click events, include coordinates:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "click",
  "pageUrl": "https://demo.example.com/products",
  "timestamp": 1750672800000,
  "coordX": 340,
  "coordY": 512
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "667890abc123def456789012",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "eventType": "page_view",
    "pageUrl": "https://demo.example.com/products",
    "timestamp": "2026-06-23T04:00:00.000Z",
    "__v": 0
  }
}
```

**Error Response (400) -- Zod Validation Failure:**

```json
{
  "success": false,
  "message": {
    "issues": [
      {
        "code": "invalid_type",
        "expected": "string",
        "received": "undefined",
        "path": ["sessionId"],
        "message": "Required"
      }
    ]
  }
}
```

**Validation Rules (Zod):**

| Field       | Type                         | Required | Notes                                |
|-------------|------------------------------|----------|--------------------------------------|
| sessionId   | string                       | Yes      | Min length 1                         |
| eventType   | "page_view" or "click"       | Yes      | Enum, must be one of the two values  |
| pageUrl     | string (valid URL)           | Yes      | Must be a valid URL format           |
| timestamp   | number or date string        | No       | Auto-coerced to Date. Defaults to now|
| coordX      | number                       | No       | Only relevant for click events       |
| coordY      | number                       | No       | Only relevant for click events       |

---

### GET /events/heatmap?url={pageUrl}

Fetch all click coordinates for a specific page. Used to render the heatmap overlay in the dashboard.

**Query Parameters:**

| Param | Type   | Required | Description                       |
|-------|--------|----------|-----------------------------------|
| url   | string | Yes      | The page URL to get click data for|

**Example Request:**

```
GET /api/v1/events/heatmap?url=https://demo.example.com/products
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    { "coordX": 340, "coordY": 512, "timestamp": "2026-06-23T04:00:00.000Z" },
    { "coordX": 120, "coordY": 300, "timestamp": "2026-06-23T04:01:15.000Z" },
    { "coordX": 780, "coordY": 200, "timestamp": "2026-06-23T04:02:30.000Z" }
  ]
}
```

**Error Response (400) -- Missing URL:**

```json
{
  "success": false,
  "message": "URL parameter is required"
}
```

---

## Sessions

### GET /sessions

Fetch a list of all unique sessions with their total event counts. Results are sorted by most recently active session first.

**Example Request:**

```
GET /api/v1/sessions
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "550e8400-e29b-41d4-a716-446655440000",
      "eventCount": 14,
      "lastActive": "2026-06-23T04:05:00.000Z"
    },
    {
      "_id": "660f9500-f39c-52e5-b827-557766551111",
      "eventCount": 7,
      "lastActive": "2026-06-23T03:50:00.000Z"
    }
  ]
}
```

---

### GET /sessions/:sessionId/events

Fetch all events for a specific session, sorted chronologically (oldest first). This represents the user journey.

**Path Parameters:**

| Param     | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| sessionId | string | Yes      | The session UUID      |

**Example Request:**

```
GET /api/v1/sessions/550e8400-e29b-41d4-a716-446655440000/events
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "667890abc123def456789012",
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "eventType": "page_view",
      "pageUrl": "https://demo.example.com/",
      "timestamp": "2026-06-23T04:00:00.000Z"
    },
    {
      "_id": "667890abc123def456789013",
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "eventType": "click",
      "pageUrl": "https://demo.example.com/",
      "timestamp": "2026-06-23T04:00:05.000Z",
      "coordX": 340,
      "coordY": 512
    },
    {
      "_id": "667890abc123def456789014",
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "eventType": "page_view",
      "pageUrl": "https://demo.example.com/products",
      "timestamp": "2026-06-23T04:00:10.000Z"
    }
  ]
}
```

---

## Testing with cURL

### Create a page_view event

```bash
curl -X POST http://localhost:8080/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-001",
    "eventType": "page_view",
    "pageUrl": "https://demo.example.com/",
    "timestamp": 1750672800000
  }'
```

### Create a click event

```bash
curl -X POST http://localhost:8080/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-001",
    "eventType": "click",
    "pageUrl": "https://demo.example.com/",
    "timestamp": 1750672805000,
    "coordX": 340,
    "coordY": 512
  }'
```

### Fetch all sessions

```bash
curl http://localhost:8080/api/v1/sessions
```

### Fetch events for a session

```bash
curl http://localhost:8080/api/v1/sessions/test-session-001/events
```

### Fetch heatmap data

```bash
curl "http://localhost:8080/api/v1/events/heatmap?url=https://demo.example.com/"
```

---

## Testing with PowerShell (Windows)

### Create a page_view event

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/events" -Method POST -ContentType "application/json" -Body '{"sessionId":"test-session-001","eventType":"page_view","pageUrl":"https://demo.example.com/","timestamp":1750672800000}'
```

### Fetch all sessions

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/sessions" -Method GET
```

### Fetch heatmap data

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/v1/events/heatmap?url=https://demo.example.com/" -Method GET
```
