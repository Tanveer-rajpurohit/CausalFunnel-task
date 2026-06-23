"use client";

import { useState } from "react";
import { MousePointerClick, Grid as GridIcon, Focus } from "lucide-react";

interface HeatmapVisualizerProps {
  type: "global" | "local";
  data?: Array<{ coordX: number; coordY: number }>;
  isLoading?: boolean;
}

export function HeatmapVisualizer({ type, data = [], isLoading = false }: HeatmapVisualizerProps) {
  const [mode, setMode] = useState<"points" | "grid">("points");
  const [hoveredCell, setHoveredCell] = useState<{ c: number; r: number; val: number } | null>(null);

  const cols = 24;
  const rows = 12;

  const getIntensity = (c: number, r: number) => {
    if (!data || data.length === 0) return 0;
    
    const minX = c * 60;
    const maxX = (c + 1) * 60;
    const minY = r * 75;
    const maxY = (r + 1) * 75;

    let count = 0;
    for (const point of data) {
      if (point.coordX != null && point.coordY != null) {
        if (point.coordX >= minX && point.coordX < maxX && point.coordY >= minY && point.coordY < maxY) {
          count++;
        }
      }
    }
    return count;
  };

  const getCellColor = (intensity: number) => {
    if (intensity === 0) return "transparent";
    if (intensity < 5) return "rgba(204, 120, 92, 0.2)";
    if (intensity < 15) return "rgba(204, 120, 92, 0.4)";
    if (intensity < 30) return "rgba(204, 120, 92, 0.7)";
    return "rgba(255, 87, 34, 0.9)";
  };

  const gridData = Array.from({ length: rows }).map((_, r) =>
    Array.from({ length: cols }).map((_, c) => getIntensity(c, r))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex border border-light-border dark:border-dark-border rounded-lg overflow-hidden bg-transparent w-fit shadow-sm">
          <button
            onClick={() => setMode("points")}
            className={`flex items-center gap-2 px-4 py-1.5 transition-colors duration-200 text-xs tracking-widest uppercase ${
              mode === "points"
                ? "bg-light-surface/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold"
                : "text-light-muted dark:text-dark-muted hover:bg-light-surface/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c]"
            }`}
          >
            <Focus className="w-3 h-3" /> Raw Points
          </button>
          <button
            onClick={() => setMode("grid")}
            className={`flex items-center gap-2 px-4 py-1.5 transition-colors duration-200 text-xs tracking-widest uppercase border-l border-light-border dark:border-dark-border ${
              mode === "grid"
                ? "bg-light-surface/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold"
                : "text-light-muted dark:text-dark-muted hover:bg-light-surface/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c]"
            }`}
          >
            <GridIcon className="w-3 h-3" /> Density Grid
          </button>
        </div>
      </div>

      <div className="w-full aspect-video bg-light-surface dark:bg-dark-surface relative overflow-hidden flex flex-col border border-light-border dark:border-dark-border shadow-inner rounded-xl transition-all duration-500 hover:shadow-md group">
        <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#6c6a64_1px,transparent_1px),linear-gradient(to_bottom,#6c6a64_1px,transparent_1px)] [background-size:4.16%_8.33%] pointer-events-none"></div>

        {isLoading && (
           <div className="absolute inset-0 z-30 flex items-center justify-center bg-light-bg/50 dark:bg-dark-bg/50 backdrop-blur-sm">
             <span className="font-inter-bold text-[#cc785c] animate-pulse">Loading Map...</span>
           </div>
        )}

        {mode === "points" && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {data.map((point, i) => {
              if (point.coordX == null || point.coordY == null) return null;
              
              // Map to % based on assumed 1440x900
              const left = Math.min(100, Math.max(0, (point.coordX / 1440) * 100));
              const top = Math.min(100, Math.max(0, (point.coordY / 900) * 100));
              
              return (
                <div 
                  key={i} 
                  className="absolute w-4 h-4 rounded-full bg-[#cc785c] blur-[2px] animate-pulse mix-blend-multiply dark:mix-blend-screen shadow-[0_0_10px_rgba(204,120,92,0.8)]"
                  style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${(i % 10) * 0.1}s` }}
                />
              );
            })}
          </div>
        )}

        {mode === "grid" && (
          <div className="absolute inset-0 z-10 grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
            {gridData.map((row, r) =>
              row.map((val, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-full h-full border border-light-border/10 dark:border-dark-border/10 transition-colors duration-300 hover:border-light-text dark:hover:border-dark-text cursor-crosshair"
                  style={{ backgroundColor: getCellColor(val) }}
                  onMouseEnter={() => setHoveredCell({ c, r, val })}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))
            )}
          </div>
        )}

        {mode === "grid" && hoveredCell && (
          <div className="absolute top-4 left-4 z-20 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-sm border border-light-border dark:border-dark-border px-4 py-3 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-light-border dark:border-dark-border">
              <MousePointerClick className="w-4 h-4 text-[#cc785c]" />
              <span className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text">Interaction Data</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs">
              <span className="text-light-muted dark:text-dark-muted">Zone:</span>
              <span className="text-light-text dark:text-dark-text text-right">{hoveredCell.c}, {hoveredCell.r}</span>
              <span className="text-light-muted dark:text-dark-muted">Clicks:</span>
              <span className="text-[#cc785c] font-bold text-right">{hoveredCell.val === 0 ? "None" : hoveredCell.val}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-light-border dark:border-dark-border pt-4 mt-2">
        <p className="font-inter-regular text-xs text-light-muted dark:text-dark-muted">
          {type === "global" ? "Aggregate data across all sessions." : "Single session interactions."}
        </p>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <span className="font-inter-bold text-[10px] uppercase tracking-widest text-light-text dark:text-dark-text">Map Guide:</span>
          
          {mode === "grid" ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-light-border dark:border-dark-border" style={{ backgroundColor: getCellColor(0) }}></div><span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">0</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-light-border dark:border-dark-border" style={{ backgroundColor: getCellColor(4) }}></div><span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">1-4</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-light-border dark:border-dark-border" style={{ backgroundColor: getCellColor(14) }}></div><span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">5-14</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-light-border dark:border-dark-border" style={{ backgroundColor: getCellColor(29) }}></div><span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">15-29</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm border border-light-border dark:border-dark-border" style={{ backgroundColor: getCellColor(40) }}></div><span className="text-[10px] font-mono text-light-text dark:text-dark-text font-bold">30+</span></div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#cc785c] shadow-[0_0_10px_rgba(204,120,92,0.8)]"></span>
                <span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">1-5 Clicks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500 blur-[0.5px] shadow-[0_0_15px_rgba(255,165,0,0.8)]"></span>
                <span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">5-15 Clicks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-500 blur-[1px] shadow-[0_0_20px_rgba(255,0,0,0.8)]"></span>
                <span className="text-[10px] font-mono text-light-text dark:text-dark-text font-bold">15+ Clicks</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
