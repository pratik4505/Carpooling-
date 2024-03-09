import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const FindRide = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });
  const [directionsResponse, setDirectionResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [rides, setRides] = useState([]);
  const originRef = useRef();
  const destinationRef = useRef();
  const dateTimeRef = useRef();

  useEffect(() => {
    // Fetch rides from the database
    const fetchRides = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/rides`
        );
        if (response.status === 200) {
          setRides(response.data);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center = { lat: 48.8584, lng: 2.2945 };

  const serachRide = async () => {
    // Function to search for a ride
    // ...
  };

  const clearRoute = () => {
    // Function to clear the route
    // ...
  };

  return (
    <div className="relative flex items-center flex-col h-screen w-screen">
      <div className="absolute inset-0">
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
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div className="z-10">
        <Autocomplete>
          <input
            type="text"
            placeholder="Origin"
            ref={originRef}
            className="border"
          />
        </Autocomplete>

        <Autocomplete>
          <input
            type="text"
            placeholder="Destination"
            ref={destinationRef}
            className="border"
          />
        </Autocomplete>

        <input
          type="datetime-local"
          placeholder="Date and time"
          ref={dateTimeRef}
          className="border"
        />

        <button
          className="bg-gray-300 p-2 rounded-full"
          onClick={() => {
            map.panTo(center);
          }}
        >
          Add Icon
        </button>
        <button className="bg-gray-300 p-2 rounded-full" onClick={serachRide}>
          Search Ride
        </button>
        <button className="bg-gray-300 p-2 rounded-full" onClick={clearRoute}>
          Clear Search
        </button>
      </div>

      {/* Display list of rides */}
      <div className="mt-5">
        <h2 className="text-xl font-bold">Available Rides:</h2>
        <ul>
          {rides.map((ride) => (
            <li key={ride.id}>
              <p>Origin: {ride.origin}</p>
              <p>Destination: {ride.destination}</p>
              <p>Source on Route: {ride.sourceOnRoute ? "Yes" : "No"}</p>
              <p>
                Destination on Route: {ride.destinationOnRoute ? "Yes" : "No"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FindRide;

// import React, { useRef, useState } from "react";
// import {
//   useJsApiLoader,
//   GoogleMap,
//   Marker,
//   Autocomplete,
//   DirectionsRenderer,
// } from "@react-google-maps/api";

// const FindRide = () => {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: ["places", "geometry"],
//   });
//   const [directionsResponse, setDirectionResponse] = useState(null);
//   const [map, setMap] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");
//   const originRef = useRef();
//   const checkRef = useRef();
//   const destinationRef = useRef();

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   const center = { lat: 48.8584, lng: 2.2945 };
//   const handleCheckLocation = () => {
//     const location = checkRef.current.value;
//     if (!location) return;

//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({ address: location }, (results, status) => {
//       if (status === "OK" && results[0]) {
//         const { lat, lng } = results[0].geometry.location;

//         if (!directionsResponse) {
//           console.log("Please calculate route first.");
//           return;
//         }

//         const routePath = directionsResponse.routes[0].overview_path;
//         const isLocationOnRoute = routePath.some((point) => {
//           const distance =
//             google.maps.geometry.spherical.computeDistanceBetween(
//               point,
//               new google.maps.LatLng(lat(), lng())
//             );
//           return distance < 10000; // Define your threshold distance here
//         });

//         if (isLocationOnRoute) {
//           console.log("Location is on the route.");

//           // Calculate time to reach the specified location
//           const distanceToLocation =
//             google.maps.geometry.spherical.computeDistanceBetween(
//               new google.maps.LatLng("25.3176", "82.9739"),
//               new google.maps.LatLng(lat(), lng())
//             );
//           console.log(distanceToLocation);
//           // Assuming average speed in meters per second
//           const averageSpeed = 10; // meters per second
//           const timeToReachInSeconds = distanceToLocation / averageSpeed;

//           // Convert time to milliseconds and add to current time
//           const currentTime = new Date().getTime();
//           const arrivalTime = new Date(
//             currentTime + timeToReachInSeconds * 1000
//           );
//           console.log("Estimated arrival time:", arrivalTime);
//         } else {
//           console.log("Location is not on the route.");
//         }
//       } else {
//         console.log(
//           "Geocode was not successful for the following reason:",
//           status
//         );
//       }
//     });
//   };

//   const serachRide = async () => {
//     if (originRef.current.value === "" || destinationRef.current.value === "") {
//       return;
//     }

//     const origin = originRef.current.value;
//     const destination = destinationRef.current.value;

//     const directionService = new google.maps.DirectionsService();
//     const results = await directionService.route({
//       origin,
//       destination,
//       travelMode: google.maps.TravelMode.DRIVING,
//       provideRouteAlternatives: true, // Request multiple routes
//     });

//     const { routes } = results;
//     if (routes && routes.length > 0) {
//       let shortestRouteIndex = 0;
//       let shortestRouteDuration = routes[0].legs[0].duration.value;

//       // Find the route with the shortest duration
//       routes.forEach((route, index) => {
//         const routeDuration = route.legs[0].duration.value;
//         if (routeDuration < shortestRouteDuration) {
//           shortestRouteIndex = index;
//           shortestRouteDuration = routeDuration;
//         }
//       });

//       // Store the most optimum route in an array
//       const optimumRoute = routes[shortestRouteIndex];
//       console.log("The most optimum route is ", optimumRoute);

//       // Extract place names from the most optimum route
//       const placeNames = optimumRoute.legs.map((leg) => leg.end_address);
//       console.log("Places along the most optimum route:", placeNames);

//       // Draw all routes on the map
//       routes.forEach((route, index) => {
//         new google.maps.Polyline({
//           path: route.overview_path,
//           strokeColor: index === shortestRouteIndex ? "#FF0000" : "#0000FF", // Different color for the most optimum route
//           strokeOpacity: 0.8,
//           strokeWeight: 5,
//           map: map,
//         });
//       });

//       // Set distance and duration for the most optimum route
//       const { legs } = optimumRoute;
//       if (legs && legs.length > 0) {
//         const { distance, duration } = legs[0];
//         setDistance(distance.text);
//         setDuration(duration.text);
//       }
//     }

//     setDirectionResponse(results);
//   };

//   const clearRoute = () => {
//     setDirectionResponse(null);
//     setDistance("");
//     setDuration("");
//     originRef.current.value = "";
//     destinationRef.current.value = "";
//   };

//   return (
//     <div className="relative flex items-center flex-col h-screen w-screen">
//       <div className="absolute inset-0">
//         <GoogleMap
//           center={center}
//           zoom={15}
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           options={{
//             zoomControl: false,
//             streetViewControl: false,
//             mapTypeControl: false,
//             fullscreenControl: false,
//           }}
//           onLoad={(loaded) => setMap(loaded)}
//         >
//           <Marker position={center} />
//           {directionsResponse && (
//             <DirectionsRenderer directions={directionsResponse} />
//           )}
//         </GoogleMap>
//       </div>
//       <div className="z-10">
//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Origin"
//             ref={originRef}
//             className="border"
//           />
//         </Autocomplete>

//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Destination"
//             ref={destinationRef}
//             className="border"
//           />
//         </Autocomplete>

//         <button
//           className="bg-gray-300 p-2 rounded-full"
//           onClick={() => {
//             map.panTo(center);
//           }}
//         >
//           Add Icon
//         </button>
//         <button
//           className="bg-gray-300 p-2 rounded-full"
//           onClick={serachRide}
//         >
//           Search Ride
//         </button>
//         <button className="bg-gray-300 p-2 rounded-full" onClick={clearRoute}>
//           Clear Search
//         </button>
//         <Autocomplete>
//           <input
//             type="text"
//             placeholder="Enter Location"
//             ref={checkRef}
//             className="border"
//           />
//         </Autocomplete>

//         <button
//           className="bg-blue-500 text-white p-2 rounded-md"
//           onClick={handleCheckLocation}
//         >
//           Check Location
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FindRide;
