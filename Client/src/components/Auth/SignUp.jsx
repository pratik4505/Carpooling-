import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../Api/authApi";
import "./Login.scss";
import { AiOutlineUser } from "react-icons/ai";
import { BsKey } from "react-icons/bs";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await signUp({ userName, email, password });

      if (response.data) {
        navigate("/login");
      } else {
        // Handle response data accordingly
        console.error("Signup request failed:", response);
        setResponseMessage("Failed to sign up. Please try again."); // Example error message
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setResponseMessage("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div class="login-box">
        <h2>Register</h2>
        <form>
          <div class="user-box">
            <input
              type="text"
              name="username"
              value={userName}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>UserName</label>
          </div>
          <div class="user-box">
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div class="user-box">
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>
          <a onClick={handleSignUp}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div onClick={handleSignUp}>Sign Up</div>
              )}
            </div>
          </a>
        </form>
      </div>
    </div>
  );
}
