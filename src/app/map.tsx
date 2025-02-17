import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const apiKey = "AIzaSyCIqsxA_PgkljVeadCtvVy01qqq4eE12OU";

const containerStyle: React.CSSProperties = {
  width: '75%',
  height: '75%',
  margin: 'auto',
  top: '0', bottom: '0', left: '0', right: '0'
};

const defaultCenter = {
  lat: -34.397,
  lng: 150.644
};

// For storing the latitude and longitude of a location from its address
interface LatLong {
    lat: number;
    lng: number;
}

interface EntryData {
    id: string;
    title: string;
    description: string;
    location: string;
    votes: number;
    image: string;
    wheelchairAccessible: boolean;
    audioAccessible: boolean;
    visionAccessible: boolean;
  }
  
interface EntryResponse {
    entry: EntryData;
}

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  /** Gets user location and centers the map on load to the user location */

  const geocodeAddress = async (address: string): Promise<LatLong | null> => {
    try {
      // Encode address for URL
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
  
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const addMarkerFromData = async (entry: EntryData, setMarkers: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const location = await geocodeAddress(entry.location);
      
      if (!location) {
        console.error('Could not geocode location:', entry.location);
        return;
      }
  
      const newMarker = {
        position: { lat: location.lat, lng: location.lng },
        title: entry.title,
        id: entry.id,
        data: {
          description: entry.description,
          votes: entry.votes,
          image: entry.image,
          accessibility: {
            wheelchair: entry.wheelchairAccessible,
            audio: entry.audioAccessible,
            vision: entry.visionAccessible
          }
        }
      };
  
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  };

  if (isLoading) return <div>Loading map...</div>;
  if (error) return <div>{error}</div>;

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3010');
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
  
      const data = await response.json();
      
      // Assuming response is an array of entries
      data.forEach((entryData: EntryData) => {
        addMarkerFromData(entryData, setMarkers);
      });
  
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load entries from server');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          setError("Unable to retrieve your location");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, []);
  
  return (
    <div className="w-full h-full flex justify-center items-center object-cover">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={15}
        >
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} title={marker.title} />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;