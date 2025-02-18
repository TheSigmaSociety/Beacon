import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { getAllBeacons } from '../lib/api';
import type { Beacon } from '../lib/api';
import { MapMarkers } from '@/components/MapMarkers';
import type { MarkerData } from '@/components/MapMarkers';
// import "dotenv/config";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
// console.log(apiKey);

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

interface LatLong {
  lat: number;
  lng: number;
}

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<LatLong | null> => {
    try {
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
  }, []);

  const addMarkerFromBeacon = useCallback(async (beacon: Beacon) => {
    try {
      const location = await geocodeAddress(beacon.location);
      
      if (!location) {
        console.error('Could not geocode location:', beacon.location);
        return;
      }
  
      const newMarker: MarkerData = {
        position: location,
        title: beacon.title,
        id: beacon._id,
        data: {
          description: beacon.description,
          votes: beacon.votes,
          image: beacon.image,
          accessibility: {
            wheelchair: beacon.wheelchairAccessible,
            audio: beacon.audioAccessible,
            vision: beacon.visionAccessible
          }
        }
      };
  
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }, [geocodeAddress]);

  useEffect(() => {
    setIsGeoLoading(true);
    
    timeoutRef.current = setTimeout(() => {
      setIsGeoLoading(false);
      setError("Location request timed out");
    }, 10000); // 10 second timeout
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsGeoLoading(false);
        },
        (error) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setError("Unable to retrieve your location");
          setIsGeoLoading(false);
        }
      );
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setError("Geolocation is not supported by your browser");
      setIsGeoLoading(false);
    }
  
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  useEffect(() => {
    async function loadData() {
      setIsDataLoading(true);
      try {
        const beacons = await getAllBeacons();
        if (Array.isArray(beacons)) {
          for (const beacon of beacons) {
            await addMarkerFromBeacon(beacon);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to fetch data: ${errorMessage}`);
        console.error('Data fetching error:', error);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadData();
  }, [addMarkerFromBeacon]);
  
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center object-cover bg-[#FAF9F6]">
      {isGeoLoading || isDataLoading ? (
        <div>Map Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation}
            zoom={15}
          >
            <MapMarkers 
              markers={markers}
              onMarkerClick={(marker) => {
                console.log('Clicked marker:', marker);
              }}
            />
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default MapComponent;