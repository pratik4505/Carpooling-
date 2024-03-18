import React, { useState, useEffect, useContext } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { AuthContext } from "../context/ContextProvider";
import FallbackLoading from "./loader/FallbackLoading";

function GoogleMapUtil({ coordinates, polyline }) {
  const { isLoaded } = useContext(AuthContext);
  const [center, setCenter] = useState(null);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    // Fetch the real-time location and set it as the center of the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);
  useEffect(() => {
    if (!polyline || !map) return;
    const routeCoordinates =
      window.google.maps.geometry.encoding.decodePath(polyline);
    setRoute(routeCoordinates);
  }, [polyline, map]);

  useEffect(() => {
    if (!coordinates || coordinates.length === 0 || !map) return;
    const newMarkers = coordinates.map((coordinate, index) => {
      const marker = new window.google.maps.Marker({
        position: coordinate,
        title: "Hello World!",
        map: map,
      });
      return marker;
    });

    setMarkers(newMarkers);

    // Zoom to fit all markers
    const bounds = new window.google.maps.LatLngBounds();
    newMarkers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
  }, [coordinates, map]);

  const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

  if (!isLoaded) {
    return <FallbackLoading />;
  }

  return (
    <GoogleMap
      center={center}
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      options={mapOptions}
      onLoad={(loaded) => setMap(loaded)}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.getPosition()}
          title={marker.getTitle()}
        />
      ))}
      {route && (
        <Polyline
          path={route}
          options={{
            strokeColor: "#ff3563",
            strokeOpacity: 1.0,
            strokeWeight: 4,
            icons: [
              {
                icon: "hello",
                offset: "0",
                repeat: "10px",
              },
            ],
          }}
        />
      )}
    </GoogleMap>
  );
}

export default GoogleMapUtil;
