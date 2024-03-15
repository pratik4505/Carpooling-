import { API, handleApiError } from "./utils";

export const getProfile = async (ownerId) => {
    try { 
      const res = await API.get(`/user/getProfile/${ownerId}`);
     
      if (res.status === 200) return { error: null, data: res.data };
      else return { error: res, data: null };
    } catch (error) {
      return handleApiError(error);
    }
  };