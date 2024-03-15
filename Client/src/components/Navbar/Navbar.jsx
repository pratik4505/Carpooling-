import React from "react";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div>
      <nav>
        <div class="wrapper-nav">
          <div class="logo">
            <a href="#">Logo</a>
          </div>
          <input type="radio" name="slider" id="menu-btn" />
          <input type="radio" name="slider" id="close-btn" />
          <ul class="nav-links">
            <label htmlFor="close-btn" class="btn close-btn">
              <i class="fas fa-times"></i>
            </label>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/searchride" class="desktop-item">
                Ride
              </a>
              <input type="checkbox" id="showDrop" />
              <label htmlFor="showDrop" class="mobile-item">
                Ride
              </label>
              <ul class="drop-menu">
                <li>
                  <a href="/searchride">Search Ride</a>
                </li>
                <li>
                  <a href="/pulishride">Publish Ride</a>
                </li>
                <li>
                  <a href="/driverRides">Driver Ride</a>
                </li>
                <li>
                  <a href="/">Publish Ride</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" class="desktop-item">
                Payments
              </a>
              <input type="checkbox" id="showDrop" />
              <label htmlFor="showDrop" class="mobile-item">
                Payments
              </label>
              <ul class="drop-menu">
                <li>
                  <a href="/pendingpayments">Pending Payments</a>
                </li>
                <li>
                  <a href="/transaction">Transactions</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="/chats" class="desktop-item">
                Messages
              </a>
              <input type="checkbox" id="showDrop" />
              <label htmlFor="showDrop" class="mobile-item">
                Messages
              </label>
              <ul class="drop-menu">
                <li>
                  <a href="/chats">Chats</a>
                </li>
                <li>
                  <a href="/notifications">Notificatons</a>
                </li>
              </ul>
            </li>
            {/* <li>
              <a href="#" class="desktop-item">
                Mega Menu
              </a>
              <input type="checkbox" id="showMega" />
              <label htmlFor="showMega" class="mobile-item">
                Mega Menu
              </label>
              <div class="mega-box">
                <div class="content">
                  <div class="row">
                    <img
                      src="https://fadzrinmadu.github.io/hosted-assets/responsive-mega-menu-and-dropdown-menu-using-only-html-and-css/img.jpg"
                      alt=""
                    />
                  </div>
                  <div class="row">
                    <header>Design Services</header>
                    <ul class="mega-links">
                      <li>
                        <a href="#">Graphics</a>
                      </li>
                      <li>
                        <a href="#">Vectors</a>
                      </li>
                      <li>
                        <a href="#">Business cards</a>
                      </li>
                      <li>
                        <a href="#">Custom logo</a>
                      </li>
                    </ul>
                  </div>
                  <div class="row">
                    <header>Email Services</header>
                    <ul class="mega-links">
                      <li>
                        <a href="#">Personal Email</a>
                      </li>
                      <li>
                        <a href="#">Business Email</a>
                      </li>
                      <li>
                        <a href="#">Mobile Email</a>
                      </li>
                      <li>
                        <a href="#">Web Marketing</a>
                      </li>
                    </ul>
                  </div>
                  <div class="row">
                    <header>Security services</header>
                    <ul class="mega-links">
                      <li>
                        <a href="#">Site Seal</a>
                      </li>
                      <li>
                        <a href="#">VPS Hosting</a>
                      </li>
                      <li>
                        <a href="#">Privacy Seal</a>
                      </li>
                      <li>
                        <a href="#">Website design</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li> */}
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
          <label htmlFor="menu-btn" class="btn menu-btn">
            <i class="fas fa-bars"></i>
          </label>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
