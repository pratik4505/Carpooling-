import React, { useState, useEffect } from "react";
import { getBookedRides } from "../../Api/rideApi";
import GoogleMapUtil from "../GoogleMapUtil";
import RatingList from "./RatingList";
export default function PassengerRides() {
  const [rides, setRides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getBookedRides();
        if (!res.error) {
          setRides(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);
  return (
    <div className="grid grid-cols-2 h-[87vh]">
      <div className="border border-gray-400 h-full p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
          Booked Rides
        </h1>
        {rides &&
          rides.map((value, key) => (
            <div key={key} className="border-b border-gray-300 py-4">
              <p>
                <span className="font-semibold">
                  Ride is from {value.pickUpAddress} to{" "}
                  {value.destinationAddress}
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
                {value.pickUpTime}
              </p>
              {!value.codeVerified && (
                <p className="text-gray-600">
                  <span className="font-semibold">Verification code:</span>{" "}
                  {value.verificationCode}
                </p>
              )}

              <p className="text-gray-600">
                <span className="font-semibold">Vehicle Type:</span>{" "}
                {value.vehicleType}
              </p>

              {!value.rideCancelled &&
                value.codeVerified &&
                 (
                  <button
                    onClick={() => {
                      setRating(value);
                    }}
                    className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                  >
                    Rate Co-riders
                  </button>
                )}

              {!value.rideCancelled && !value.codeVerified && (
                <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400">
                  Cancel Ride
                </button>
              )}
              <button
                onClick={() => setSelectedRide(value)}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
              >
                Show on Map
              </button>
            </div>
          ))}
      </div>
      {rating && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex container mt-8">
              <RatingList rideId={rating.rideId} driver={rating} onCancel={() => setRating(null)} />
            </div>
          </div>
        </div>
      )}
      <div className="border border-gray-400 h-full">
        {selectedRide && (
          <GoogleMapUtil
            coordinates={[selectedRide.pickUp, selectedRide.destination]}
            polyline={selectedRide.overview_polyline}
          />
        )}
      </div>
    </div>
  );
}
