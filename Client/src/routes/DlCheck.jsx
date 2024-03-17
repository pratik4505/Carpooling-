import React, { useContext } from 'react'
import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom"; 
import { AuthContext } from '../context/ContextProvider';
import CreateRide from '../pages/CreateRide';
export const DlCheck = () => {

    const {isDlVerified}=useContext(AuthContext)
  
    return isDlVerified ? (
        <CreateRide />
      ) : (
        // Redirect to Login page if accessToken is not present
        <Navigate to="/verifyDl" />
      );
}
