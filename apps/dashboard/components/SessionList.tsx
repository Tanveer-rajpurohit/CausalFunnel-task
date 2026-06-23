"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Session {
  id: string;
  eventCount: number;
  lastActive: string;
}

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 gap-4 pb-4 pt-4 font-inter-bold text-xs uppercase tracking-widest text-light-muted dark:text-dark-muted">
        <div className="col-span-5 pl-4">Session Identifier</div>
        <div className="col-span-2 text-center">Event Count</div>
        <div className="col-span-3 text-center">Last Active</div>
        <div className="col-span-2 pr-4 text-right">Action</div>
      </div>

      {sessions.map((session) => (
        <div 
          key={session.id} 
          className="group grid grid-cols-12 gap-4 py-6 border-b border-light-border dark:border-dark-border items-center transition-all duration-300 hover:bg-light-surface/30 dark:hover:bg-dark-surface/30 cursor-pointer"
        >
          <div className="col-span-5 pl-4 font-mono text-sm text-light-text dark:text-dark-text transition-transform duration-300 group-hover:translate-x-2">
            {session.id}
          </div>
          <div className="col-span-2 text-center font-garamond-dark text-2xl text-light-text dark:text-dark-text">
            {session.eventCount}
          </div>
          <div className="col-span-3 text-center font-inter-regular text-sm text-light-muted dark:text-dark-muted">
            {session.lastActive}
          </div>
          <div className="col-span-2 pr-4 text-right">
            <Link 
              href={`/sessions/${session.id}`} 
              className="inline-flex items-center gap-2 text-[#cc785c] font-inter-bold text-xs uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-[-8px]"
            >
              View <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
