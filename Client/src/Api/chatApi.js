import { API, handleApiError } from "./utils";
export const getChats = async () => {
    try {
      const res = await API.get("/chat/getChats");
      if (res.status === 200) return { error: null, data: res.data };
      else return { error: res, data: null };
    } catch (error) {
      return handleApiError(error);
    }
  };
  export const getMessages = async (limit,rideId,createdAt) => {
    try {
      const res = await API.get(`/chat/getMessages?limit=${limit}&rideId=${rideId}&createdAt=${createdAt}`);
      if (res.status === 200) return { error: null, data: res.data };
      else return { error: res, data: null };
    } catch (error) {
      return handleApiError(error);
    }
  };
  export const postMessage = async (data) => {
    try {
      const res = await API.post("/chat/postMessage",data);
     
      if (res.status === 201) return { error: null, data: res.data };
      else return { error: res, data: null };
    } catch (error) {
      return handleApiError(error);
    }
  };
  export const createChat = async (data) => {
    try {
      const res = await API.post(`/chat/createChat`,data);
      if (res.status === 200) return { error: null, data: res.data };
      else return { error: res, data: null };
    } catch (error) {
      return handleApiError(error);
    }
  };