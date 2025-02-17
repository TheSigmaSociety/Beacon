"use client";

import { useState, useEffect } from "react";

import Title from './title';
import Map from './map';
import Header from './header';
import Hero from './hero'

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hasVisited');
    }
    return true;
  });

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisited', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="w-screen h-screen relative bg-[#FAF9F6]">
      <div
        className={`absolute z-50 w-full h-full flex items-center justify-center bg-white transition-opacity duration-[2000ms]
          ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <Title />
      </div>
      {!isLoading && <Header />}
      {!isLoading && <Hero />}
      {!isLoading && <Map />}
    </div>
  );
}