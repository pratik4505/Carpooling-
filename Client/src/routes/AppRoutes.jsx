import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import { Suspense } from "react";
import FallbackLoading from "../components/loader/FallbackLoading";
import PublishRide from "../components/Driver/PublishRide";
import FindRide from "../components/User/FindRide";

const AppRoutes = () => {
  return (
    <Suspense fallback={<FallbackLoading />}>
      <Routes>
        {/* <Route path="/Login" element={<></>} /> */}
        <Route path="*" element={<h1>Not Found</h1>} />
        {/* <Route path="Register" element={<></>} /> */}

        <Route path="/">
          <Route path="/publishRide" element={<PublishRide />} />
          <Route path="/findRide" element={<FindRide />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
