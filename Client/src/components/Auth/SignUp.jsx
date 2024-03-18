import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signUp, signUpOTP } from "../../Api/authApi";
import "./Login.scss";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState("");

  const handleSignUp = async () => {
    if (!otpId) {
      toast.error("Please send OTP first.");
      return;
    }
    setLoading(true);
    try {
      const response = await signUp({ userName, email, password, otp, otpId });

      if (response.data) {
        navigate("/login");
      } else {
        toast.error("Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendotp = async () => {
    try {
      const res = await signUpOTP({ email });
      if (res.data) {
        setOtpId(res.data._id);
        toast.success("OTP sent successfully.");
      } else {
        toast.error("Email error.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP. Please try again.");
    }
  };

  return (
    <div>
      <div className="login-box">
        <h2>Register</h2>
        <form>
          <div className="user-box">
            <input
              type="text"
              name="username"
              value={userName}
              placeholder="Full Name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Full Name</label>
          </div>
          <div className="user-box">
            <input
              type="text"
              name="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>
          <div className="user-box">
            <input
              type="text"
              name="otp"
              value={otp}
              placeholder="OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <label>OTP</label>
          </div>
          <div className="user-box">
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
                <div>Sign Up</div>
              )}
            </div>
          </a>
          <a onClick={sendotp}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>Send OTP</div>
              )}
            </div>
          </a>
        </form>
      </div>
    </div>
  );
}
