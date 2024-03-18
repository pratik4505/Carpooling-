import React, { useRef, useContext, useState, useEffect } from "react";
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
import { AuthContext } from "../../context/ContextProvider";
import { ChatContext } from "../../context/ChatProvider";
import FallbackLoading from "../loader/FallbackLoading";
import { toast } from "react-toastify";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
const FindRide = () => {
  const { userData, isLoaded } = useContext(AuthContext);
  const { chatAdder } = useContext(ChatContext);
  const [center, setCenter] = useState(null);
  const [finalAns, setFinalAns] = useState(null);
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
  const seatsRef = useRef();
  const [isSearching, setIsSearching] = useState(false);
  //console.log(availableRides);
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
    return <FallbackLoading />;
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
    //console.log("The selected ride is ", ride);
    setSelectedRouteIndex(index);
    const bounds = new window.google.maps.LatLngBounds();
    ride.overview_path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds);
  };
  function formatDate(dateString) {
    return new Date(dateString).toISOString().split("T")[0];
  }

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

  const searchRide = async () => {
    if (
      sourceRef.current.value === "" ||
      destinationRef.current.value === "" ||
      seatsRef.current.value === "" ||
      timeFromRef.current.value === "" ||
      timeToRef.current.value === "" ||
      dateRef.current.value === ""
    ) {
      toast(
        <div className="border border-blue-500 text-blue-500 font-semibold rounded-md shadow-md">
          Please Fill All The Details To Proceed
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setIsSearching(true);
    const source = sourceRef.current.value;
    const destination = destinationRef.current.value;
    const date = dateRef.current.value;
    const timeFrom = timeFromRef.current.value;
    const timeTo = timeToRef.current.value;
    const seats = seatsRef.current.value;

    try {
      // Send request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/rides/getAvaliableRides`,
        { date, seats },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("profile"))?.accessToken
            }`,
          },
        }
      );

      if (response.status === 200) {
        console.log("The response from the database is ", response);
        // Initialize array to hold rides with valid routes
        const ridesWithValidRoutes = [];
        var rideFound = false;
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
              distanceFromStart / (ride.speed * (1000 / 3600))
            );
            pickUpTime = addTimes(ride.time, pickUpTime);
            if (isTimeBetween(startTime, endTime, pickUpTime)) {
              ride.pickUpTime = pickUpTime;
              ride.pickUpPoint = sourceFound;
              ride.dropOffPoint = destinationFound;
              ride.overview_path = routeCoordinates;
              ride.rideDistance = distanceFromEnd - distanceFromStart;
              const rideDistanceInKm = ride.rideDistance / 1000;
              const baseAmount =
                rideDistanceInKm * ride.unitCost * seatsRef.current.value;
              const commission = baseAmount * 0.012; // 1.2% commission
              ride.amount = baseAmount + commission;
              rideFound = true;
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
              ridesWithValidRoutes.push(ride);
            }
          }
        }
        if (!rideFound) {
          setFinalAns(false);
          setAvailableRides([]);
          toast(
            <div className="border border-blue-500 text-blue-500 font-semibold rounded-md p-4 shadow-md bg-transparent">
              No Rides Found
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }
        setFinalAns(true);
        setAvailableRides(ridesWithValidRoutes);
        // rest of the code...
      } else {
        console.error("Failed to fetch available rides");
        // Handle error
      }

      setIsSearching(false);
    } catch (error) {
      console.error("Error:", error);
      setIsSearching(false);
    }
  };

  const makeRideRequest = async (ride, index) => {
    try {
      console.log("The overview polyline is ", ride.overview_polyline);
      const rideData = {
        driverId: ride.driverId,
        rideId: ride._id,
        pickUp: ride.pickUpPoint,
        destination: ride.dropOffPoint,
        pickUpAddress: ride.pickUpAddress,
        destinationAddress: ride.dropOffAddress,
        driverSource: ride.source,
        driverDestination: ride.destination,
        seats: seatsRef.current.value,
        distance: ride.rideDistance / 1000,
        unitCost: ride.unitCost,
        pickUpDate: dateRef.current.value,
        pickUpTime: ride.pickUpTime,
        overview_polyline: ride.overview_polyline,
      };
      // console.log(rideData)
      const res = await rideRequest({ userData, rideData });
      if (!res.error) {
        toast(
          <div className="border border-blue-500 text-blue-500 font-semibold rounded-md p-4 shadow-md bg-transparent">
            Request sent
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  // Geocode pickup point

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    setAvailableRides([]);
    sourceRef.current.value = "";
    destinationRef.current.value = "";
    timeFromRef.current.value = "";
    timeToRef.current.value = "";
    dateRef.current.value = "";
    seatsRef.current.value = "";
    setUserSource(null);
    setUserDestination(null);
  };
  const markerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "green", // Change marker color to green
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 10, // Adjust the size of the marker
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen max-h-[100vh]">
      <div className="h-full bg-white rounded-lg shadow-lg p-6 max-h-[100vh]">
        <h1 className="text-3xl font-bold text-center text-gray-800 mt-5">
          Search Ride
        </h1>
        <div className="lg:w-4/5 mx-auto flex flex-col space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex-grow">
              <label
                htmlFor="source"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Source
              </label>
              <Autocomplete
                apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <input
                  id="source"
                  type="text"
                  placeholder="Enter source"
                  ref={sourceRef}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </Autocomplete>
            </div>
            <div className="flex-grow">
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destination
              </label>
              <Autocomplete
                apiKey={import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY}
              >
                <input
                  id="destination"
                  type="text"
                  placeholder="Enter destination"
                  ref={destinationRef}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
                />
              </Autocomplete>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                placeholder="Select date"
                ref={dateRef}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="timeFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time From
              </label>
              <input
                id="timeFrom"
                type="time"
                placeholder="Select time"
                ref={timeFromRef}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="timeTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Time To
              </label>
              <input
                id="timeTo"
                type="time"
                placeholder="Select time"
                ref={timeToRef}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>
            <div>
              <label
                htmlFor="seats"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Seats
              </label>
              <input
                id="seats"
                type="number"
                placeholder="Enter number of seats"
                ref={seatsRef}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
              />
            </div>
          </div>

          <div className="flex gap-10 justify-center">
            <button
              className="flex gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
              onClick={searchRide}
              disabled={isSearching}
            >
              Search Ride
              {isSearching && <ButtonLoadingSpinner />}
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
              onClick={clearRoute}
            >
              Clear Route
            </button>
          </div>
        </div>
        <div className="bg-gray-200 mt-2 rounded-md">
          {finalAns ? (
            <div>
              <h2 className="text-2xl font-bold mt-2 p-2">Available Rides:</h2>
              <div className="bg-gray-200 p-4 max-h-[250px] rounded-md overflow-auto">
                <ul>
                  {availableRides.map((ride, index) => (
                    <li
                      key={index}
                      className="bg-white rounded-md shadow-md p-4 mb-2 cursor-pointer"
                      onClick={() => displayRoute(ride, index)}
                    >
                      <div>
                        <span className="font-bold">Source:</span> {ride.source}
                      </div>

                      <div>
                        <span className="font-bold">Destination: </span>
                        {ride.destination}
                      </div>
                      <div>
                        <span className="font-bold">Date: </span>
                        {formatDate(ride.date)}
                      </div>
                      <div>
                        <span className="font-bold">Speed: </span>
                        {parseFloat(ride.speed).toFixed(2)} Km/h
                      </div>
                      <div>
                        <span className="font-bold">Amount: </span>
                        {ride.amount.toFixed(2)}
                      </div>

                      <div>
                        <span className="font-bold">PickUpTime: </span>
                        {convertToAMPM(ride.pickUpTime)}
                      </div>
                      <div className="font-bold"></div>
                      <button
                        className="px-4 py-2 mx-2 my-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
                        onClick={() => makeRideRequest(ride, index)}
                      >
                        Ride request
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
                        onClick={() => chatAdder(ride._id)}
                      >
                        Join Chat Group
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center">No available rides found.</div>
          )}
        </div>
      </div>
      <div className="border border-gray-400 max-h-[100vh] rounded-lg overflow-hidden">
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
          onLoad={(loaded) => setMap(loaded)}
        >
          <Marker
            position={userSource}
            icon={markerIcon}
            label={{ text: "A", color: "white", fontWeight: "bold" }}
          />
          <Marker
            position={userDestination}
            icon={markerIcon}
            label={{ text: "B", color: "white", fontWeight: "bold" }}
          />{" "}
          <Marker position={center} />
          {availableRides.map((ride, index) => (
            <Polyline
              key={index}
              path={ride.overview_path}
              options={{
                strokeColor:
                  index === selectedRouteIndex ? "#00FF00" : "#ff3563",
                strokeOpacity: "1.0",
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default FindRide;
