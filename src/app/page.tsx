"use client";

import { useState, useEffect } from "react";

import Title from './title';
import Map from './map';
import Header from './header';
import Hero from './hero'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }, 2500);

    return () => clearTimeout(timer);
  }, []); 

  return (
    <div className="w-screen h-screen relative bg-[#FAF9F6]">
      <div
        className={`absolute z-50 w-full h-full flex items-center justify-center bg-white transition-opacity duration-[2000ms]
          ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <Title className={`transition-opacity duration-[2000ms] ${isLoading && !isFadingOut ? "opacity-100" : "opacity-0"}`} />
      </div>
      {!isLoading && <Header />}
      {!isLoading && <Hero />}
      {!isLoading && <Map />}
    </div>
  );
}