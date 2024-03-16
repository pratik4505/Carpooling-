import React, { useState } from "react";

const PastRide = (props) => {
  return (
    <tr className="text-gray-600 dark:text-gray-100">
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex  justify-center items-center">
          {props.serialNumber}
        </div>
      </td>
      <td className="sm:p-3 py-2 px-1 border-b border-gray-200 dark:border-gray-800">
        <div className="flex  justify-center items-center">{props.role}</div>
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
  );
};

export default PastRide;
