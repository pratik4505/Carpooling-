import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotOTP, changePassword as changePwdAPI } from "../../Api/authApi";
import "./Login.scss";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpId, setOtpId] = useState("");

  const handleChangePassword = async () => {
    if (!otpId) {
      toast.error("Please send OTP first.");
      return;
    }
    setLoading(true);
    try {
      const response = await changePwdAPI({ email, password, otp, otpId });

      if (response.data) {
        toast.success("Password Changed Successfully");
        navigate("/login");
      } else {
        toast.error("OTP mismatch or password is not strong");
      }
    } catch (error) {
      console.error("Error during password change:", error);
      toast.error("An error occurred during password change. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      const res = await forgotOTP({ email });
      if (!res.error) {
        setOtpId(res.data._id);
        toast.success("OTP sent successfully.");
        setOtp(""); // Clear OTP field after sending OTP
      } else {
        toast.error("Email address is not registered");
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
          <a onClick={handleChangePassword} disabled={loading}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div>{loading ? "Loading..." : "Change Password"}</div>
          </a>
          <a onClick={sendOTP} disabled={loading}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div>{loading ? "Loading..." : "Send OTP"}</div>
          </a>
        </form>
      </div>
    </div>
  );
}
