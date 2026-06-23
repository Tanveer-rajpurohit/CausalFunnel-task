"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/products", label: "Products" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-8 py-6 flex items-center justify-between backdrop-blur-md bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border dark:border-dark-border transition-colors duration-300">
      <div className="font-garamond-dark text-2xl tracking-wide font-bold">
        CausalFunnel Demo
      </div>
      <div className="flex space-x-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-inter-bold text-sm tracking-widest uppercase transition-all duration-200 ${
              pathname === link.href
                ? "text-light-primary dark:text-dark-primary"
                : "text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
