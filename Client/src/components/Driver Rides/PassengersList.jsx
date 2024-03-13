import React from "react";
import { Link } from "react-router-dom";
export default function PassengersList(props) {
  const passengers = props.data;
  return (
    <div className="h-full w-full">
      {passengers.map((value, key) => (
        <div key={key} className="border-b border-gray-300 py-4">
          <Link to={`/profile/${value.passengerId}`}>
            {value.passengerImageUrl && (
              <img
                src={value.passengerImageUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
            )}
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
              {value.passengerName}
            </h3>
          </Link>
          <p>
            <span className="font-semibold">
              Ride from {value.pickUpAddress} to {value.destinationAddress}
            </span>
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Seats Booked:</span> {value.seats}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Ride Date:</span>{" "}
            {new Date(value.pickUpDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">PickUp Time:</span>{" "}
            {value.pickUpTime}
          </p>

          <p>
            <span className="font-semibold">Total Cost: </span>
            {value.seats * value.distance * value.unitCost}
          </p>

          {value.rideCancelled && (
            <p>
              <span className="font-semibold">Ride is Cancelled </span>
            </p>
          )}
        </div>
      ))}
      <button
        onClick={() => props.onCancel()}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
      >
        Close
      </button>
    </div>
  );
}
