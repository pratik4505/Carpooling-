import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../../Api/authApi";

import { AiOutlineUser } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { Link } from "react-router-dom";



import "./styling.css";
import { AuthContext } from "../../context/ContextProvider";

export default function LoginPage() {

 
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const {initialLoad}=useContext(AuthContext);
  const navigate=useNavigate();
  const change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log(formData);
      const response = await login(formData);

      console.log(response);
      if (response.data) {
        localStorage.setItem("profile", JSON.stringify(response.data));
       initialLoad();
        navigate('/')
        return <Navigate to="/" />;
      } else {
        setResponseMessage(response.data);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setResponseMessage("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Log in</h1>

        <div className="input-group">
          <div className="input-field">
            <AiOutlineUser className="react-icons" />
            <input
              type="text"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={change}
            />
          </div>
          <div className="input-field">
            <BsKey className="react-icons" />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={change}
            />
          </div>
          <p>
            Lost password <a href="#">Click Here!</a>
          </p>
          <div className="submit-container">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <div className="submit" onClick={handleLogin}>
                Log in
              </div>
            )}
           
          </div>
          <div className="register">
            Don't have an account? <Link to="/register">Register</Link>
          </div>

          
        </div>
      </div>
      {responseMessage && (
        <div className="error-message">{responseMessage}</div>
      )}
    </div>
  );
}
