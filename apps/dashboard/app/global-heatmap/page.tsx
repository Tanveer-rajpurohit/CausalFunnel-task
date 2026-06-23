"use client";

import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { Dropdown } from "../../src/components/Dropdown";
import { HeatmapVisualizer } from "../../src/components/HeatmapVisualizer";

import { useAppStore } from "../../src/store/useAppStore";
import { useDropdownPages } from "../../src/hooks/useSessions";
import { useHeatmap } from "../../src/hooks/useEvents";

export default function GlobalHeatmapPage() {
  const { globalFilterUrl, setGlobalFilterUrl } = useAppStore();
  const { pages } = useDropdownPages();
  const { heatmapData, isLoading, error } = useHeatmap(globalFilterUrl, 'global');

  const urlOptions = [
    { label: "Select a page...", value: "all" },
    ...pages.map(p => ({ label: p, value: p }))
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
          <Dropdown options={urlOptions} value={globalFilterUrl} onChange={setGlobalFilterUrl} />
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {globalFilterUrl === 'all' ? (
        <div className="w-full aspect-video flex items-center justify-center border border-dashed border-light-border dark:border-dark-border rounded-xl">
          <p className="text-light-muted dark:text-dark-muted font-inter-regular">Please select a page from the dropdown to view the heatmap.</p>
        </div>
      ) : (
        <HeatmapVisualizer type="global" data={heatmapData} isLoading={isLoading} />
      )}

    </div>
  );
}
