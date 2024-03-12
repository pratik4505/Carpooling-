import React, { useEffect, useState } from "react";
import { getCoRiders, postRatings } from "../../Api/rideApi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RatingList({ rideId, passengers, driver, onCancel }) {
  const [loading, setLoading] = useState(true);
  const [coriders, setCoriders] = useState(passengers);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (data) return;
    const fetchRequests = async () => {
      try {
        const res = await getCoRiders(rideId);
        if (!res.error) {
          setCoriders(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching coRiders:", error);
      }
    };
    fetchRequests();
  }, [rideId, data]);

  const handleRatingChange = (Id, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [Id]: {
        ...prevRatings[Id],
        rating: value,
      },
    }));
  };

  const handleDescriptionChange = (Id, event) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [Id]: {
        ...prevRatings[Id],
        description: event.target.value,
      },
    }));
  };

  const submitRatings = async () => {
    setLoading(true);

    if (Object.keys(ratings).length === 0 && ratings.constructor === Object) {
      onCancel();
    }

    try {
      const res = await postRatings(ratings);
      if (!res.error) {
        onCancel();
      }
    } catch (error) {
      console.error("Error fetching coRiders:", error);
    }
  };

  return (
    <div className="h-full w-full">
      <h1 className="text-2xl font-bold text-center text-gray-800 my-2">
        Rate Co-Riders
      </h1>
      {driver && (
        <div>
          <Link to={`/profile/${driver.driverId}`}>
            {driver.driverImageUrl && (
              <img
                src={driver.driverImageUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full mx-auto mb-2"
              />
            )}
            <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
              {driver.driverName}
            </h3>
          </Link>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  onClick={() => handleRatingChange(driver.driverPastId, value)}
                  className="sr-only"
                />
                <FaStar
                  className={`text-yellow-400 ${
                    value <= (ratings[driver.driverPastId]?.rating || 0)
                      ? "fill-current"
                      : ""
                  }`}
                />
              </label>
            ))}
          </div>
          <textarea
            value={ratings[driver.driverPastId]?.description || ""}
            onChange={(event) =>
              handleDescriptionChange(driver.driverPastId, event)
            }
            rows={3}
            cols={50}
            placeholder="Enter your description here..."
          />
        </div>
      )}
      {coriders &&
        coriders.map((data) => (
          <div key={data.pastRideId}>
            <Link to={`/profile/${data.passengerId}`}>
              {data.passengerImageUrl && (
                <img
                  src={data.passengerImageUrl}
                  alt="avatar"
                  className="w-12 h-12 rounded-full mx-auto mb-2"
                />
              )}
              <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
                {data.passengerName}
              </h3>
            </Link>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    onClick={() => handleRatingChange(data.pastRideId, value)}
                    className="sr-only"
                  />
                  <FaStar
                    className={`text-yellow-400 ${
                      value <= (ratings[data.pastRideId]?.rating || 0)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </label>
              ))}
            </div>
            <textarea
              value={ratings[data.pastRideId]?.description || ""}
              onChange={(event) =>
                handleDescriptionChange(data.pastRideId, event)
              }
              rows={3}
              cols={50}
              placeholder="Enter your description here..."
            />
          </div>
        ))}
      <button
        onClick={submitRatings}
        disabled={loading}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
      >
        Submit
      </button>
      <button
        onClick={() => onCancel()}
        disabled={loading}
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
      >
        Close
      </button>
    </div>
  );
}
