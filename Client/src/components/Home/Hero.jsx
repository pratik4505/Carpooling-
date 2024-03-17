import React from "react";
import "./Hero.scss";

const Hero = () => {
  return (
    <div>
      <div className="hero__unique relative h-screen bg-cover bg-center">
        <div className="hero-overlay__unique absolute inset-0 bg-black opacity-10"></div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-3/4 md:w-1/2 lg:w-1/3 z-50">
            <div className="text-black text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Book your ride on LiftLink
              and Sharing Rides, Saving Miles, Building Smiles
            </div>
            <button className="px-6 py-3 bg-green-500 text-white rounded-full text-lg hover:bg-green-600 transition cursor-pointer duration-300">
              Book your ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
