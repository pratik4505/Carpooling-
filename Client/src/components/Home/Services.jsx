import React from "react";
import "./Services.scss";

const Services = () => {
  return (
    <div>
      <section class="section-services">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-md-10 col-lg-8">
              <div class="header-section">
                <h2 class="title">Exclusive Services</h2>
                <p class="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur malesuada fermentum purus, eu volutpat nisi laoreet
                  id. Phasellus fringilla accumsan metus, at tempor est
                  hendrerit et.
                </p>
              </div>
            </div>
          </div>
          <div class="row">
            {/* <!-- Single Service --> */}
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fab fa-battle-net"></i>
                  </span>
                  <h3 class="title">Global coverage</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fab fa-asymmetrik"></i>
                  </span>
                  <h3 class="title">It Management</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fab fa-artstation"></i>
                  </span>
                  <h3 class="title">Software Development</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fab fa-500px"></i>
                  </span>
                  <h3 class="title">Brand Strategy</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fas fa-chart-pie"></i>
                  </span>
                  <h3 class="title">Business Consulting</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            <div class="col-md-6 col-lg-4">
              <div class="single-service">
                <div class="content">
                  <span class="icon">
                    <i class="fas fa-laptop-code"></i>
                  </span>
                  <h3 class="title">Website Design</h3>
                  <p class="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" class="learn-more">
                    Learn More
                  </a>
                </div>
                <span class="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
