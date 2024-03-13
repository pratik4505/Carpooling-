import React, { useState, useEffect, useContext } from "react";
import {
  getAcceptedRides,
  postDeclinePayment,
  getPaymentIntent,
} from "../../Api/rideApi";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { AuthContext } from "../../context/ContextProvider";

export default function PayRides() {
  const [rides, setRides] = useState(null);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

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
    if (loading) return;

    setLoading(true);
    try {
      const value = rides[key];
      const result = await getPaymentIntent({
        key: key,
        amount: 1.2 * value.seats * value.distance * value.unitCost,
        description: `Pay for your ride from ${value.pickUpAddress} to ${value.destinationAddress}`,
        email: userData.emailId,
        userId: userData.userId,
      });
      setLoading(false);
      setClientSecret(result.data?.clientSecret);
    } catch (error) {
      console.error("Error fetching payment intent:", error);
    }
  };

  const declinePayment = async (key) => {
    if (loading) return;
    try {
      setLoading(true);
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

  useEffect(() => {
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setStripePromise(loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY));
    }
  }, []);

  return (
    <div className="border border-gray-400 h-full p-4 overflow-y-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
        Book your rides
      </h1>
      {clientSecret && stripePromise && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex container mt-8">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  onCancel={() => {
                    setClientSecret(null);
                  }}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}

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
            <button
              onClick={() => payHandler(key)}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
            >
              Pay
            </button>
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
