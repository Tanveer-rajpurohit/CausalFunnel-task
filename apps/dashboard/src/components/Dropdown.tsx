"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  openUpwards?: boolean;
}

export function Dropdown({ options, value, onChange, openUpwards = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent font-inter-bold text-sm outline-none cursor-pointer text-light-text dark:text-dark-text transition-colors duration-200"
      >
        {selectedOption?.label}
        <ChevronDown className={`w-3 h-3 text-light-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-40 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in duration-200 ${openUpwards ? "bottom-full mb-2 slide-in-from-bottom-2" : "top-full mt-2 slide-in-from-top-2"}`}>
          <div className="py-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-inter-bold transition-colors duration-200 ${
                  opt.value === value
                    ? "text-[#cc785c] bg-light-surface/50 dark:bg-dark-surface/50"
                    : "text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface/30 dark:hover:bg-dark-surface/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
