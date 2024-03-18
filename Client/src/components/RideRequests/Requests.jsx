import React, { useEffect, useState, useContext } from "react";
import { getRequests, postRequest } from "../../Api/rideApi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import GoogleMapUtil from "../GoogleMapUtil";
import { AuthContext } from "../../context/ContextProvider";
import FallbackLoading from "../loader/FallbackLoading";
import { GoogleMap, Marker } from "@react-google-maps/api";

export default function Requests() {
  const [requests, setRequests] = useState(null);
  const [selectedRequests, setSelectedRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, userData } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getRequests();
        if (!res.error) {
          setRequests(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    // Get user's live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  function convertToAMPM(time) {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(":").map(Number);

    // Determine whether it's AM or PM
    const meridiem = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Format minutes with leading zero if necessary
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Construct the formatted time string
    return `${hours12}:${paddedMinutes} ${meridiem}`;
  }

  const requestHandler = async (action, key) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await postRequest(action, key);
      if (!res.error) {
        socket.emit("handleRequest", {
          action,
          sendTo: requests[key].requesterId,
          senderName: userData.name,
        });
        const updatedRequests = { ...requests };
        delete updatedRequests[key];
        toast(
          <div>
            {`Request ${action === "accept" ? "accepted" : "declined"}`}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        setRequests(updatedRequests);
        setSelectedRequests(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="grid pt-[70px] bg-white grid-cols-2 h-[100vh]">
      <div className="border border-gray-400 h-full p-4 overflow-y-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 my-2">
          Ride Requests
        </h1>
        {loading && <FallbackLoading />}
        {requests &&
          Object.entries(requests).map(([key, value]) => (
            <div key={key} className="border-b border-gray-300 py-4">
              <Link to={`/profile/${value.requesterId}`}>
                <h3 className="text-[30px]  text-left font-bold text-gray-700 mb-1">
                  {value.requesterName}
                </h3>
              </Link>
              <p>
                <span className="font-semibold">
                  Request for your ride from {value.driverSource} to{" "}
                  {value.driverDestination}
                </span>
              </p>

              <p className="text-gray-600">
                <span className="font-semibold">Seats Booked:</span>{" "}
                {value.seats}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Ride Date:</span>{" "}
                {new Date(value.pickUpDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">PickUp Time:</span>{" "}
                {convertToAMPM(value.pickUpTime)}
              </p>
              <p>
                <span className="font-semibold">Total Cost: </span>
                {(value.seats * value.distance * value.unitCost).toFixed(2)}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => requestHandler("accept", key)}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                >
                  Accept
                </button>

                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                  onClick={() => requestHandler("decline", key)}
                >
                  Decline
                </button>
                <button
                  onClick={() => setSelectedRequests(key)}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                >
                  Show on Map
                </button>
              </div>
            </div>
          ))}
      </div>
      <div className="border border-gray-400 h-full">
        {selectedRequests ? (
          <GoogleMapUtil
            coordinates={[
              {
                lat: requests[selectedRequests].pickUp.lat,
                lng: requests[selectedRequests].pickUp.lng,
              },
              {
                lat: requests[selectedRequests].destination.lat,
                lng: requests[selectedRequests].destination.lng,
              },
              // Add more coordinates as needed
            ]}
            polyline={requests[selectedRequests].overview_polyline}
          />
        ) : userLocation ? (
          <GoogleMapUtil
            coordinates={[
              userLocation,
              // Add more coordinates as needed
            ]}
          />
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}
