"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function RouteScrollReset({ pathname }: { pathname: string }) {
  const lenis = useLenis();
  
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
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
