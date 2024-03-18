import React from "react";
import "./Hero.scss";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/searchride");
  };

  return (
    <div>
      <div className="hero__unique relative h-screen bg-cover bg-center">
        <div className="hero-overlay__unique absolute inset-0 bg-white opacity-10"></div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-1/2 lg:w-1/3 z-50 text-xl md:ml-[400px] lg:ml-[600px]">
            <div className="text-black md:text-3xl lg:text-5xl font-bold mb-8">
              Book your ride on LiftLink and Sharing Rides, Saving Miles,
              Building Smiles
            </div>
            <button
              onClick={handleClick}
              className="px-4 py-3 bg-[#008DDA] text-white rounded-full text-lg hover:bg-[#0400da] transition cursor-pointer duration-300"
            >
              Book your ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
