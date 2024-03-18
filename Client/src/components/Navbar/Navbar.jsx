import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/ContextProvider";
import NotificationDialog from "../Notifications/NotificationDialog";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const userData = JSON.parse(localStorage.getItem("profile"));
  const { signOut, wallet } = useContext(AuthContext);
  const notificationRef = useRef(null);
  const handleNotificationClick = () => {
    setShowNotification(!showNotification);
  };
  const handleOutsideClick = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotification(false);
    }
  };
  useEffect(() => {
    if (showNotification) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showNotification]);
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
              <Link className="desktop-item" to="/">
                Home
              </Link>
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
              <input type="checkbox" id="showsDrop" />
              <label htmlFor="showsDrop" className="mobile-item">
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
            <li>
              <Link className="desktop-item" to="/riderequests">
                Ride Requests
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="relative desktop-item"
                onClick={handleNotificationClick}
              >
                Notifications
              </Link>
              {showNotification && (
                <div
                  ref={notificationRef}
                  className="absolute top-[70px] right-10 notification-dialog"
                >
                  {/* Content of your notification dialog */}
                  <NotificationDialog onClose={handleNotificationClick} />
                </div>
              )}
            </li>
            <li>
              <Link className="desktop-item" to={`/profile/${userData.userId}`}>
                {/* {userData && (
                  <img
                    src={`${BASE_URL}/${userData.imageUrl}`}
                    className="w-12 h-12 mr-4 rounded-full"
                    alt="profile"
                    style={{ borderRadius: "50%" }}
                  />
                )} */}
                Profile
              </Link>
              <input type="checkbox" id="showProfile" />
              <label htmlFor="showProfile" className="mobile-item">
                Profile
              </label>
              <ul className="drop-menu">
                <li>
                  <Link to={`/profile/${userData.userId}`}>My Profile</Link>
                </li>
                <li onClick={signOut}>
                  <Link className="desktop-item" to={`/login`}>
                    {" "}
                    Sign Out
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <Link className="desktop-item" to={`/profile/${userData.userId}`}>
                Profile
              </Link>
            </li>
            <li onClick={signOut}>
              <Link className="desktop-item" to={`/login`}>
                {" "}
                Sign Out
              </Link>
            </li> */}
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
