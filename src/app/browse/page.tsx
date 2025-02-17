"use client";
import Card from './card';
import Header from '../header';
import { useEffect, useState } from 'react';
const URL = "http://localhost:6900/beacons" // TODO: Change to the actual URL
export default function Browse() {
  const [beacons, setBeacons] = useState<any[]>([]);

  const fetchBeacons = async () => {
    console.log("Fetching beacons");
    try {
      const response = await fetch(URL, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBeacons(data);
      data.forEach((beacon: JSON) => {
        console.log(beacon);
      });
      console.log(data);
    } catch (error) {
      console.error('Error fetching beacons:', error);
    }
  };

  useEffect(() => {
    fetchBeacons();
  }, []);
  return (    
    <div className="w-screen min-h-screen flex flex-col bg-[#FAF9F6] justify-center items-center">
        <Header />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8 mx-12 mt-8">
            {beacons.map((beacon) => (
                <Card beaconVal = {beacon} />
            ))}
            <Card beaconVal = {{title: 'Freddy Fazbears Pizzaria', location: '69 Pizzaria Freddy Har har har', wheelchairAccessible: true, deafFriendly: true, visionAccessible: false}}/>
            <Card beaconVal = {{title: 'Freddy Fazbears Pizzaria', location: '69 Pizzaria Freddy Har har har', wheelchairAccessible: true, deafFriendly: true, visionAccessible: false}}/>
            <Card beaconVal = {{title: 'Freddy Fazbears Pizzaria', location: '69 Pizzaria Freddy Har har har', wheelchairAccessible: true, deafFriendly: true, visionAccessible: false}}/>
            <Card beaconVal = {{title: 'Freddy Fazbears Pizzaria', location: '69 Pizzaria Freddy Har har har', wheelchairAccessible: true, deafFriendly: true, visionAccessible: false}}/> 
        </div>
    </div>
  );
}