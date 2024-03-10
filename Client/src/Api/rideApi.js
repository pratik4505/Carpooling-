import { API, handleApiError } from "./utils";

export const getRequests = async () => {
  try {
    const res = await API.get("/rides/getRequests");
    if (res.statusCode === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postRequest = async (action, key) => {
    try {
      const res = await API.post("/rides/postRequests", { action, key });
      if (res.statusCode === 200) return { error: null, data: res.data };
      else return { error: res.data.error, data: null  };
    } catch (error) {
      return handleApiError(error);
    }
  };
  

