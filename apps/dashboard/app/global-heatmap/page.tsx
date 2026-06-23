"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Globe, MousePointerClick } from "lucide-react";
import { Dropdown } from "../../components/Dropdown";
import { HeatmapVisualizer } from "../../components/HeatmapVisualizer";

export default function GlobalHeatmapPage() {
  const [filterUrl, setFilterUrl] = useState("all");

  const urlOptions = [
    { label: "All Pages", value: "all" },
    { label: "/", value: "/" },
    { label: "/about", value: "/about" },
    { label: "/products", value: "/products" },
  ];

  return (
    <div className="w-full min-h-screen pt-20 pb-12 px-8 lg:px-16 mx-auto animate-in fade-in duration-500">
      <Link 
        href="/" 
        className="group inline-flex items-center gap-2 mb-12 font-inter-bold text-xs uppercase tracking-widest text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Sessions
      </Link>

      <div className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <Globe className="w-10 h-10 text-[#cc785c]" />
          <h1 className="font-garamond-dark text-6xl tracking-tight text-light-text dark:text-dark-text">
            Global Heatmap
          </h1>
        </div>
        <p className="font-inter-regular text-xl text-light-muted dark:text-dark-muted max-w-2xl leading-relaxed">
          Visualize aggregate click data across all recorded sessions. Discover where users interact most with your application.
        </p>
      </div>

      <div className="flex justify-between items-end border-b-2 border-light-text dark:border-dark-text pb-4 mb-8">
        <div className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text">
          Aggregate Visualizer
        </div>
        
        <div className="flex items-center gap-2 z-10">
          <span className="font-inter-regular text-xs text-light-muted dark:text-dark-muted">Page Filter:</span>
          <Dropdown options={urlOptions} value={filterUrl} onChange={setFilterUrl} />
        </div>
      </div>

      <HeatmapVisualizer type="global" />

    </div>
  );
}
