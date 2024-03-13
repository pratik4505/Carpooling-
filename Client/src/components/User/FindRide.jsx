import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
  DirectionsService,
} from "@react-google-maps/api";
import { rideRequest } from "../../Api/rideApi";

const FindRide = () => {
  const [libraries, setLibraries] = useState(["places", "geometry"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [center, setCenter] = useState(null);
  const [userDirectionResponse, setUserDirectionRespone] = useState(null);
  const [directionsResponse, setDirectionResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [userSource, setUserSource] = useState(null);
  const [userDestination, setUserDestination] = useState(null);
  const sourceRef = useRef();
  const destinationRef = useRef();
  const dateRef = useRef();
  const timeFromRef = useRef();
  const timeToRef = useRef();
  console.log(availableRides);
  useEffect(() => {
    // Fetch the real-time location and set it as the center of the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  function isTimeBetween(startTime, endTime, targetTime) {
    const startSeconds = convertTimeToSeconds(startTime);
    const endSeconds = convertTimeToSeconds(endTime);
    const targetSeconds = convertTimeToSeconds(targetTime);

    return targetSeconds >= startSeconds && targetSeconds <= endSeconds;
  }
  function convertTimeToSeconds(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60;
  }
  function addTimes(time1, time2) {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);

    let totalMinutes = hours1 * 60 + minutes1 + (hours2 * 60 + minutes2);
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    // Adjust hours if minutes exceed 60
    hours += Math.floor(minutes / 60);
    minutes %= 60;

    // Ensure hours and minutes are formatted correctly
    const formattedHours = hours < 10 ? "0" + hours : hours.toString();
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();

    return `${formattedHours}:${formattedMinutes}`;
  }

  function convertSecondsToTimeString(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  }
  const displayRoute = (ride, index) => {
    console.log("The selected ride is ", ride);
    setSelectedRouteIndex(index);
    const bounds = new window.google.maps.LatLngBounds();
    ride.overview_path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);
  };
  const serachRide = async () => {
    if (sourceRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    const source = sourceRef.current.value;
    const destination = destinationRef.current.value;
    const date = dateRef.current.value;
    const timeFrom = timeFromRef.current.value;
    const timeTo = timeToRef.current.value;

    try {
      // Send request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/rides/getAvaliableRides`,
        { source, destination, date, timeFrom, timeTo },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("profile"))?.accessToken
            }`,
          },
        }
      );

      if (response.status === 200) {
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
          setUserSource(sourceLatLng);
          setUserDestination(destinationLatLng);
          let isSourceOnRoute = false;
          let isDestinationOnRoute = false;
          let distanceToSource, distanceToDestination;
          let sourceFound;
          let destinationFound;
          let distanceFromStart = 0;
          let distanceFromEnd = 0;

          routeCoordinates.forEach((point, index) => {
            if (!isSourceOnRoute) {
              if (index > 0) {
                distanceFromStart +=
                  google.maps.geometry.spherical.computeDistanceBetween(
                    point,
                    routeCoordinates[index - 1]
                  );
              }
              distanceToSource =
                google.maps.geometry.spherical.computeDistanceBetween(
                  point,
                  sourceLatLng
                );
            }
            if (!isDestinationOnRoute) {
              if (index > 0) {
                distanceFromEnd +=
                  google.maps.geometry.spherical.computeDistanceBetween(
                    point,
                    routeCoordinates[index - 1]
                  );
              }
              distanceToDestination =
                google.maps.geometry.spherical.computeDistanceBetween(
                  point,
                  destinationLatLng
                );
            }
            if (distanceToDestination < 1000) {
              destinationFound = point;
              isDestinationOnRoute = true;
              return;
            }

            if (distanceToSource < 1000) {
              sourceFound = point;
              isSourceOnRoute = true;
            }

            if (isDestinationOnRoute == true && isSourceOnRoute == false) {
              return;
            }

            // If both source and destination are found on route, exit the loop early
            if (isSourceOnRoute && isDestinationOnRoute) {
              return;
            }
          });

          // If both source and destination are on the route, add the ride to the array
          if (isSourceOnRoute && isDestinationOnRoute) {
            const startTime = timeFromRef.current.value;
            const endTime = timeToRef.current.value;
            let pickUpTime = convertSecondsToTimeString(
              distanceFromStart / ride.speed
            );
            pickUpTime = addTimes(ride.time, pickUpTime);

            if (isTimeBetween(startTime, endTime, pickUpTime)) {
              ride.pickUpTime = pickUpTime;
              ride.pickUpPoint = sourceFound;
              ride.dropOffPoint = destinationFound;
              ride.overview_path = routeCoordinates;

              // Geocode pickup point
              geocoder.geocode(
                { location: ride.pickUpPoint },
                (results, status) => {
                  if (status === "OK" && results[0]) {
                    ride.pickUpAddress = results[0].formatted_address;
                    // Geocode drop-off point
                    geocoder.geocode(
                      { location: ride.dropOffPoint },
                      (results, status) => {
                        if (status === "OK" && results[0]) {
                          ride.dropOffAddress = results[0].formatted_address;
                          // Push the ride into the array of valid routes
                          ridesWithValidRoutes.push(ride);
                          // Update state with the array of valid routes
                          setAvailableRides(ridesWithValidRoutes);
                        } else {
                          console.error(
                            "Geocode failed for drop-off point:",
                            status
                          );
                        }
                      }
                    );
                  } else {
                    console.error("Geocode failed for pickup point:", status);
                  }
                }
              );
            }
          }
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
 
  const makeRideRequest=async ()=>{
    try {
      const res = await rideRequest();
      if (!res.error) {
        
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  }

  // Geocode pickup point

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

          <div className="grid grid-cols-3 gap-4">
            <input
              type="date"
              placeholder="Date"
              ref={dateRef}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="time"
              placeholder="Time From"
              ref={timeFromRef}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <input
              type="time"
              placeholder="Time To"
              ref={timeToRef}
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
              onClick={serachRide}
            >
              Search Ride
            </button>
          </div>
        </div>
        <div className="bg-gray-200 overflow-auto">
          <div className="p-8">
            {availableRides.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Available Rides:</h2>
                <ul>
                  {availableRides.map((ride, index) => (
                    <li
                      key={index}
                      className="bg-white rounded-md shadow-md p-4 mb-4 cursor-pointer"
                      onClick={() => displayRoute(ride, index)} // Add onClick handler
                    >
                      <div className="font-bold">source: {ride.source}</div>
                      <div className="font-bold">
                        Destination: {ride.destination}
                      </div>
                      <div className="font-bold">Date: {ride.date}</div>
                      <div className="font-bold">Speed: {ride.speed}</div>
                      <div className="font-bold">
                        PickUpTime: {ride.pickUpTime}
                      </div>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                        onClick={makeRideRequest}
                      >
                        Ride request
                      </button>
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
          center={center}
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
          <Marker
            position={userSource}
            options={{
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // URL of the marker icon
              },
              label: {
                text: "User Start", // Label text
                color: "Green", // Label color
                fontSize: "20px", // Label font size
                fontWeight: "bold", // Label font weight
              },
              animation: window.google.maps.Animation.DROP, // Marker animation
            }}
          />
          <Marker position={center} />
          {/* Add marker for user destination */}
          <Marker
            position={userDestination}
            options={{
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // URL of the marker icon
              },
              label: {
                text: "User Destination", // Label text
                color: "Green", // Label color
                fontSize: "20px", // Label font size
                fontWeight: "bold", // Label font weight
              },
              animation: window.google.maps.Animation.DROP, // Marker animation
            }}
          />
          {/* selectedRouteIndex &&
          <Marker position={selectedRouteIndex[0]} />
          selectedRouteIndex &&
          <Marker position={selectedRouteIndex[selectedRouteIndex.length - 1]} /> */}
          {/* Loop through available rides and add markers for their source and destination */}
          {/* {console.log(availableRides[0].overview_path)} */}
          {availableRides.map((ride, index) => (
            <Polyline
              key={index}
              path={ride.overview_path}
              options={{
                strokeColor:
                  index === selectedRouteIndex ? "#00FF00" : "#ff3563", // Change color based on whether it is selected
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
          ))}
          {/* {directionsResponse &&
            directionsResponse.map((response, index) => (
              <Polyline
                key={index}
                path={selectedRouteIndex}
                options={{
                  strokeColor: "#ffffff",
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
            ))} */}
        </GoogleMap>
      </div>
    </div>
  );
};

export default FindRide;
