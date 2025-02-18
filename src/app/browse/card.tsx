"use client";
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import Image from "next/image";
import { useState, useEffect } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { upvoteBeacon, downvoteBeacon } from "@/lib/api";

const URL = "https://emp25-backend.hackathon.varram.me"; // change to the actual URL

export default function Card({ beaconVal }: { beaconVal: any }) {
  const { _id, title, location, wheelchairAccessible, deafFriendly, visionAccessible, description, votes: initialVotes, image } = beaconVal;
  const wheelchair = wheelchairAccessible ? "✅" : "❌";
  const deaf = deafFriendly ? "✅" : "❌";
  const blind = visionAccessible ? "✅" : "❌";

  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      const userVotes = JSON.parse(savedVotes);
      setUserVote(userVotes[_id] || null);
    }
  }, [_id]);

  const handleVote = async (isUpvote: boolean) => {
    if (isVoting) return;

    setIsVoting(true);

    try {
      let newVote: 'up' | 'down' | null = null;

      if ((isUpvote && userVote === 'up') || (!isUpvote && userVote === 'down')) {
        newVote = null;
        if (isUpvote) {
          await downvoteBeacon(_id);
        } else {
          await upvoteBeacon(_id);
        }
        setVotes(prev => prev + (isUpvote ? -1 : 1));
      } else if (userVote) {
        newVote = isUpvote ? 'up' : 'down';
        if (isUpvote) {
          await upvoteBeacon(_id);
        } else {
          await downvoteBeacon(_id);
        }
        setVotes(prev => prev + (isUpvote ? 1 : -1));
      } else {
        newVote = isUpvote ? 'up' : 'down';
        if (isUpvote) {
          await upvoteBeacon(_id);
        } else {
          await downvoteBeacon(_id);
        }
        setVotes(prev => prev + (isUpvote ? 1 : -1));
      }

      const newUserVotes = {
        ...JSON.parse(localStorage.getItem('userVotes') || '{}'),
        [_id]: newVote
      };
      localStorage.setItem('userVotes', JSON.stringify(newUserVotes));
      setUserVote(newVote);

    } catch (error) {
      console.error('Failed to update vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              className="bg-white/70 backdrop-blur-lg shadow-lg border border-gray-200 rounded-xl p-6 text-black transition-transform duration-300 hover:-translate-y-2 w-[350px]"
              onClick={() => navigator.clipboard.writeText(location)}
            >
              <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {title}
              </h1>
              <div className="w-full h-40 rounded-lg overflow-hidden aspect-video">
                <img
                  src={image || "https://placehold.co/350x200"}
                  alt="Placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                📍 <span>{location}</span>
              </p>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {description}
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700 text-center">
                <p>
                  ♿ <span className="font-semibold">Wheelchair Accessible:</span> {wheelchair}
                </p>
                <p>
                  🦻 <span className="font-semibold">Deaf Friendly:</span> {deaf}
                </p>
                <p>
                  🔠 <span className="font-semibold">Braille Available:</span> {blind}
                </p>
                <p>
                  👍 <span className="font-semibold">Votes:</span> {votes}
                </p>
              </div>
              <div className="mt-4 flex justify-around items-center">
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 transition ${isVoting ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => handleVote(true)}
                  disabled={isVoting}
                >
                  <FaRegArrowAltCircleUp className="text-lg" />
                </button>
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition ${isVoting ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => handleVote(false)}
                  disabled={isVoting}
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
