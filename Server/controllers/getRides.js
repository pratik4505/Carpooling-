const AvailableRide = require("../models/AvailableRide");

// const handleCheckLocation = (location) => {
//   const geocoder = new google.maps.Geocoder();
//   geocoder.geocode({ address: location }, (results, status) => {
//     if (status === "OK" && results[0]) {
//       const { lat, lng } = results[0].geometry.location;

//       if (!directionsResponse) {
//         console.log("Please calculate route first.");
//         return;
//       }
//       const routePolyline = directionsResponse.routes[0].overview_polyline;
//       const decodedPolyline = google.maps.geometry.encoding.decodePath(routePolyline);
//       const isLocationOnRoute = decodedPolyline.some((point) => {
//         const distance = google.maps.geometry.spherical.computeDistanceBetween(
//           point,
//           new google.maps.LatLng(lat(), lng())
//         );
//         return distance < 10000; // Define your threshold distance here
//       });

//       if (isLocationOnRoute) {
//         console.log("Location is on the route.");

//         // Calculate time to reach the specified location
//         const distanceToLocation = google.maps.geometry.spherical.computeDistanceBetween(
//           new google.maps.LatLng("25.3176", "82.9739"),
//           new google.maps.LatLng(lat(), lng())
//         );
//         console.log(distanceToLocation);
//         // Assuming average speed in meters per second
//         const averageSpeed = 10; // meters per second
//         const timeToReachInSeconds = distanceToLocation / averageSpeed;

//         // Convert time to milliseconds and add to current time
//         const currentTime = new Date().getTime();
//         const arrivalTime = new Date(
//           currentTime + timeToReachInSeconds * 1000
//         );
//         console.log("Estimated arrival time:", arrivalTime);
//       } else {
//         console.log("Location is not on the route.");
//       }
//     } else {
//       console.log(
//         "Geocode was not successful for the following reason:",
//         status
//       );
//     }
//   });
// };

const findRides = async (req, res) => {
  try {
    const { origin, destination, date } = req.body;
    const rides = await AvailableRide.find({ date: date });
    console.log("Filtered rides:", rides);
    res.status(200).json(rides);
  } catch (err) {
    console.error("Error fetching rides:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { findRides };
