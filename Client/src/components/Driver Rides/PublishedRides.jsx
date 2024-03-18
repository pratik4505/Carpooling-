import React, { useState, useEffect } from "react";
import { getDriverRides } from "../../Api/rideApi";
import GoogleMapUtil from "../GoogleMapUtil";
import PassengersList from "./PassengersList";
import RatingList from "../Booked Rides/RatingList";
import { toast } from "react-toastify";
import FallbackLoading from "../loader/FallbackLoading";
import { cancelPublishedRide } from "../../Api/rideApi";
import { GoogleMap, Marker } from "@react-google-maps/api";
export default function PublishedRides() {
  const [rides, setRides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [passengers, setPassengers] = useState(null);
  const [rating, setRating] = useState(null);
  const [reload, setReload] = useState(false);
  const [center, setCenter] = useState(null);
  useEffect(() => {
    // Get user's live location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getDriverRides();
        if (!res.error) {
          setRides(res.data);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, [reload]);
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
  const cancellationHandler = async (rideId) => {
    setLoading(true);
    try {
      const res = await cancelPublishedRide(rideId);
      // Handle success response if needed
      toast(
        <div className="border border-blue-500 text-blue-500 font-semibold rounded-md p-4 shadow-md bg-transparent">
          {res.message}
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
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error cancelling ride:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white pt-[70px] grid grid-cols-2 h-[100vh]">
      <div className="border border-gray-400 h-full p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
          Driver Rides
        </h1>
        {loading && <FallbackLoading />}
        {rides &&
          rides.map((value, key) => (
            <div key={key} className="border-b border-gray-300 py-4">
              <p>
                <span className="font-semibold">
                  Ride is from {value.source} to {value.destination}
                </span>
              </p>

              <p className="text-gray-600">
                <span className="font-semibold">Ride Date:</span>{" "}
                {new Date(value.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Start Time:</span>{" "}
                {convertToAMPM(value.time)}
              </p>

              {/* commented one is the main code ,next one is for testing */}
              {/* {!value.rideCancelled && value.codeVerified && (
                <button
                  onClick={() => {
                    setRating(value.passengers);
                  }}
                  onc
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                >
                  Rate Passengers
                </button>
              )} */}
              <div className="flex gap-2">
                {
                  <button
                    onClick={() => {
                      setRating(value.passengers);
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                  >
                    Rate Passengers
                  </button>
                }
                {!value.rideCancelled && !value.codeVerified && (
                  <button
                    onClick={() => cancellationHandler(value._id)}
                    className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                  >
                    Cancel Ride
                  </button>
                )}
                <button
                  onClick={() => setSelectedRide(value)}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                >
                  Show on Map
                </button>
                <button
                  onClick={() => setPassengers(value)}
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                >
                  Passengers
                </button>
              </div>
            </div>
          ))}
      </div>
      {rating && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex container mt-8">
              <RatingList
                passengers={rating}
                onCancel={() => setRating(null)}
              />
            </div>
          </div>
        </div>
      )}
      {passengers && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex container mt-8">
              <PassengersList
                rides={rides}
                rideId={passengers._id}
                updateRides={(data) => setRides(data)}
                data={passengers.passengers}
                onCancel={() => setPassengers(null)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="border border-gray-400 h-full">
        {selectedRide ? (
          <GoogleMapUtil
            coordinates={selectedRide.passengers.map((value) => value.pickUp)}
            polyline={selectedRide.overview_polyline}
          />
        ) : center ? (
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}
