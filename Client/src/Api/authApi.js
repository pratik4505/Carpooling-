import { API, handleApiError } from "./utils";

export const login = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const signUp = async (data) => {
  try {
    const res = await API.post("/auth/signUp", data);
    if (res.status === 201) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const dlVerified = async (data) => {
  try {
    const res = await API.post("/auth/dlVerified", data);
    if (res.status === 201) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getDlVerified = async (data) => {
  try {
    const res = await API.get("/auth/getDlVerified", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};


export const signUpOTP = async (data) => {
  try {
    const res = await API.post("/auth/signUpOTP", data);
    console.log(res)
    return res;
  } catch (error) {
    return handleApiError(error);
  }
};

export const forgotOTP = async (data) => {
  try {
    const res = await API.post("/auth/forgotOTP", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const changePassword = async (data) => {
  try {
    const res = await API.post("/auth/changePassword", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};