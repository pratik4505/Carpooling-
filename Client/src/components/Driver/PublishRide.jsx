import React from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };
export default function PublishRide() {
  const [libraries, setLibraries] = useState(["places"]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

 
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponses, setDirectionsResponses] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <p>Loading</p>;
  }

  const handleRouteClick = (index) => {
    setSelectedRouteIndex(index);
  };
  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    if (results.status !== "OK") {
      // Handle the case when no route is found
      console.error("Error: " + results.status);

      return;
    }
    console.log(results);
    setDirectionsResponses(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponses(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  console.log(selectedRouteIndex);
  return (
    <div className="grid grid-cols-2 h-[95vh]">
      <div className="border border-gray-400 h-full">
        <div className="border border-gray-400 w-[80%] h-[80%] m-auto">
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
          <button onClick={calculateRoute}>Find Routes</button>
          <button onClick={clearRoute}>Clear Routes</button>
        </div>
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
          <Marker position={center} />
          {directionsResponses&&directionsResponses.routes.map((route) => (
            <DirectionsRenderer
              key={route.summary}
              directions={{...directionsResponses, routes: [route],  }}
              options={{
                polylineOptions: {
                  strokeColor: 'blue' ,
                  strokeOpacity:  route.summary=== selectedRouteIndex ? 1 : 0.5,
                  strokeWeight: route.summary === selectedRouteIndex ? 17 : 4,
                },
              }}
              onClick={() => handleRouteClick(route.summary)}
            />
          ))}
          
        </GoogleMap>
      </div>
    </div>
  );
}
