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

export const getRatings = async (ownerId) => {
  try {
    const res = await API.get(`/user/getRatings/${ownerId}`);

    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateProfile = async (formData) => {
  try {
    const res = await API.post(`/user/updateProfile`, formData);

    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getNotifications = async () => {
  try {
    const res = await API.get(`/notification/getNotifications`);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getLatestNotifications = async () => {
  try {
    const res = await API.get(`/notification/getLatestNotifications`);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};


export const contactUs = async (formData) => {
  try {
    const res = await API.post(`/user/contactUs`, formData);

    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};