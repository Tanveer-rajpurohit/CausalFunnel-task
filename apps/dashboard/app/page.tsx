"use client";

"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MousePointerClick, ArrowLeft } from "lucide-react";

import { Dropdown } from "../src/components/Dropdown";
import { SessionList } from "../src/components/SessionList";
import { useSessionList } from "../src/hooks/useSessions";

export default function DashboardPage() {
  const [sortValue, setSortValue] = useState("lastActive-desc");
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);

  const [sortBy, order] = sortValue.split("-");

  const { data, isLoading, error } = useSessionList(parseInt(limit), page, sortBy, order);

  const sortOptions = [
    { label: "Newest Active", value: "lastActive-desc" },
    { label: "Oldest Active", value: "lastActive-asc" },
    { label: "Most Events", value: "eventCount-desc" },
    { label: "Least Events", value: "eventCount-asc" }
  ];

  const handleNextPage = () => {
    if (data && page < data.meta.totalPages) setPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(p => p - 1);
  };

  return (
    <div className="w-full min-h-screen pt-20 pb-12 px-8 lg:px-16 mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="font-garamond-dark text-6xl tracking-tight mb-4 text-light-text dark:text-dark-text">
            Sessions
          </h1>
          <p className="font-inter-regular text-xl text-light-muted dark:text-dark-muted max-w-2xl leading-relaxed">
            Monitor individual user journeys, analyze interaction patterns, and view session-specific heatmaps.
          </p>
        </div>
        
        <Link 
          href="/global-heatmap" 
          className="group inline-flex items-center gap-2 font-inter-bold text-sm uppercase tracking-widest text-[#cc785c] hover:text-light-text dark:hover:text-dark-text transition-colors duration-300 pb-1 border-b border-transparent hover:border-light-text dark:hover:border-dark-text"
        >
          View Global Heatmap <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex justify-between items-end border-b-2 border-light-text dark:border-dark-text pb-4 mb-4">
        <div className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text flex items-center gap-2">
          <MousePointerClick className="w-4 h-4" />
          All Recorded Sessions
        </div>
        
        <div className="flex gap-6 z-10">
          <div className="flex items-center gap-2">
            <span className="font-inter-regular text-xs text-light-muted dark:text-dark-muted">Sort By:</span>
            <Dropdown options={sortOptions} value={sortValue} onChange={setSortValue} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center font-inter-bold text-light-muted dark:text-dark-muted animate-pulse">
          Loading Sessions...
        </div>
      ) : error ? (
        <div className="py-20 text-center font-inter-bold text-red-500">
          {error}
        </div>
      ) : (
        <SessionList sessions={data?.sessions || []} />
      )}

      <div className="flex justify-between items-center mt-12 pb-12">
        <div className="flex items-center gap-2">
          <span className="font-inter-regular text-xs text-light-muted dark:text-dark-muted uppercase tracking-widest">Rows per page:</span>
          <Dropdown 
            options={[
              { label: "10", value: "10" },
              { label: "25", value: "25" },
              { label: "50", value: "50" },
              { label: "100", value: "100" }
            ]} 
            value={limit} 
            onChange={(val) => { setLimit(val); setPage(1); }} 
            openUpwards
          />
        </div>
        
        {data && data.meta && (
          <div className="flex items-center gap-6">
            <span className="font-inter-regular text-sm text-light-muted dark:text-dark-muted">
              Page {data.meta.currentPage} of {data.meta.totalPages} ({data.meta.totalRecords} total)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={page <= 1}
                className={`group w-10 h-10 shrink-0 aspect-square rounded-full border flex items-center justify-center transition-all duration-300 ${
                  page <= 1 
                    ? "border-light-border dark:border-dark-border text-light-muted/50 dark:text-dark-muted/50 cursor-not-allowed" 
                    : "border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-light-text hover:text-light-text dark:hover:border-dark-text dark:hover:text-dark-text cursor-pointer"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 transition-transform duration-300 ${page <= 1 ? "" : "group-hover:-translate-x-1"}`} />
              </button>
              <button 
                onClick={handleNextPage}
                disabled={page >= data.meta.totalPages}
                className={`group w-10 h-10 shrink-0 aspect-square rounded-full border flex items-center justify-center transition-all duration-300 ${
                  page >= data.meta.totalPages 
                    ? "border-light-border dark:border-dark-border text-light-muted/50 dark:text-dark-muted/50 cursor-not-allowed" 
                    : "border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-light-text hover:text-light-text dark:hover:border-dark-text dark:hover:text-dark-text cursor-pointer"
                }`}
              >
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${page >= data.meta.totalPages ? "" : "group-hover:translate-x-1"}`} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
