import React, { useRef, useState } from "react";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";

const FindRide = () => {
  const [libraries, setLibraries] = useState(["places", "geometry"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [directionsResponse, setDirectionResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [availableRides, setAvailableRides] = useState([]);
  const sourceRef = useRef();
  const destinationRef = useRef();
  const dateTimeRef = useRef();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center = { lat: 48.8584, lng: 2.2945 };
  const displayRoute = (ride) => {
    console.log("The selected ride is ", ride);
    const { overview_path } = ride;

    // Create a new Polyline instance

    const routePolyline = new window.google.maps.Polyline({
      path: overview_path,
      geodesic: true,
      strokeColor: "#FF0000", // Color of the polyline
      strokeOpacity: 1.0,
      strokeWeight: 3, // Thickness of the polyline
    });

    // Set the polyline on the map
    routePolyline.setMap(map);
  };
  const serachRide = async () => {
    if (sourceRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const source = sourceRef.current.value;
    const destination = destinationRef.current.value;
    const dateTime = new Date(dateTimeRef.current.value);
    const date = dateTime.toISOString().slice(0, 10);

    try {
      // Send request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/rides/getAvaliableRides`,
        { source, destination, date }
      );

      if (response.status === 200) {
        console.log("Available rides:", response.data);

        // Initialize array to hold rides with valid routes
        const ridesWithValidRoutes = [];

        // Iterate through each ride in the response array
        for (const ride of response.data) {
          // Parse the overview polyline from the backend response
          const { overview_polyline } = ride;
          // eslint-disable-next-line no-undef
          const routeCoordinates =
            google.maps.geometry.encoding.decodePath(overview_polyline);

          // Geocode source and destination addresses to get their coordinates
          // eslint-disable-next-line no-undef
          const geocoder = new google.maps.Geocoder();
          const sourceResult = await geocoder.geocode({ address: source });
          const destinationResult = await geocoder.geocode({
            address: destination,
          });

          const sourceLatLng = sourceResult.results[0].geometry.location;
          const destinationLatLng =
            destinationResult.results[0].geometry.location;
          // Check if the source and destination points are on the route

          const isSourceOnRoute = routeCoordinates.some((point) => {
            // eslint-disable-next-line no-undef
            const distance =
              google.maps.geometry.spherical.computeDistanceBetween(
                point,
                sourceLatLng
              );
            return distance < 1000; // Define your threshold distance here
          });

          const isDestinationOnRoute = routeCoordinates.some((point) => {
            const distance =
              google.maps.geometry.spherical.computeDistanceBetween(
                point,
                destinationLatLng
              );
            return distance < 10000; // Define your threshold distance here
          });

          // If both source and destination are on the route, add the ride to the array
          if (isSourceOnRoute && isDestinationOnRoute) {
            ride.overview_path = routeCoordinates;
            ridesWithValidRoutes.push(ride);
          }
          console.log(ride.overview_path);
        }

        // Update state with rides that have valid routes
        setAvailableRides(ridesWithValidRoutes);

        // rest of the code...
      } else {
        console.error("Failed to fetch available rides");
        // Handle error
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    sourceRef.current.value = "";
    destinationRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-2 h-[100vh]">
      <div className="h-full white">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-2">
          Search Ride
        </h1>
        <div className="w-4/5 mx-auto flex flex-col space-y-4 my-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex-grow">
              <Autocomplete
                apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <input
                  type="text"
                  placeholder="source"
                  ref={sourceRef}
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
                  ref={destinationRef}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </Autocomplete>
            </div>
          </div>

          <input
            type="datetime-local"
            placeholder="Date and time"
            ref={dateTimeRef}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          />

          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
              onClick={serachRide}
            >
              Search Ride
            </button>
          </div>
        </div>
        <div className="h-full bg-gray-200 overflow-auto">
          <div className="p-8">
            {availableRides.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Available Rides:</h2>
                <ul>
                  {availableRides.map((ride, index) => (
                    <li
                      key={index}
                      className="bg-white rounded-md shadow-md p-4 mb-4 cursor-pointer"
                    >
                      <div className="font-bold">source: {ride.source}</div>
                      <div className="font-bold">
                        Destination: {ride.destination}
                      </div>
                      <div className="font-bold">Date: {ride.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center">No available rides found.</div>
            )}
          </div>
        </div>
      </div>
      <div className="border border-gray-400 h-full">
        <GoogleMap
          //center={center}
          center={{ lat: -36.73550441, lng: 144.25178598 }}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(loaded) => setMap(loaded)}
        >
          <Polyline
            path={[
              {
                lat: 10.16253,
                lng: 76.64098000000001,
              },
              { lat: -36.73590441, lng: 144.25178198 },
            ]}
            options={{
              strokeColor: "#ff2343",
              strokeOpacity: "1.0",
              strokeWeight: 2,
              icons: [
                {
                  icon: "hello",
                  offset: "0",
                  repeat: "10px",
                },
              ],
            }}
          />
          {directionsResponse &&
            directionsResponse.map((response, index) => (
              <Polyline
                key={index}
                path={response.overview_path}
                options={{
                  strokeColor: "#ff2343",
                  strokeOpacity: "2.0",
                  strokeWeight: 3,
                  icons: [
                    {
                      icon: "hello",
                      offset: "0",
                      repeat: "10px",
                    },
                  ],
                }}
              />
            ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default FindRide;
