"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dropdown } from "../../../src/components/Dropdown";
import { HeatmapVisualizer } from "../../../src/components/HeatmapVisualizer";

import { useAppStore } from "../../../src/store/useAppStore";
import { useSessionEvents, useHeatmap } from "../../../src/hooks/useEvents";
import { useDropdownPages } from "../../../src/hooks/useSessions";

gsap.registerPlugin(ScrollTrigger);

export default function SessionJourneyPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [activeTab, setActiveTab] = useState<"timeline" | "heatmap">("timeline");
  
  const { eventFilterType, setEventFilterType, sessionFilterUrl, setSessionFilterUrl } = useAppStore();
  const { events, isLoading: eventsLoading, error: eventsError } = useSessionEvents(sessionId, eventFilterType);
  const { heatmapData, isLoading: heatmapLoading } = useHeatmap(sessionFilterUrl, sessionId);
  const { pages } = useDropdownPages();

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "timeline" && !eventsLoading && events.length > 0) {
      const timer = setTimeout(() => {
        if (timelineContainerRef.current && scrollLineRef.current) {
          ScrollTrigger.create({
            trigger: timelineContainerRef.current,
            start: "top center",
            end: "bottom center",
            animation: gsap.fromTo(
              scrollLineRef.current, 
              { height: "0%" }, 
              { height: "100%", ease: "none" }
            ),
            scrub: 0.5,
          });

          const dots = gsap.utils.toArray<HTMLDivElement>(".timeline-dot");
          dots.forEach((dot) => {
            ScrollTrigger.create({
              trigger: dot,
              start: "top center",
              animation: gsap.to(dot, {
                backgroundColor: "#cc785c",
                scale: 1.2,
                boxShadow: "0 0 10px rgba(204,120,92,0.8)",
                duration: 0.3,
                ease: "power2.out"
              }),
              toggleActions: "play none none reverse",
            });
          });
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [activeTab, eventsLoading, events]);

  const eventTypes = [
    { label: "All Events", value: "all" },
    { label: "Page Views", value: "page_view" },
    { label: "Clicks", value: "click" },
  ];

  const urlOptions = pages.map(p => ({ label: p, value: p }));

  return (
    <div className="w-full min-h-screen pt-20 pb-40 px-8 lg:px-16 mx-auto">
      <Link 
        href="/" 
        className="group inline-flex items-center gap-2 mb-12 font-inter-bold text-xs uppercase tracking-widest text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Sessions
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 z-20 relative">
        <div>
          <h1 className="font-garamond-dark text-6xl tracking-tight mb-4 text-light-text dark:text-dark-text">
            Session Analysis
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-inter-regular text-sm text-light-muted dark:text-dark-muted uppercase tracking-widest">ID:</span>
            <p className="font-mono text-sm text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface inline-block px-4 py-2 rounded border border-light-border dark:border-dark-border">
              {sessionId}
            </p>
          </div>
        </div>

        <div className="flex border border-light-border dark:border-dark-border rounded-lg overflow-hidden bg-transparent self-start md:self-end">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-6 py-2 transition-colors duration-200 text-xs tracking-widest uppercase ${
              activeTab === 'timeline' 
                ? 'bg-light-surface/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold' 
                : 'text-light-muted dark:text-dark-muted hover:bg-light-surface/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c]'
            }`}
          >
            User Journey
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-6 py-2 transition-colors duration-200 text-xs tracking-widest uppercase border-l border-light-border dark:border-dark-border ${
              activeTab === 'heatmap' 
                ? 'bg-light-surface/70 dark:bg-[#161618]/70 text-[#cc785c] font-bold' 
                : 'text-light-muted dark:text-dark-muted hover:bg-light-surface/50 dark:hover:bg-[#161618]/50 hover:text-[#cc785c]'
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      <div ref={contentRef} className="w-full max-w-4xl mx-auto z-10 relative">
        {activeTab === "timeline" && (
          <div>
            <div className="flex justify-between items-end border-b-2 border-light-text dark:border-dark-text pb-4 mb-8">
              <div className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text">
                Event Log
              </div>
              <div className="z-30 relative">
                <Dropdown options={eventTypes} value={eventFilterType} onChange={setEventFilterType} />
              </div>
            </div>

            {eventsLoading ? (
              <div className="py-20 text-center font-inter-bold text-light-muted dark:text-dark-muted animate-pulse">
                Loading Journey...
              </div>
            ) : eventsError ? (
              <div className="py-20 text-center font-inter-bold text-red-500">
                {eventsError}
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center font-inter-regular text-light-muted dark:text-dark-muted border border-dashed border-light-border dark:border-dark-border rounded-xl">
                No events found for this filter.
              </div>
            ) : (
              <div ref={timelineContainerRef} className="relative ml-2 pl-8 space-y-16 pb-20">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-light-border dark:bg-dark-border opacity-50"></div>
                <div ref={scrollLineRef} className="absolute left-0 top-0 w-[2px] bg-[#cc785c] h-0 origin-top shadow-[0_0_10px_rgba(204,120,92,0.8)]"></div>
                
                {events.map((ev, i) => {
                  const date = new Date(ev.timestamp);
                  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const isClick = ev.eventType === 'click';

                  return (
                    <div key={ev._id || i} className="relative group z-10">
                      <div className="timeline-dot absolute -left-[36px] top-1 w-2.5 h-2.5 rounded-full bg-light-muted dark:bg-dark-muted ring-4 ring-light-bg dark:ring-dark-bg"></div>
                      
                      <p className="font-mono text-xs text-light-muted dark:text-dark-muted mb-2">{time}</p>
                      <h3 className="font-inter-bold text-lg text-light-text dark:text-dark-text mb-1 transition-colors duration-300 group-hover:text-[#cc785c]">
                        {isClick ? 'Click' : 'Page View'}
                      </h3>
                      <p className="font-inter-regular text-sm text-light-muted dark:text-dark-muted">
                        {isClick ? 'Clicked on' : 'Navigated to'} <span className="text-light-text dark:text-dark-text font-mono bg-light-surface dark:bg-dark-surface px-1.5 py-0.5 rounded border border-light-border dark:border-dark-border">{ev.pageUrl}</span>
                      </p>
                      {isClick && ev.coordX != null && ev.coordY != null && (
                        <div className="mt-3 inline-flex gap-4 font-mono text-xs text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface px-3 py-1.5 rounded border border-light-border dark:border-dark-border">
                          <span>X: {ev.coordX}</span>
                          <span className="text-light-border dark:text-dark-border">|</span>
                          <span>Y: {ev.coordY}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "heatmap" && (
          <div>
            <div className="flex justify-between items-end border-b-2 border-light-text dark:border-dark-text pb-4 mb-8">
              <div className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text">
                Click Visualizer
              </div>
              <div className="z-30 relative">
                <Dropdown options={urlOptions} value={sessionFilterUrl} onChange={setSessionFilterUrl} />
              </div>
            </div>

            {sessionFilterUrl === 'all' ? (
              <div className="w-full aspect-video flex items-center justify-center border border-dashed border-light-border dark:border-dark-border rounded-xl">
                <p className="text-light-muted dark:text-dark-muted font-inter-regular">Please select a page from the dropdown to view the heatmap.</p>
              </div>
            ) : (
              <HeatmapVisualizer type="local" data={heatmapData} isLoading={heatmapLoading} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}
