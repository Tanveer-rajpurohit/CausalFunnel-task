import React from "react";

export default function AboutPage() {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <div className="max-w-3xl w-full">
        <h1 className="font-garamond-dark text-5xl md:text-6xl mb-8 tracking-tight text-center">
          About This Project
        </h1>
        <div className="space-y-6 text-lg text-light-muted dark:text-dark-muted font-inter-regular leading-relaxed text-justify">
          <p>
            This demo application was built as part of the Full Stack Engineer assignment for CausalFunnel. It serves as a testing ground for the analytics tracker.
          </p>
          <p>
            By navigating between these pages and clicking around, you are generating real event data. The tracker captures your session ID, page URLs, timestamps, and exact click coordinates, which can then be viewed in the separate Dashboard application.
          </p>
        </div>
      </div>
    </div>
  );
}
