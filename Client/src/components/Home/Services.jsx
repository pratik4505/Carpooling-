import React from "react";
import "./Services.scss";

const Services = () => {
  return (
    <div className="">
      <section className="section-services ">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-md-10 col-lg-8">
              <div className="header-section">
                <h2 className="title">Exclusive Services</h2>
                <p className="description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Curabitur malesuada fermentum purus, eu volutpat nisi laoreet
                  id. Phasellus fringilla accumsan metus, at tempor est
                  hendrerit et.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-battle-net"></i>
                  </span>
                  <h3 className="title">Global coverage</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-asymmetrik"></i>
                  </span>
                  <h3 className="title">It Management</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-artstation"></i>
                  </span>
                  <h3 className="title">Software Development</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fab fa-500px"></i>
                  </span>
                  <h3 className="title">Brand Strategy</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            {/* <!-- / End Single Service --> */}
            {/* <!-- Single Service --> */}
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fas fa-chart-pie"></i>
                  </span>
                  <h3 className="title">Business Consulting</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="single-service">
                <div className="content">
                  <span className="icon">
                    <i className="fas fa-laptop-code"></i>
                  </span>
                  <h3 className="title">Website Design</h3>
                  <p className="description">
                    Mauris volutpat urna tristique finibus iaculis. Morbi
                    facilisis, justo eu vulputate elementum, est augue tincidunt
                    ante, sed efficitur leo ligula vel velit.
                  </p>
                  <a href="#" className="learn-more">
                    Learn More
                  </a>
                </div>
                <span className="circle-before"></span>
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
