"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export function TrackerScript() {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      if (isLoaded) {
        isFirstLoad.current = false;
      }
      return;
    }

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
          setIsLoaded(true); 
        }
      }}
    />
  );
}
