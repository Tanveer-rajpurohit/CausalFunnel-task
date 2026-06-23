"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Dropdown } from "../../../components/Dropdown";
import { HeatmapVisualizer } from "../../../components/HeatmapVisualizer";

gsap.registerPlugin(ScrollTrigger);

export default function SessionJourneyPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [activeTab, setActiveTab] = useState<"timeline" | "heatmap">("timeline");
  const [filterType, setFilterType] = useState("all");
  const [filterUrl, setFilterUrl] = useState("all");

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (activeTab === "timeline" && timelineContainerRef.current && scrollLineRef.current) {
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

      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }
  }, [activeTab]);

  const eventTypes = [
    { label: "All Events", value: "all" },
    { label: "Page Views", value: "page_view" },
    { label: "Clicks", value: "click" },
  ];

  const urlOptions = [
    { label: "All Pages", value: "all" },
    { label: "/", value: "/" },
    { label: "/about", value: "/about" },
    { label: "/products", value: "/products" },
  ];

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
                <Dropdown options={eventTypes} value={filterType} onChange={setFilterType} />
              </div>
            </div>

            <div ref={timelineContainerRef} className="relative ml-2 pl-8 space-y-16 pb-20">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-light-border dark:bg-dark-border opacity-50"></div>
              <div ref={scrollLineRef} className="absolute left-0 top-0 w-[2px] bg-[#cc785c] h-0 origin-top shadow-[0_0_10px_rgba(204,120,92,0.8)]"></div>
              
              {[
                { time: "06:42:53", type: "Page View", desc: "Navigated to", url: "/about", x: null, y: null },
                { time: "06:42:54", type: "Click", desc: "Clicked on", url: "/about", x: 1044, y: 42 },
                { time: "06:43:10", type: "Page View", desc: "Navigated to", url: "/products", x: null, y: null },
                { time: "06:43:45", type: "Click", desc: "Clicked on", url: "/products", x: 210, y: 884 },
                { time: "06:44:05", type: "Page View", desc: "Navigated to", url: "/", x: null, y: null },
                { time: "06:45:12", type: "Click", desc: "Clicked on", url: "/", x: 500, y: 300 },
                { time: "06:46:22", type: "Click", desc: "Clicked on", url: "/", x: 520, y: 340 },
                { time: "06:48:01", type: "Page View", desc: "Navigated to", url: "/about", x: null, y: null },
                { time: "06:48:15", type: "Click", desc: "Clicked on", url: "/about", x: 800, y: 600 },
                { time: "06:49:10", type: "Click", desc: "Clicked on", url: "/about", x: 850, y: 620 },
                { time: "06:50:05", type: "Page View", desc: "Navigated to", url: "/products", x: null, y: null },
                { time: "06:51:30", type: "Click", desc: "Clicked on", url: "/products", x: 1200, y: 400 },
                { time: "06:52:12", type: "Click", desc: "Clicked on", url: "/products", x: 1210, y: 410 },
                { time: "06:55:00", type: "Page View", desc: "Navigated to", url: "/", x: null, y: null },
                { time: "06:56:45", type: "Click", desc: "Clicked on", url: "/", x: 100, y: 200 },
              ].map((ev, i) => (
                <div key={i} className="relative group z-10">
                  <div className="timeline-dot absolute -left-[37px] top-1 w-2.5 h-2.5 rounded-full bg-light-muted dark:bg-dark-muted ring-4 ring-light-bg dark:ring-dark-bg"></div>
                  
                  <p className="font-mono text-xs text-light-muted dark:text-dark-muted mb-2">{ev.time}</p>
                  <h3 className="font-inter-bold text-lg text-light-text dark:text-dark-text mb-1 transition-colors duration-300 group-hover:text-[#cc785c]">{ev.type}</h3>
                  <p className="font-inter-regular text-sm text-light-muted dark:text-dark-muted">
                    {ev.desc} <span className="text-light-text dark:text-dark-text font-mono bg-light-surface dark:bg-dark-surface px-1.5 py-0.5 rounded border border-light-border dark:border-dark-border">{ev.url}</span>
                  </p>
                  {ev.type === "Click" && (
                    <div className="mt-3 inline-flex gap-4 font-mono text-xs text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface px-3 py-1.5 rounded border border-light-border dark:border-dark-border">
                      <span>X: {ev.x}</span>
                      <span className="text-light-border dark:text-dark-border">|</span>
                      <span>Y: {ev.y}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "heatmap" && (
          <div>
            <div className="flex justify-between items-end border-b-2 border-light-text dark:border-dark-text pb-4 mb-8">
              <div className="font-inter-bold text-xs uppercase tracking-widest text-light-text dark:text-dark-text">
                Click Visualizer
              </div>
              <div className="z-30 relative">
                <Dropdown options={urlOptions} value={filterUrl} onChange={setFilterUrl} />
              </div>
            </div>

            <HeatmapVisualizer type="local" />
          </div>
        )}

      </div>
    </div>
  );
}
