import React, { useEffect, useState,useContext} from "react";
import { getRequests, postRequest } from "../../Api/rideApi";
import { Link } from "react-router-dom";

import GoogleMapUtil from "../GoogleMapUtil";
import { AuthContext } from "../../context/ContextProvider";

export default function Requests() {
  const [requests, setRequests] = useState(null);
  const [selectedRequests, setSelectedRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, userData } = useContext(AuthContext);

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
        setRequests(updatedRequests);
        setSelectedRequests(null);
      }
      console.log(res);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 h-[87vh]">
      <div className="border border-gray-400 h-full p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
          Ride Requests
        </h1>
        {requests &&
          Object.entries(requests).map(([key, value]) => (
            <div
              key={key}
              className="border-b border-gray-300 py-4"
             
            >
              <Link to={`/profile/${value.requesterId}`}>
                {value.requesterImageUrl && (
                  <img
                    src={value.requesterImageUrl}
                    alt="avatar"
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-1">
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
                {value.pickUpTime}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Message:</span> {value.message}
              </p>
              <p>
                <span className="font-semibold">Total Cost: </span>
                {value.seats * value.distance * value.unitCost}
              </p>
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
          ))}
      </div>
      <div className="border border-gray-400 h-full">
        {selectedRequests && (
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
            polyline={
              "a}qzCswtrNH[FaBDa@O?Q^]dAQv@O`B?jAC~CAjGCtIETGvI?Rm@Ay@C{@GiDs@IALL\\`@d@z@^bA`A`DdAvDhBrG~BvHj@`Bx@|@NL|Af@tAd@jJ~ClHhCdInCdA`@hAZpBd@dAPpEn@|Dn@nEp@`Dj@`CZtB^p@JVHlGrCnCnAlCnA|Az@j@V|Ah@rCpAxG`D~DjBlCjAjEtBzExCdEhB`ClA\\LBAJ?JDFH@L?@hBz@tCrA|@VpBXdIp@zDRpCT@A?CHILELBHHDNANGHJbEHfEFbBR`Ah@vA`ArBt@vARh@@?@?@?F@HJ?PxCnGDHB?F?HDDDBNERVz@x@rBtBpFt@lBxDzIlAtClBjFhBnEvBnFB?H@HJ@B?HAFABLf@`EtK^dANJXl@bBnFvA`Fj@bBfC~Hv@lBvArCpCnFR`@R@j@DhBLtE`@rDZdAB`@Ab@IZOVY`@oAv@qC`@eBACAEBG@C@AFs@FgB^wORyHH]p@gC}B[GCNuM"
            }
          />
        )}
      </div>
    </div>
  );
}
