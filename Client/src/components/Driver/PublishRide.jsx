import React, { useContext, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/ContextProvider";

const center = { lat: 48.8584, lng: 2.2945 };

export default function PublishRide() {
  const [libraries, setLibraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const { userData } = useContext(AuthContext);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(1);
  const [map, setMap] = useState(null);
  const [directionsResponses, setDirectionsResponses] = useState(null);
  const [datetime, setDatetime] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const originRef = useRef();
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  const handleDateTimeChange = (e) => {
    setDatetime(e.target.value);
  };

  const handleRouteClick = (index) => {
    setSelectedRouteIndex(index);
  };

  const handleSeatsChange = (e) => {
    setAvailableSeats(e.target.value);
  };

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    if (results.status !== "OK") {
      console.error("Error: " + results.status);
      return;
    }
    console.log(results);
    setDirectionsResponses(results);
  }

  function clearRoute() {
    setDirectionsResponses(null);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  function convertAMPMTo24Hour(time) {
    const [timePart, meridiem] = time.split(" ");
    let [hours, minutes] = timePart.split(":");

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (meridiem === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }

    // Pad single digit hours and minutes with leading zeros
    hours = hours < 10 ? "0" + hours : hours.toString();
    minutes = minutes < 10 ? "0" + minutes : minutes.toString();

    return `${hours}:${minutes}`;
  }

  async function handlePublishRide() {
    if (!directionsResponses || !datetime) return;

    try {
      const data = new Date(datetime);
      const date = data.toISOString().slice(0, 10);
      let time = data.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      time = convertAMPMTo24Hour(time);
      const totalTime =
        directionsResponses.routes[selectedRouteIndex].legs[0].duration.value;
      const totalDistance =
        directionsResponses.routes[selectedRouteIndex].legs[0].distance.value;
      const speed = totalDistance / totalTime;
      const routeData = {
        source: directionsResponses.request.origin.query,
        destination: directionsResponses.request.destination.query,
        date: date,
        time: time,
        availableSeats: availableSeats,
        totalSeats: availableSeats,
        overview_polyline:
          directionsResponses.routes[selectedRouteIndex].overview_polyline,
        unitCost: unitCost,
        vehicleType: vehicleType,
        speed,
        userData,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/rides/publishRide`,
        routeData,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("profile"))?.accessToken
            }`,
          },
        }
      );

      if (response.status === 201) {
        console.log("Ride published successfully:", response.data);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error publishing ride:", error);
    }
  }

  return (
    <div className="grid grid-cols-2 max-h-[100vh]">
      <div className="h-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mt-[80px]">
          Publish Ride
        </h1>
        <div className="w-[80%] m-auto flex p-3 flex-col mt-2 border">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex-grow">
              <Autocomplete
                apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <input
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </Autocomplete>
            </div>
            <div className="flex-grow">
              <Autocomplete
                apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <input
                  type="text"
                  placeholder="Destination"
                  ref={destiantionRef}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </Autocomplete>
            </div>
            <div>
              <label htmlFor="datetime">Select Date and Time:</label>
              <input
                type="datetime-local"
                id="datetime"
                name="datetime"
                value={datetime}
                onChange={handleDateTimeChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="seats">Available Seats:</label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={availableSeats}
                onChange={handleSeatsChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="unitCost">Unit Cost</label>
              <input
                type="number"
                id="unitCost"
                name="unitCost"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="vehicleType">Vehicle Type</label>
              <input
                type="text"
                id="vehicleType"
                name="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className=" mt-4 p-4 border w-[80%] m-auto flex flex-col gap-4">
          <div className="flex space-x-4 m-auto mt-3">
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
              onClick={calculateRoute}
            >
              Calculate Routes
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
              onClick={clearRoute}
            >
              Clear Routes
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 w-[50%] m-auto text-white rounded hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-400"
            onClick={handlePublishRide}
          >
            Publish Ride
          </button>
        </div>
        {directionsResponses && (
          <div className=" mt-4 p-4 border w-[80%] m-auto flex flex-col gap-4 overflow-y-auto h-64">
            {directionsResponses.routes.map((route, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`route${index}`}
                  name="routes"
                  value={index}
                  checked={selectedRouteIndex === index}
                  onChange={() => handleRouteClick(index)}
                  className="mr-2"
                />
                <label
                  htmlFor={`route${index}`}
                  className="flex-grow py-2 px-4 bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div className="font-semibold">{route.summary}</div>
                  <div className="text-sm text-gray-600">
                    <div>Distance: {route.legs[0].distance.text}</div>
                    <div>Duration: {route.legs[0].duration.text}</div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border border-gray-400 h-full">
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
          onLoad={(map) => setMap(map)}
        >
          {directionsResponses &&
            directionsResponses.routes.map((route, index) => (
              <DirectionsRenderer
                key={index}
                directions={{ ...directionsResponses, routes: [route] }}
                options={{
                  polylineOptions: {
                    strokeColor: "blue",
                    strokeOpacity: index === selectedRouteIndex ? 1 : 0.5,
                    strokeWeight: index === selectedRouteIndex ? 8 : 4,
                  },
                }}
                onClick={() => handleRouteClick(index)}
              />
            ))}
        </GoogleMap>
      </div>
    </div>
  );
}
