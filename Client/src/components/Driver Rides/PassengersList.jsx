import React, { useState } from "react";
import { Link } from "react-router-dom";
import { verifyCode } from "../../Api/rideApi";
import { VerifiedIcon } from "../icons";
export default function PassengersList(props) {
  const passengers = props.data;
  const [Verify, setVerify] = useState(true);
  const [code, setCode] = useState({});

  function modifyRide(
    rides,
    rideId,
    passengerId,
    newCodeVerified,
    newRideCancelled
  ) {
    // Modify the rides array
    for (let i = 0; i < rides.length; i++) {
      if (rides[i]._id === rideId) {
        const passengers = rides[i].passengers;
        for (let j = 0; j < passengers.length; j++) {
          if (passengers[j]._id === passengerId) {
            passengers[j].codeVerified = newCodeVerified;
            passengers[j].rideCancelled = newRideCancelled;
            return; // Stop searching once passenger is modified
          }
        }
      }
    }
  }
  const sendCode = async (id) => {
    if (!code[id]) return;
    try {
      const res = await verifyCode({ _id: id, code: code[id] });
      if (!res.error) {
        const { codeVerified, rideCancelled } = res.data;
        setVerify(codeVerified);
        const rides = props.rides;
        //show a message if code verified is false
        modifyRide(rides, props.rideId, id, codeVerified, rideCancelled);

        props.updateRides(rides);
      } else {
        console.log(res.error);
      }
    } catch (error) {
      // Handle any errors that occur during the verification process
      console.error("Error:", error);
    }
  };

  return (
    <div className="h-full w-full">
      {!Verify && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Verification Code Wrong!</strong>
          <span className="block sm:inline">
            Please check the verification code and try again.
          </span>
        </div>
      )}
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
          {!value.rideCancelled && !value.codeVerified && (
            <div className="w-64 flex">
              <input
                className="border border-gray-300 rounded-l-md py-2 px-4 w-full outline-none"
                type="number"
                placeholder="Enter Code"
                onChange={(e) => {
                  setCode((prev) => ({ ...prev, [value._id]: e.target.value }));
                }}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md ml-px"
                type="button"
                onClick={() => sendCode(value._id)}
              >
                Verify
              </button>
            </div>
          )}
          {value.codeVerified && (
            <div className="flex">{<VerifiedIcon />}Verified</div>
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
