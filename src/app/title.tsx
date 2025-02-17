import React from 'react';

const Title = ({ className }: { className?: string }) => { 
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div>
        <div className={`title-container w-screen h-screen flex flex-col justify-center items-center text-white gap-6 ${className}`}>
            <div className="rounded-lg w-auto h-auto bg-black bg-opacity-10 flex flex-col justify-center items-center p-5">
                <h1 className="text-6xl md:text-9xl">B E A C O N</h1>
                <h2 className="text-xl md:text-2xl subtitle">Making lives more accessible.</h2>
            </div>
        </div>
    </div>
  );
};

export default Title;