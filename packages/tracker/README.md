# Tracker

A standalone browser tracking script that captures `page_view` and `click` events and sends them to a backend API. Framework-agnostic -- works with plain HTML, React, Next.js, or any web page that can load a script tag.

---

## How It Works

1. **Session management** -- Generates a session ID using `crypto.randomUUID()` and stores it in a session cookie named `cf_session`. The cookie has no `max-age`, so it is destroyed when the browser closes.
2. **Page view** -- On init, the tracker immediately fires a `page_view` event for the current page.
3. **Click tracking** -- Registers a `click` listener on `document`. Each click fires a `click` event containing the `clientX` and `clientY` coordinates.
4. **Event delivery** -- Events are sent using `navigator.sendBeacon` (preferred) with a `fetch` fallback. `sendBeacon` is reliable even when the user is closing the tab or navigating away.
5. **Configuration** -- The `backendUrl` is passed in by the host application at init time. Nothing is hardcoded.

---

## Build

From the monorepo root:

```bash
pnpm --filter tracker build
```

Or from the package directory:

```bash
cd packages/tracker
pnpm build
```

This does two things:

1. **Build** -- Uses esbuild to bundle the TypeScript source into a single IIFE file at `dist/tracker.js`.
2. **Postbuild** -- Automatically copies `dist/tracker.js` to `apps/demo-web/public/tracker.js` so the demo page can serve it.

If the automatic copy fails (e.g., different OS or path issue), copy it manually:

```bash
cp packages/tracker/dist/tracker.js apps/demo-web/public/tracker.js
```

On Windows:

```powershell
copy packages\tracker\dist\tracker.js apps\demo-web\public\tracker.js
```

---

## Integration

### Method 1 -- Plain HTML

The simplest approach. Add the script tag to any HTML page. No build tools required.

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <h1>My Website</h1>

  <script src="https://YOUR_CDN_OR_SERVER/tracker.js"></script>
  <script>
    window.initTracker({
      backendUrl: "https://YOUR_BACKEND_URL"
    });
  </script>
</body>
</html>
```

### Method 2 -- React (Create React App, Vite, etc.)

Load the script dynamically inside a `useEffect` hook.

```tsx
import { useEffect } from "react";

function TrackerInit({ backendUrl }: { backendUrl: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/tracker.js";
    script.onload = () => {
      (window as any).initTracker({ backendUrl });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}

// Usage in App.tsx:
function App() {
  return (
    <>
      <TrackerInit backendUrl="http://localhost:8080" />
      {/* rest of your app */}
    </>
  );
}
```

For this to work, place `tracker.js` in your `public/` folder so it is served as a static file at `/tracker.js`.

### Method 3 -- Next.js (used in demo-web)

Create a client component that wraps `next/script` and uses `usePathname` to track client-side navigation.

```tsx
// components/TrackerScript.tsx
"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function TrackerScript() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip the first execution because initTracker already fired the initial page_view
    if (isFirstLoad.current) {
      if (isLoaded) {
        isFirstLoad.current = false;
      }
      return;
    }

    // Fire a page_view event every time the pathname changes AFTER the initial load
    if (isLoaded && typeof window !== "undefined" && (window as any).trackPageView) {
      (window as any).trackPageView(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080");
    }
  }, [pathname, isLoaded]);

  return (
    <Script
      src="/tracker.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).initTracker) {
          (window as any).initTracker({
            backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
          });
          setIsLoaded(true); // Mark as loaded so future route changes can trigger trackPageView
        }
      }}
    />
  );
}
```

Then add `<TrackerScript />` to your root layout.

---

## Event Payload

The tracker sends events as JSON via POST to `{backendUrl}/api/v1/events`.

**page_view:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "page_view",
  "pageUrl": "https://example.com/products",
  "timestamp": 1750672800000
}
```

**click:**

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "click",
  "pageUrl": "https://example.com/products",
  "timestamp": 1750672805000,
  "coordX": 340,
  "coordY": 512
}
```

---

## Configuration

| Option     | Type   | Required | Description                 |
|------------|--------|----------|-----------------------------|
| backendUrl | string | yes      | Base URL of the backend API |
