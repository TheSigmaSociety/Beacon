"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="h-20 w-full sticky top-0 flex items-center justify-between bg-gradient-to-b from-[#e3fffc] to-[#fbf9f7] px-6 md:px-12 z-30 border border-gray-200 shadow-lg">
            <a href="/" className="text-black text-3xl main-font">B E A C O N</a>

            <div className="hidden md:flex text-black text-lg gap-10">
                <a href="/browse" className="cursor-pointer">Browse</a>
                <a href="/report"className="cursor-pointer">Report</a>
            </div>

            <button
                className="md:hidden text-black focus:outline-none text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div
                className={`absolute top-20 text-black left-0 w-full from-[#e3fffc] via-[#f1fffd] to-white bg-gradient-to-b shadow-md flex flex-col items-center py-4 md:hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0 pointer-events-none"
                }`}
            >
                <a href="/browse" className="cursor-pointer py-2 border-b-2 w-full text-center">Browse</a>
                <a href="/report" className="cursor-pointer pt-2">Report</a>
            </div>
        </div>
    );
}
