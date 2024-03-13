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
