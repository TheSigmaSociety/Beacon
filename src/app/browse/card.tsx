"use client";
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const URL = "http://localhost:6900/beacons"; // change to the actual URL

export default function Card(beaconVal: any) {
  // changed to use json instead of string

  const actualValue = beaconVal.beaconVal; //what is this bro
  var title = actualValue.title;
  var wheelchair = actualValue.wheelchairAccessible == true ? "✅" : "❌";
  var deaf = actualValue.deafFriendly == true ? "✅" : "❌";
  var blind = actualValue.visionAccessible == true ? "✅" : "❌";
  var location = actualValue.location;

  const upvote = async () => {
    try {
      const response = await fetch(
        URL + "/beacons/:" + actualValue.id + "/upvote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("Network response was not ok");
      }
      alert("Upvoted");
    } catch (error) {
      alert("Error upvoting");
    }
  };

  const downvote = async () => {
    try {
      const response = await fetch(
        URL + "/beacons/:" + actualValue.id + "/downvote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("Network response was not ok");
      }
      alert("Downvoted");
    } catch (error) {
      alert("Error downvoting:");
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(location);
    alert("Address copied to clipboard");
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <div
            className="bg-white/70 backdrop-blur-lg shadow-lg border border-gray-200 rounded-xl p-6 text-black transition-transform duration-300 hover:-translate-y-2 w-[350px]"
            onClick={copyAddress}
          >
            <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {title}
            </h1>

            <div className="w-full h-40 rounded-lg overflow-hidden aspect-video">
              <img
                src="https://placehold.co/350x200"
                alt="Placeholder"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-gray-600 mt-2 text-center">
              📍 <span>{location}</span>
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700 text-center">
              <p>
                ♿ <span className="font-semibold">Wheelchair Accessible:</span>{" "}
                {wheelchair}
              </p>
              <p>
                🦻 <span className="font-semibold">Deaf Friendly:</span> {deaf}
              </p>
              <p>
                🔠 <span className="font-semibold">Braille Available:</span>{" "}
                {blind}
              </p>
            </div>

            {/* Vote Buttons */}
            <div className="mt-4 flex justify-around items-center">
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                onClick={upvote}
              >
                <FaRegArrowAltCircleUp className="text-lg" />
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                onClick={downvote}
              >
                <FaRegArrowAltCircleDown className="text-lg" />
              </button>
            </div>
          </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Address</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
