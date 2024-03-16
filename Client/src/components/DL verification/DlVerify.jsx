import { useContext, useState } from "react";
import axios from "axios";
import ButtonLoadingSpinner from "../loader/ButtonLoadingSpinner";
import { AuthContext } from "../../context/ContextProvider";
import { dlVerified } from "../../Api/authApi";
import { useNavigate } from "react-router-dom";
function formatDOB(date) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}
import "./verification.scss";

function requestOptions(dlNumber, dob) {
  return {
    method: "POST",
    url: "https://driving-license-verification1.p.rapidapi.com/DL/DLDetails",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "21bf180744msh0e9fdf2fe276eb2p1c5282jsn9f2949f5f205",
      "X-RapidAPI-Host": "driving-license-verification1.p.rapidapi.com",
    },
    data: {
      method: "dlvalidate",
      txn_id: "9ujh7gdhgs",
      clientid: "2222",
      consent: "Y",
      dlnumber: dlNumber,
      dob: dob,
    },
  };
}

export const DlVerify = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [Verify, setVerify] = useState(true);
  const { userData, setIsDlVerified } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedDOB = formatDOB(dob);

    console.log(requestOptions(licenseNumber, formattedDOB));

    try {
      const response = await axios.request(
        requestOptions(licenseNumber, formattedDOB)
      );
      console.log(response.data);
      const data = response.data;

      if (data.Succeeded?.statusCode === "1") {
        if (
          data.Succeeded?.data.result.name.toLowerCase() ===
          userData.name.toLowerCase()
        ) {
          const res = await dlVerified({
            dlNumber: licenseNumber,
            dob: formattedDOB,
          });

          if (!res.error) {
            setIsDlVerified(true);
            navigate("/publishRide");
          }
        }
      }
      setVerify(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md my-auto ">
        {!Verify && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Data didn't matched</strong>
          </div>
        )}
        <form onSubmit={handleSubmit} className="verify-box">
          <h2>Driving License Form</h2>
          <div className="mb-4">
            <label
              htmlFor="licenseNumber"
              className="block text-gray-700 font-medium"
            >
              Driving License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
              placeholder="Enter your license number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dob" className="block text-gray-700 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-50"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <a onClick={DlVerify} className="cursor-pointer">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div onClick={DlVerify}>Verify</div>
              )}
            </div>
          </a>
          {loading && <ButtonLoadingSpinner />}
        </form>
      </div>
    </div>
  );
};
