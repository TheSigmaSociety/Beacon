import { Marker, InfoWindow } from '@react-google-maps/api';
import React, { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { upvoteBeacon, downvoteBeacon } from '../lib/api';

export interface MarkerData {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title?: string;
  data?: {
    description?: string;
    votes?: number;
    image?: string;
    accessibility?: {
      wheelchair?: boolean;
      audio?: boolean;
      vision?: boolean;
    };
  };
}

interface MapMarkersProps {
  markers: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
}

export function MapMarkers({ markers, onMarkerClick }: MapMarkersProps) {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [isVoting, setIsVoting] = useState<Record<string, boolean>>({});

  // Load user's previous votes from localStorage
  useEffect(() => {
    const savedVotes = localStorage.getItem('userVotes');
    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = async (markerId: string, isUpvote: boolean) => {
    if (isVoting[markerId]) return; // Prevent multiple votes while processing
    
    setIsVoting(prev => ({ ...prev, [markerId]: true }));

    try {
      const currentVote = userVotes[markerId];
      let newVote: 'up' | 'down' | null = null;
      
      // If clicking same vote type, remove the vote
      if ((isUpvote && currentVote === 'up') || (!isUpvote && currentVote === 'down')) {
        newVote = null;
        
        // Update server
        if (isUpvote) {
          await downvoteBeacon(markerId);
        } else {
          await upvoteBeacon(markerId);
        }
        
        // Update local vote count
        setVotes(prev => ({
          ...prev,
          [markerId]: (prev[markerId] || 0) + (isUpvote ? -1 : 1)
        }));
      }
      // If changing vote direction
      else if (currentVote) {
        newVote = isUpvote ? 'up' : 'down';
        
        // Update server
        if (isUpvote) {
          await upvoteBeacon(markerId);
        } else {
          await downvoteBeacon(markerId);
        }
        
        // Update local vote count
        setVotes(prev => ({
          ...prev,
          [markerId]: (prev[markerId] || 0) + (isUpvote ? 1 : -1)
        }));
      }
      // If voting for the first time
      else {
        newVote = isUpvote ? 'up' : 'down';
        
        // Update server
        if (isUpvote) {
          await upvoteBeacon(markerId);
        } else {
          await downvoteBeacon(markerId);
        }
        
        // Update local vote count
        setVotes(prev => ({
          ...prev,
          [markerId]: (prev[markerId] || 0) + (isUpvote ? 1 : -1)
        }));
      }

      // Update localStorage
      const newUserVotes = {
        ...userVotes,
        [markerId]: newVote
      };
      setUserVotes(newUserVotes);
      localStorage.setItem('userVotes', JSON.stringify(newUserVotes));

    } catch (error) {
      console.error('Failed to update vote:', error);
    } finally {
      setIsVoting(prev => ({ ...prev, [markerId]: false }));
    }
  };

  const getVoteButtonClass = (markerId: string, isUpvote: boolean) => {
    const currentVote = userVotes[markerId];
    const baseClass = isVoting[markerId] ? 'cursor-not-allowed opacity-50 ' : '';
    
    if (isUpvote) {
      return baseClass + (currentVote === 'up' 
        ? 'text-green-600' 
        : 'text-gray-600 hover:text-green-600');
    }
    return baseClass + (currentVote === 'down' 
      ? 'text-red-600' 
      : 'text-gray-600 hover:text-red-600');
  };

  return (
    <>
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.id}-${index}`}
          position={marker.position}
          onClick={() => setSelectedMarker(marker)}
          title={marker.title}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div className="w-64 rounded overflow-hidden shadow-sm bg-white p-3">
            {selectedMarker.data?.image && (
              <img
                src={selectedMarker.data.image}
                alt={selectedMarker.title || 'Location'}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">
                {selectedMarker.title}
              </h3>
              <div className="flex flex-col items-center gap-1">
                <button 
                  onClick={() => handleVote(selectedMarker.id, true)}
                  className={`transition-colors ${getVoteButtonClass(selectedMarker.id, true)}`}
                  disabled={isVoting[selectedMarker.id]}
                >
                  <ArrowBigUp size={20} />
                </button>
                <span className="font-bold">
                  {(votes[selectedMarker.id] || 0) + (selectedMarker.data?.votes || 0)}
                </span>
                <button 
                  onClick={() => handleVote(selectedMarker.id, false)}
                  className={`transition-colors ${getVoteButtonClass(selectedMarker.id, false)}`}
                  disabled={isVoting[selectedMarker.id]}
                >
                  <ArrowBigDown size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {selectedMarker.data?.description}
            </p>

            {selectedMarker.data?.accessibility && (
              <div className="flex gap-1 text-xs">
                {selectedMarker.data.accessibility.wheelchair && (
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">♿</span>
                )}
                {selectedMarker.data.accessibility.audio && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">🔊</span>
                )}
                {selectedMarker.data.accessibility.vision && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">👁️</span>
                )}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
