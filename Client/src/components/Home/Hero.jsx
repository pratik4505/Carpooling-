import React from "react";
import "./Hero.scss";

const Hero = () => {
  return (
    <div>
      <div className="hero__unique relative h-screen bg-cover bg-center">
        <div className="hero-overlay__unique absolute inset-0 bg-white opacity-10"></div>
        <div className="flex flex-col items-center justify-center h-full text-center">
<<<<<<< HEAD
          <div className=" w-3/4 md:w-1/2 lg:w-1/3 z-50 text-xl md:ml-[400px] lg:ml-[600px]">
            <div className="text-black text-xl md:text-3xl lg:text-5xl font-bold mb-8">
              Book Your RIDE Or Lose Your Money
            </div>
            <div className="text-black text-lg md:text-xl lg:text-2xl mb-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              iure. Ipsum maxime, quae incidunt atque corrupti vero, voluptates
              illo eligendi unde exercitationem ratione amet eos?
=======
          <div className=" w-3/4 md:w-1/2 lg:w-1/3 z-50">
            <div className="text-black text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Book your ride on LiftLink
              and Sharing Rides, Saving Miles, Building Smiles
>>>>>>> dca8007b3476b8f113531dcf48e0537db7a1d793
            </div>
            <button className="px-4 py-3 bg-[#008DDA] text-white rounded-full text-lg hover:bg-[#0400da] transition cursor-pointer duration-300">
              Book your ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
