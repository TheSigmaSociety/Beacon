"use client";
import Card from "./card";
import Header from "../header";
import { useEffect, useState } from "react";
const URL = "https://emp25-backend.hackathon.varram.me"; // change to the actual URL

export default function Browse() {
  const [beacons, setBeacons] = useState<any[]>([]);

  const fetchBeacons = async () => {
    console.log("Fetching beacons");
    try {
      const response = await fetch(`${URL}/beacons`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBeacons(data);
      data.forEach((beacon: JSON) => {
        console.log(beacon);
      });
      console.log(data);
    } catch (error) {
      console.error("Error fetching beacons:", error);
    }
  };

  useEffect(() => {
    fetchBeacons();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#FAF9F6] relative">
      <Header />
      <div className="absolute top-10 left-[-3rem] w-1/2 h-1/3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 opacity-40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8 mx-12 mt-8">
          {beacons.map((beacon) => (
            <Card key={beacon._id} beaconVal={beacon} />
          ))}
        </div>
      </div>
    </div>
  );
}
