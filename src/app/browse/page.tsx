"use client";
import Card from './card';
import Header from '../header';

export default function Browse() {
  return (    
    <div className="w-screen min-h-screen flex flex-col bg-[#FAF9F6] justify-center items-center">
        <Header />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-8 mx-12 mt-8">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    </div>
  );
}