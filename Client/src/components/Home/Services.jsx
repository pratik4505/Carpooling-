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
                  Book and publish a ride and location shown using Google Maps
                  <br />
                  Cashless payment using any type of card
                  <br />
                  Rating co-riders and drivers
                  <br />
                  Chat service is available
                  <br />
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
                  Product, service, or entity is available and accessible worldwide
                  <br />
                  Payment through the card all types of card are accepeted
                  
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
                  <h3 className="title">Authorization</h3>
                  <p className="description">
                  User Registration and Verification 
                    <br />
                  Safety and Security Measures only verified drivers are only allow to publish rides.
                  <br />
                  Scheduling and Booking rides and payment refund on cancellation of ride
                  <br />
                  Safety and Security Measures and the Driving licence authentication of each Drivers
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
                  <h3 className="title">Google Maps</h3>
                  <p className="description">
                  Book rides using Google Maps and check the location of your ride.
                  Various routes are shown in Google Maps. 
                  It shows your live location.   
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
                  <h3 className="title">Chat Services</h3>
                  <p className="description">
                  Chat services allow users to communicate with each other in real-time using text-based messages
                  Share your live location through the Chats.
                  Vulgar text are not allow to send.
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
                  <h3 className="title">Payment</h3>
                  <p className="description">
                    Cashless Payment through the card accept the all type of the cards world wide
                    Contactless Payments Enable seamless online transactions through secure payment gateways
                    Offer support for multiple currencies to accommodate international transactions and cater to a diverse customer 
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
                  <h3 className="title">Rating</h3>
                  <p className="description">
                   Rate the co-riders using and the drivers on the scale of the 5.
                   Rate the co-riders and driver according to their behavior.
                   Verified drivers are only allow to publish rides
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
