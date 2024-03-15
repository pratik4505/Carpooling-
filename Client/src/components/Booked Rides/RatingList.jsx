import React, { useEffect, useState } from "react";
import { getCoRiders, postRatings } from "../../Api/rideApi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RatingList({ rideId, passengers, driver, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [coriders, setCoriders] = useState(passengers);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    if (passengers) return;
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
  }, [rideId, passengers]);

  const handleRatingChange = (Id, value) => {
    console.log(value)
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
              {driver.driverName}(Driver)
            </h3>
          </Link>
          <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star cursor-pointer"
          style={{
            color: ratings[driver.driverPastId]?.rating  >= star ? "gold" : "gray",
            fontSize: "35px",
          }}
          onClick={() => {
            
            handleRatingChange(driver.driverPastId, star);
          }}
        >
          {" "}
          ★{" "}
        </span>
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
            <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star cursor-pointer"
          style={{
            color: ratings[data.pastRideId]?.rating  >= star ? "gold" : "gray",
            fontSize: "35px",
          }}
          onClick={() => handleRatingChange(data.pastRideId, star)}
        >
          {" "}
          ★{" "}
        </span>
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
