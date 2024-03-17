import React, { useEffect, useState } from "react";
import { getNotifications } from "../../Api/userApi";
import CommonLoading from "../loader/CommonLoading";

export default function MainNotification() {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNotify = async () => {
    try {
      const response = await getNotifications();

      if (!response.error) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
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
    <div className="max-w-lg mx-auto pt-[70px]">
      <h1 className="text-3xl font-bold mb-8 text-center">Notifications</h1>
      <div>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`border rounded-lg p-6 mb-6 ${
              notification.seen ? "bg-gray-100" : "bg-blue-100"
            }`}
          >
            <h3 className="font-bold text-xl mb-2">{notification.title}</h3>
            <p className="text-gray-700">{notification.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
