"use client"
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";
import Image from "next/image";



export default function Card(beaconVal: string) {
    var title = "Freddy Fazbear's Pizzaria"
    var wheelchair = "❌"
    var deaf = "✅"
    var blind = "❌"
    var location = "69 Pizzaria Freddy Har har har"

    const fetchData = async () => {
        try {
            const response = await fetch(URL + "/becons", {
              method: 'GET'
            });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          data.forEach((beacon: any) => {
            if(beacon.id == beaconVal){
                console.log(beacon)
                wheelchair = beacon.wheelchairAccessible
                deaf = beacon.deafFriendly
                blind = beacon.visionAccessible
            }
          })
          console.log(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      return (
        <div className="bg-white/70 backdrop-blur-lg shadow-lg border border-gray-200 rounded-xl p-6 text-black transition-transform duration-300 hover:-translate-y-2 w-[350px]">
            <h1 className="text-xl font-semibold text-gray-900 mb-2 text-center">{title}</h1>
    
            <div className="w-full h-40 rounded-lg overflow-hidden aspect-video">
                <img
                    src="https://placehold.co/350x200"
                    alt="Placeholder"
                    className="w-full h-full object-cover"
                />
            </div>

            <p className="text-sm text-gray-600 mt-2 text-center">📍 <span>{location}</span></p>
    
            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-700 text-center">
                <p>♿ <span className="font-semibold">Wheelchair Accessible:</span> {wheelchair}</p>
                <p>🦻 <span className="font-semibold">Deaf Friendly:</span> {deaf}</p>
                <p>🔠 <span className="font-semibold">Braille Available:</span> {blind}</p>
            </div>
    
            {/* Vote Buttons */}
            <div className="mt-4 flex justify-around items-center">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
                    <FaRegArrowAltCircleUp className="text-lg" />
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition">
                    <FaRegArrowAltCircleDown className="text-lg" />
                </button>
            </div>
        </div>
    );
    
};
