import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getAllBeacons, createBeacon, deleteBeacon, upvoteBeacon, downvoteBeacon } from '../lib/api';
import { Beacon } from '../lib/api';

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

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [markers, setMarkers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isGeoLoading, setIsGeoLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const addMarkerFromBeacon = async (beacon: Beacon, setMarkers: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const location = await geocodeAddress(beacon.location);
      
      if (!location) {
        console.error('Could not geocode location:', beacon.location);
        return;
      }
  
      const newMarker = {
        position: { lat: location.lat, lng: location.lng },
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
  };

  useEffect(() => {
    setIsGeoLoading(true);
    
    // Set timeout to prevent infinite loading using ref
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
            await addMarkerFromBeacon(beacon, setMarkers);
          }
        }
      } catch (error: any) {
        console.error('Data fetching error:', error);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadData();
  }, []);
  
  // Modified return statement
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
          />
        </LoadScript>
      )}
    </div>
  );
};

export default MapComponent;