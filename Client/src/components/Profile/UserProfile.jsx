import { useEffect, useState } from "react";
import { getProfile, getRatings, updateProfile } from "../../Api/userApi";
import { FaUserCircle } from "react-icons/fa";
import Ratings from "./Ratings";
import CommonLoading from "../loader/CommonLoading";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
export const UserProfile = ({ ownerId }) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [popUp, setPopUp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfile(ownerId);
        if (!res.error) {
          setProfileData(res.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchData();
  }, [ownerId]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await getRatings(ownerId);
        if (!res.error) {
          setRatings(res.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    };
    fetchRatings();
  }, [ownerId]);
  console.log(profileData);
  const updateDetails = async () => {
    setLoading(true); // Set loading state to true while updating

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("about", profileData.about);
      formData.append("image", profileData.image); // Assuming profileData.image is a File object

      const res = await updateProfile(formData);

      if (res.error) {
        throw new Error("Failed to update profile details");
      }

      setProfileData(res.data);
      setPopUp(false); // Close the pop-up after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error appropriately, e.g., show error message to the user
    } finally {
      setLoading(false); // Reset loading state after updating
    }
  };

  return (
    <div className="pt-[80px] my-auto h-[100vh]">
      {profileData && (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                {profileData.imageUrl ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={`${BASE_URL}/${profileData.imageUrl}`}
                    alt={profileData.name}
                  />
                ) : (
                  <FaUserCircle className="h-12 w-12 text-gray-500" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {profileData.name}
                </h2>
              </div>
            </div>
          </div>
          <p className="text-xl font-medium text-gray-500">About</p>
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <p className="text-base text-gray-700">{profileData.about}</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 transition duration-300 ease-in-out"
            onClick={() => setPopUp(true)}
          >
            Update Details
          </button>
        </div>
      )}
      {popUp && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 z-50">
            <div className="flex flex-col space-y-4 container mt-8">
              <input
                type="text"
                placeholder="Enter Name"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
              <textarea
                placeholder="Enter About"
                className="border border-gray-300 rounded-md px-3 py-2"
                value={profileData.about}
                onChange={(e) =>
                  setProfileData({ ...profileData, about: e.target.value })
                }
              ></textarea>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md px-3 py-2"
                // Add onChange prop to handle file selection
                onChange={(e) =>
                  setProfileData({ ...profileData, image: e.target.files[0] })
                }
              />
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setPopUp(false); // Close the pop-up on Cancel
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={updateDetails}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && <CommonLoading />}
      {ratings && <Ratings ratings={ratings} />}
    </div>
  );
};
