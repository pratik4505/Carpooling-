import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div id="AboutUs" class="responsive-container-block bigContainer">
      <div class="responsive-container-block Container">
        <p class="text-blk heading">About Us</p>
        <p class="text-blk subHeading">
          Welcome to the Imperial Mess Administration's Mess Complaint
          Association! We are a dedicated team committed to addressing and
          resolving mess-related issues on a global scale. With our roots firmly
          embedded in a passion for cleanliness and order, our association was
          established to provide individuals and communities around the world a
          platform to voice their concerns about mess, clutter, and disarray.
          Our mission is to empower people to take action against disorder,
          fostering cleaner and more organized environments for all. Through a
          collaborative effort, we aim to make the world a tidier and more
          pleasant place to live, work, and thrive. Join us in our journey to
          combat mess and promote a cleaner, more organized world for
          generations to come. Together, we can create a cleaner and more
          organized future.
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
