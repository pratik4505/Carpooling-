import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommonLoading from "../loader/CommonLoading";
import { getLatestNotifications } from "../../Api/userApi";
import "./Notification.scss";

const NotificationDialog = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotify = async () => {
    try {
      const response = await getLatestNotifications();
      if (!response.error) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error loading Latest notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotify();
  }, []);

  if (loading) {
    return <CommonLoading />;
  }

  return (
    <div className="rounded-lg bg-black relative top-0">
      {/* Dialog box content */}
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`border rounded-lg p-2  ${
            notification.seen ? "bg-blue-100" : "bg-blue-500"
          }`}
        >
          <h3 className="font-bold text-lg ">{notification.title}</h3>
          <p className="text-gray-700">{notification.description}</p>
        </div>
      ))}
      <Link className="p-0 w-[100%]" to="/notifications">
        <button className="w-[100%] font-black" onClick={onClose}>
          View All Notifications
        </button>
      </Link>
    </div>
  );
};

export default NotificationDialog;
