"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function RouteScrollReset({ pathname }: { pathname: string }) {
  const lenis = useLenis();
  
  useEffect(() => {
    if (lenis) {
      // Force Lenis to instantly reset scroll to the top and recalculate page bounds 
      // when navigating via Next.js <Link> SPA transitions
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Disable Lenis on Auth pages since they use a 100vh flex layout
  // which conflicts with Lenis's resize observer and causes sluggish scrolling.
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <RouteScrollReset pathname={pathname} />
      {children}
    </ReactLenis>
  );
}
