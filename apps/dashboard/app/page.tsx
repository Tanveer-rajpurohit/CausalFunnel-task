"use client";

"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, MousePointerClick, ArrowLeft } from "lucide-react";

import { Dropdown } from "../components/Dropdown";
import { SessionList } from "../components/SessionList";

export default function DashboardPage() {
  const [sortEvents, setSortEvents] = useState("desc");
  const [sortActive, setSortActive] = useState("desc");

  const sortOptions = [
    { label: "Highest First", value: "desc" },
    { label: "Lowest First", value: "asc" }
  ];

  const timeOptions = [
    { label: "Newest First", value: "desc" },
    { label: "Oldest First", value: "asc" }
  ];

  const mockSessions = [
    { id: "c8ed1018-0f9b-467b-a409-eb218eb04b54", eventCount: 42, lastActive: "2 mins ago" },
    { id: "453d4061-3339-4286-b4ca-5808e8e7340d", eventCount: 15, lastActive: "1 hour ago" },
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", eventCount: 128, lastActive: "3 hours ago" },
    { id: "f1e2d3c4-b5a6-0987-dcba-0987654321fe", eventCount: 4, lastActive: "5 hours ago" },
    { id: "11223344-5566-7788-99aa-bbccddeeff00", eventCount: 67, lastActive: "1 day ago" },
    { id: "ffeebbdd-ccaa-9988-7766-554433221100", eventCount: 22, lastActive: "2 days ago" },
  ];

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
            <span className="font-inter-regular text-xs text-light-muted dark:text-dark-muted">Sort Events:</span>
            <Dropdown options={sortOptions} value={sortEvents} onChange={setSortEvents} />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-inter-regular text-xs text-light-muted dark:text-dark-muted">Sort Active:</span>
            <Dropdown options={timeOptions} value={sortActive} onChange={setSortActive} />
          </div>
        </div>
      </div>

      <SessionList sessions={mockSessions} />

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
            value="10" 
            onChange={() => {}} 
            openUpwards
          />
        </div>
        
        <div className="flex items-center gap-6">
          <span className="font-inter-regular text-sm text-light-muted dark:text-dark-muted">1-6 of 6</span>
          <div className="flex gap-2">
            <button className="group w-10 h-10 shrink-0 aspect-square rounded-full border border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted transition-all duration-300 hover:border-light-text hover:text-light-text dark:hover:border-dark-text dark:hover:text-dark-text disabled:opacity-30 disabled:hover:border-light-border cursor-not-allowed" disabled>
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
            <button className="group w-10 h-10 shrink-0 aspect-square rounded-full border border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted transition-all duration-300 hover:border-light-text hover:text-light-text dark:hover:border-dark-text dark:hover:text-dark-text disabled:opacity-30 disabled:hover:border-light-border cursor-not-allowed" disabled>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
