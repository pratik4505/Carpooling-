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
      const res = await API.post(`/rides/postRatings`,{...data});
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
  try { console.log(data)
    const res = await API.post(`/rides/rideRequest`,data);
   
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

  