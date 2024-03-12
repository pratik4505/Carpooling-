import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom

const ProtectedRoute = () => {
  // Retrieve the accessToken from localStorage
  const accessToken =
    true || JSON.parse(localStorage.getItem("profile"))?.accessToken;

  // Return the protected route if accessToken is present
  return accessToken ? (
    <div className="w-full h-full">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  ) : (
    // Redirect to Login page if accessToken is not present
    <Navigate to="/Login" />
  );
};

export default ProtectedRoute;
