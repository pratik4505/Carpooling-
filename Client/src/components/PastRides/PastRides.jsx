import React, { useEffect, useState, useContext } from "react";
import FallbackLoading from "../loader/FallbackLoading";
import { AuthContext } from "../../context/ContextProvider";
import { getPastRides } from "../../Api/rideApi";
import PastRide from "./PastRide";

const PastRides = () => {
  const [pastRides, setPastRides] = useState(null);
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPastRides = async () => {
      try {
        const res = await getPastRides();
        console.log("The response of the Past rides is ", res);
        if (!res.error) {
          const updatedPastRides = res.map((pastRide) => {
            const dateTime = new Date(pastRide.createdAt);
            const date = dateTime.toLocaleDateString();
            const time = dateTime.toLocaleTimeString();
            return { ...pastRide, date, time };
          });
          setPastRides(updatedPastRides);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching Past Rides : ", error);
      }
    };
    fetchPastRides();
  }, []);
  return (
    <div>
      <div className=" dark:bg-gray-900 dark:text-black text-gray-600 h-screen flex pt-[70px] overflow-hidden text-sm">
        <div className="flex-grow overflow-hidden h-full flex flex-col">
          <div className="flex-grow bg-green-500 flex overflow-x-hidden">
            <div className="flex-grow  dark:bg-gray-900 overflow-y-auto">
              <div className="sm:px-7 sm:pt-7 px-4 p-2 flex flex-col w-full border-b border-gray-200  dark:bg-gray-900 dark:text-black dark:border-gray-800 sticky top-0">
                <div className="flex w-full items-center">
                  <div className="flex items-center text-3xl text-gray-900 dark:text-black">
                    <img
                      src="https://assets.codepen.io/344846/internal/avatars/users/default.png?fit=crop&format=auto&height=512&version=1582611188&width=512"
                      className="w-12 mr-4 rounded-full"
                      alt="profile"
                    />
                    {userData && userData.name}
                  </div>
                  <div className="ml-auto sm:flex hidden items-center justify-end">
                    <div className="text-right">
                      <div className="text-xs text-gray-400 dark:text-gray-400">
                        Account balance:
                      </div>
                      <div className="text-gray-900 text-lg dark:text-black">
                        $2,794.00
                      </div>
                    </div>
                    <button className="w-8 h-8 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="sm:p-7 p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        S.No.
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Role
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Status
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Source
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Destination
                      </th>
                      <th className="font-normal px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800 hidden md:table-cell">
                        Rating
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Date
                      </th>
                      <th className="font-normal text-center px-3 pt-0 pb-3 border-b border-gray-200 dark:border-gray-800">
                        Time
                      </th>
                    </tr>
                    {pastRides &&
                      pastRides.map((pastRide, index) => (
                        <PastRide
                          key={index}
                          serialNumber={index + 1}
                          role={pastRide.user}
                          status={pastRide.rideCancelled}
                          from={pastRide.source}
                          to={pastRide.destination}
                          rating={pastRide.averageRating}
                          date={pastRide.date}
                          time={pastRide.time}
                        />
                      ))}
                  </thead>
                </table>
                {loading && <FallbackLoading />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastRides;
