import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div id="AboutUs" class="responsive-container-block bigContainer">
      <div class="responsive-container-block Container">
        <p class="text-blk heading">About Us</p>
        <p class="text-blk subHeading">
        Welcome to LiftLink
        we're passionate about transforming the way people commute.
        Our platform is dedicated to revolutionizing the concept of carpooling, making it easier, more efficient, and environmentally friendly.
        Whether you're a daily commuter, an occasional traveler, or someone looking to share the journey, we've got you covered
        </p>
        <div class="social-icons-container">
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb33.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb34.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb35.png"
            />
          </a>
          <a class="social-icon">
            <img
              class="socialIcon image-block"
              src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/bb36.png"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
