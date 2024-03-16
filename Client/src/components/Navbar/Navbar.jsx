import React, { useContext } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/ContextProvider";

const Navbar = () => {
  const userData = JSON.parse(localStorage.getItem("profile"));
  const {signOut}=useContext(AuthContext)
  return (
    <div>
      <nav>
        <div className="wrapper-nav">
          <div className="logo">
            <Link to="#">Logo</Link>
          </div>
          <input type="radio" name="slider" id="menu-btn" />
          <input type="radio" name="slider" id="close-btn" />
          <ul className="nav-links">
            <label htmlFor="close-btn" className="btn close-btn">
              <i className="fas fa-times"></i>
            </label>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/searchride" className="desktop-item">
                Ride
              </Link>
              <input type="checkbox" id="showDrop" />
              <label htmlFor="showDrop" className="mobile-item">
                Ride
              </label>
              <ul className="drop-menu">
                <li>
                  <Link to="/searchride">Search Ride</Link>
                </li>
                <li>
                  <Link to="/publishride">Publish Ride</Link>
                </li>
                <li>
                  <Link to="/driverRides">Driver Ride</Link>
                </li>
                <li>
                  <Link to="/bookedrides">Booked Ride</Link>
                </li>
                <li>
                  <Link to="/pastrides">Past Ride</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="#" className="desktop-item">
                Payments
              </Link>
              <input type="checkbox" id="showDrop" />
              <label htmlFor="showDrop" className="mobile-item">
                Payments
              </label>
              <ul className="drop-menu">
                <li>
                  <Link to="/pendingpayments">Pending Payments</Link>
                </li>
                <li>
                  <Link to="/transactions">Transactions</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/chats" className="desktop-item">
                Chats
              </Link>
            </li>
            
            {/* <li>
              <Link to="#" className="desktop-item">
                Mega Menu
              </Link>
              <input type="checkbox" id="showMega" />
              <label htmlFor="showMega" className="mobile-item">
                Mega Menu
              </label>
              <div className="mega-box">
                <div className="content">
                  <div className="row">
                    <img
                      src="https://fadzrinmadu.github.io/hosted-assets/responsive-mega-menu-and-dropdown-menu-using-only-html-and-css/img.jpg"
                      alt=""
                    />
                  </div>
                  <div className="row">
                    <header>Design Services</header>
                    <ul className="mega-links">
                      <li>
                        <Link to="#">Graphics</Link>
                      </li>
                      <li>
                        <Link to="#">Vectors</Link>
                      </li>
                      <li>
                        <Link to="#">Business cards</Link>
                      </li>
                      <li>
                        <Link to="#">Custom logo</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="row">
                    <header>Email Services</header>
                    <ul className="mega-links">
                      <li>
                        <Link to="#">Personal Email</Link>
                      </li>
                      <li>
                        <Link to="#">Business Email</Link>
                      </li>
                      <li>
                        <Link to="#">Mobile Email</Link>
                      </li>
                      <li>
                        <Link to="#">Web Marketing</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="row">
                    <header>Security services</header>
                    <ul className="mega-links">
                      <li>
                        <Link to="#">Site Seal</Link>
                      </li>
                      <li>
                        <Link to="#">VPS Hosting</Link>
                      </li>
                      <li>
                        <Link to="#">Privacy Seal</Link>
                      </li>
                      <li>
                        <Link to="#">Website design</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li> */}
            <li>
              <Link to="/riderequests">Ride Requests</Link>
            </li>
            <li>
              <Link to="/notifications">Notifications</Link>
            </li>
            <li>
              <Link to={`/profile/${userData.userId}`}>Profile</Link>
            </li>
            <li onClick={signOut}>
            <Link to={`/login`}> Sign Out</Link>
            </li>
          </ul>
          <label htmlFor="menu-btn" className="btn menu-btn">
            <i className="fas fa-bars"></i>
          </label>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
