import React, { useState, useEffect, useContext } from "react";
import {
  getAcceptedRides,
  postDeclinePayment,
  getPaymentIntent,
} from "../../Api/rideApi";

import { AuthContext } from "../../context/ContextProvider";

export default function PayRides() {
  const [rides, setRides] = useState(null);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getAcceptedRides();
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

  const payHandler = async (key) => {
    const value = rides[key];
    const data = {
      key: key,
      amount: 1.2 * value.seats * value.distance * value.unitCost,
      description: `Pay for your ride from ${value.pickUpAddress} to ${value.destinationAddress}`,
      email: userData.emailId,
      userId: userData.userId,
    };

    return data;
  };
  const handleFormSubmit = async (e, key) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const formData = await payHandler(key); // Get data from payHandler
      // Create a new form
      const form = document.createElement('form');
      form.action = `${import.meta.env.VITE_SERVER_BASE_URL}/payment/create-checkout-session`;
      form.method = 'POST';

      // Append hidden input fields for each key-value pair in formData
      for (const [name, value] of Object.entries(formData)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }

      // Append the form to the document body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Error handling form submit:', error);
    }
  };

  const declinePayment = async (key) => {
    if (loading) return;
    try {
      // setLoading(true);
      const res = await postDeclinePayment(key);
      if (!res.error) {
        const updatedRides = { ...rides };
        delete updatedRides[key];
        setRides(updatedRides);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error declining payment:", error);
    }
  };

  return (
    <div className="border border-gray-400 h-full p-4 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
        Book your rides
      </h1>

      {rides &&
        Object.entries(rides).map(([key, value]) => (
          <div key={key} className="border-b border-gray-300 py-4">
            <p>
              <span className="font-semibold">
                Pay for your ride from {value.pickUpAddress} to{" "}
                {value.destinationAddress}
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
              {1.2 * value.seats * value.distance * value.unitCost}
            </p>
            <form onSubmit={(e) => handleFormSubmit(e, key)}>
              <button  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400" type="submit">Checkout</button>
            </form>
            <button
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
              onClick={() => declinePayment(key)}
            >
              Decline
            </button>
          </div>
        ))}
    </div>
  );
}
