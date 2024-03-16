import React, { useState } from "react";
import GoogleMapUtil from "../GoogleMapUtil";

const PastRide = (props) => {
  const [isDivOpen, setIsDivOpen] = useState(false);

  const handleClick = () => {
    setIsDivOpen(true);
  };

  const handleClose = () => {
    setIsDivOpen(false);
  };

  return (
    <>
      <tr
        className="text-gray-600 dark:text-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-center items-center">
            {props.serialNumber}
          </div>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-center items-center">{props.role}</div>
        </td>
        <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-center items-center">
            {props.status ? "Cancelled" : "Not Cancelled"}
          </div>
        </td>
        <td className="sm:p-3 text-center py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden">
          {props.from}
        </td>
        <td className="sm:p-3 text-center py-2 px-1 border-b border-gray-200 dark:border-gray-800 md:table-cell hidden">
          {props.to}
        </td>
        <td className="sm:p-3 py-2 text-center px-1 border-b border-gray-200 dark:border-gray-800">
          {props.rating}
        </td>
        <td className="sm:p-3 py-2 text-center px-1 border-b border-gray-200 dark:border-gray-800">
          <div className="flex text-center items-center">
            <div className="sm:flex hidden text-center flex-col">
              {props.date}
              <div className="text-gray-400 text-xs">{props.time}</div>
            </div>
          </div>
        </td>
      </tr>
      {isDivOpen && (
        <div className="fixed top-0 my-4 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-2 w-[80vw] h-[80vh] ">
            <button
              className="absolute right-[5%] bg-red-700"
              onClick={handleClose}
            >
              Close
            </button>
            <GoogleMapUtil
              coordinates={[
                {
                  lat: 25.492120000000003,
                  lng: 81.86776,
                },
                {
                  lat: 25.49208,
                  lng: 81.86825,
                },
              ]}
              polyline={props.polyline}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PastRide;
