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
          {(props.rating===0|| props.rating===undefined )? 'Not Rated':''}
          {[1, 2, 3, 4, 5].map((star, subIndex) => (
                <span
                  key={subIndex}
                  className="star cursor-pointer text-yellow-500"
                  style={{
                    fontSize: "25px",
                  }}
                >
                  {star <= props.rating ? "★" :'' }
                </span>
              ))}
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
                props.sourceCo,
                props.destinationCo,
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
