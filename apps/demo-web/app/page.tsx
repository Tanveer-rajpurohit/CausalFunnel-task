"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <h1 className="font-garamond-dark text-5xl md:text-6xl mb-6 tracking-tight text-center">
        Welcome to the Tracking Demo
      </h1>
      <p className="font-inter-regular text-lg md:text-xl mb-12 max-w-2xl text-center text-light-muted dark:text-dark-muted">
        This is a sample webpage designed to test the CausalFunnel analytics script. Every page view and click you make here is being tracked and sent to the backend.
      </p>
      
      {mounted ? (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-8 py-4 rounded-full bg-light-primary hover:bg-light-primary-active dark:bg-dark-primary dark:hover:bg-dark-primary-active text-white font-inter-bold transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Toggle Theme (Current: {theme})
        </button>
      ) : (
        <div className="px-8 py-4 rounded-full bg-light-surface dark:bg-dark-surface text-light-muted dark:text-dark-muted font-inter-bold shadow-sm opacity-50">
          Loading theme...
        </div>
      )}
    </div>
  );
}
