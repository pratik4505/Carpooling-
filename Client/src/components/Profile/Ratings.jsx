import React from "react";

const Ratings = ({ ratings }) => {
  return (
    <div className="mt-3 max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="max-w-md mx-auto mt-4">
        {ratings.map((ratingObj, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2 text-gray-600">Rating:</span>
              {[1, 2, 3, 4, 5].map((star, subIndex) => (
                <span
                  key={subIndex}
                  className="star cursor-pointer text-yellow-500"
                  style={{
                    fontSize: "25px",
                  }}
                >
                  {star <= (ratingObj.ratings[Object.keys(ratingObj.ratings)[0]] || {}).rating ? "★" : "☆"}
                </span>
              ))}
            </div>
            {/* <p className="text-gray-700">{(ratingObj.ratings[Object.keys(ratingObj.ratings)[0]] || {}).description}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ratings;
