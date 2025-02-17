"use client"

import { FaArrowDown } from "react-icons/fa"

export default function Hero() {
    return (
        <div className="h-screen w-full flex flex-col md:flex-row items-center justify-center my-[-3rem] md:my-[-1rem] px-6 md:px-12">
            <div className="w-full md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl md:text-7xl lg:text-9xl text-black font-bold px-6 md:px-12">
                    A More Accessible World
                </h1>
                <h3 className="text-xl md:text-3xl text-black p-6 md:p-12">
                    One Beacon at a Time
                </h3>


            </div>

            <div className="w-full md:w-1/2 flex justify-center items-center">
                <div className="w-3/4 md:w-2/3 lg:w-3/4 aspect-square border-4 mt-0 md:mt-[-2rem] border-black md:rotating"></div>
            </div>
        </div>
    );
}
