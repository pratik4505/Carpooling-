import { API, handleApiError } from "./utils";

export const getTransactions = async () => {
  try {
    const res = await API.get("/transactions");
    // Assuming the API response contains transactions data
    return res.data;
  } catch (error) {
    handleApiError(error); // Handle API errors
    throw new Error("Failed to fetch transactions"); // Throw custom error
  }
};
