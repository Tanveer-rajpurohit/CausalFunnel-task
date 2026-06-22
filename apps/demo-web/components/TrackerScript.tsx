"use client";

import Script from "next/script";

export function TrackerScript() {
  return (
    <Script
      src="/tracker.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== "undefined" && (window as any).initTracker) {
          (window as any).initTracker({
            backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
          });
        }
      }}
    />
  );
}
