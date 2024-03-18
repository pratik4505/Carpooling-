import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import { Suspense } from "react";
import FallbackLoading from "../components/loader/FallbackLoading";

import SearchRides from "../pages/SearchRides";
import CreateRide from "../pages/CreateRide";
import Chats from "../pages/Chats";
import BookedRides from "../pages/BookedRides";
import DriverRides from "../pages/DriverRides";
import Notifications from "../pages/Notifications";
import PendingPayments from "../pages/PendingPayments";
import Profile from "../pages/Profile";
import RideRequests from "../pages/RideRequests";

import Home from "../pages/Home";
import Login from "../components/Login/Login";
import Register from "../components/Login/Register";
import LoginPage from "../components/Auth/LoginPage";
import SignUp from "../components/Auth/SignUp";
import Error from "../components/Error/Error";
import DoneRides from "../pages/PastRides";
import Transactions from "../components/Transactions/Transactions";
import { DlVerify } from "../components/DL verification/DlVerify";
import { DlCheck } from "./DlCheck";
import ForgotPassword from "../components/Auth/ForgotPassword";

const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="*" element={<Error />} />

        <Route path="/register" element={<SignUp />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="/publishRide" element={<DlCheck />} />
          <Route path="/searchRide" element={<SearchRides />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/bookedRides" element={<BookedRides />} />
          <Route path="/driverRides" element={<DriverRides />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/pendingPayments" element={<PendingPayments />} />
          <Route path="/profile/:ownerId" element={<Profile />} />
          <Route path="/rideRequests" element={<RideRequests />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/pastrides" element={<DoneRides />} />
          <Route path="/verifyDl" element={<DlVerify />} />
          {/* <Route path="/login" element = {<Login/>}/>
          <Route path="/Register" element = {<Register/>}/> */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
