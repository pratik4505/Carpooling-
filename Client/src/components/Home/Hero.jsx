import React from "react";
import "./Hero.scss";

const Hero = () => {
  return (
    <div>
      <div class="hero__unique relative h-screen bg-cover bg-center">
        <div class="hero-overlay__unique absolute inset-0 bg-black opacity-10"></div>
        <div class="flex flex-col items-center justify-center h-full text-center">
          <div class="w-3/4 md:w-1/2 lg:w-1/3">
            <div class="text-black text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
              Book Your RIDE Or Lose Your Money
            </div>
            <div class="text-black text-lg md:text-xl lg:text-2xl mb-12">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              iure. Ipsum maxime, quae incidunt atque corrupti vero, voluptates
              illo eligendi unde exercitationem ratione amet eos?
            </div>
            <button class="px-6 py-3 bg-green-500 text-white rounded-full text-lg hover:bg-green-600 transition duration-300">
              Book your ride
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
