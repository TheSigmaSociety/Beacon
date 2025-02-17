"use client";

import { FaArrowDown } from "react-icons/fa";

export default function Hero() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center px-6 md:px-12 mb-[-5rem]">
      <div className="absolute top-10 left-[-3rem] w-1/2 h-1/3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 opacity-40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 opacity-30 blur-3xl rounded-full"></div>

      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl lg:text-9xl text-black font-bold px-6 md:px-12 flicker">
          A More Accessible World
        </h1>
        <h3 className="text-xl md:text-3xl text-black p-6 md:p-12">
          One Beacon at a time.
        </h3>
        <div className="animate-bounce w-full h-auto flex items-center justify-start p-12">
          Scroll to see the map! &nbsp; <FaArrowDown />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <div className="w-3/4 md:w-2/3 lg:w-3/4 aspect-square border-4 mt-0 md:mt-[-2rem] border-black rotating"></div>
      </div>
    </div>
  );
}
