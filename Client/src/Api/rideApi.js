import { API, handleApiError } from "./utils";

export const getRequests = async () => {
  try {
    const res = await API.get("/rides/getRequests");
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postRequest = async (action, key) => {
  try {
    const res = await API.post("/rides/postRequests", { action, key });
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAcceptedRides = async () => {
  try {
    const res = await API.get("/rides/getAccepetedRides");
    console.log("The res is ", res);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postDeclinePayment = async (key) => {
  try {
    const res = await API.post("/rides/postDeclinePayment", { key });
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPaymentIntent = async (data) => {
  try {
    const res = await API.post("/payment/create-checkout-session", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getBookedRides = async () => {
  try {
    const res = await API.get("/rides/getBookedRides");
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCoRiders = async (rideId) => {
  try {
    const res = await API.get(`/rides/getCoRiders/${rideId}`); // Include rideId in the URL
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postRatings = async (data) => {
  try {
    const res = await API.post(`/rides/postRatings`, { ...data });
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getDriverRides = async () => {
  try {
    const res = await API.get("/rides/getDriverRides");
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const rideRequest = async (data) => {
  try {
    const res = await API.post(`/rides/rideRequest`, data);

    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyCode = async (data) => {
  try {
    const res = await API.post(`/rides/verifyCode`, data);

    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getPastRides = async () => {
  try {
    const res = await API.get("/rides/pastrides");
    // Assuming the API response contains transactions data
    return res.data;
  } catch (error) {
    handleApiError(error); // Handle API errors
    throw new Error("Failed to fetch past rides"); // Throw custom error
  }
};

export const cancelRide = async (bookedId) => {
  try {
    const res = await API.post("/rides/cancelRide", { bookedId });
    // Assuming the API response contains transactions data
    return res.data;
  } catch (error) {
    handleApiError(error); // Handle API errors
    throw new Error("Failed to fetch past rides"); // Throw custom error
  }
};

export const cancelPublishedRide = async (rideId) => {
  try {
    const res = await API.post("/rides/cancelPublishedRide", { rideId });
    // Assuming the API response contains transactions data
    return res.data;
  } catch (error) {
    handleApiError(error); // Handle API errors
    throw new Error("Failed to fetch past rides"); // Throw custom error
  }
};
