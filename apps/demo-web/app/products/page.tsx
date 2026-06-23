"use client";

import React from "react";

const products = [
  { id: 1, name: "The Essential Carrier", price: "$240", desc: "Minimalist leather day bag." },
  { id: 2, name: "Chronograph 01", price: "$850", desc: "Precision engineered timepiece." },
  { id: 3, name: "Polarized Sunglasses", price: "$180", desc: "Polarized lenses with a titanium frame." },
];

export default function ProductsPage() {
  return (
    <div className="w-full flex-grow flex flex-col items-center p-8 transition-colors duration-300">
      <h1 className="font-garamond-dark text-5xl md:text-6xl mb-12 tracking-tight text-center mt-8">
        Curated Collection
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {products.map((product) => (
          <div 
            key={product.id}
            className="group flex flex-col p-8 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className="w-full h-64 bg-light-secondary-border dark:bg-dark-secondary-border rounded-xl mb-6 flex items-center justify-center overflow-hidden">
              <span className="font-inter-bold text-light-muted dark:text-dark-muted opacity-50 uppercase tracking-widest text-xs">Image Placeholder</span>
            </div>
            <h2 className="font-garamond-dark text-2xl mb-2">{product.name}</h2>
            <p className="font-inter-regular text-light-muted dark:text-dark-muted mb-4 flex-grow">{product.desc}</p>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-inter-bold text-lg">{product.price}</span>
              <button className="text-sm font-inter-bold uppercase tracking-widest text-light-primary dark:text-dark-primary group-hover:underline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
