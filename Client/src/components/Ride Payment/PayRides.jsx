import React, { useState, useEffect, useContext } from "react";
import {
  getAcceptedRides,
  postDeclinePayment,
  getPaymentIntent,
} from "../../Api/rideApi";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/ContextProvider";
import FallbackLoading from "../loader/FallbackLoading";

export default function PayRides() {
  const [rides, setRides] = useState(null);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await getAcceptedRides();
        if (!res.error) {
          setRides(res.data);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
      setLoading(false);
    };
    fetchRides();
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

  const payHandler = async (key) => {
    const value = rides[key];
    const data = {
      key: key,
      amount: value.seats * value.distance * value.unitCost,
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
      const form = document.createElement("form");
      form.action = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/payment/create-checkout-session`;
      form.method = "POST";

      // Append hidden input fields for each key-value pair in formData
      for (const [name, value] of Object.entries(formData)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      }

      // Append the form to the document body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error handling form submit:", error);
    }
  };

  const declinePayment = async (key) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await postDeclinePayment(key);
      if (!res.error) {
        const updatedRides = { ...rides };
        toast(<div>Payment Request Declined</div>, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        delete updatedRides[key];
        setRides(updatedRides);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error declining payment:", error);
    }
  };

  return (
    <div className="pt-[70px] border bg-white border-gray-400 h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
        Pending Payments
      </h1>
      {loading && <FallbackLoading />}
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
              {convertToAMPM(value.pickUpTime)}
            </p>
            <p>
              <span className="font-semibold">Total Cost: </span>
              {(value.seats * value.distance * value.unitCost).toFixed(2)}
            </p>
            <div className="flex gap-3">
              <form onSubmit={(e) => handleFormSubmit(e, key)}>
                <button
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                  type="submit"
                >
                  Checkout
                </button>
              </form>
              <button
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
                onClick={() => declinePayment(key)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
