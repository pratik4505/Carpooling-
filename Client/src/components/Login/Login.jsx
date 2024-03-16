import React from "react";
import "./Login.scss";

const Login = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Email" required />
          <i className="bx bxs-user"></i>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <i className="bx bxs-lock-alt"></i>
        </div>
        <div className="remember-forget">
          <label>
            <input type="checkbox" name="" id="" />
            Remember Me{" "}
          </label>
          <a href="">Forgot Password ?</a>
        </div>

        <button type="submit" className="btn">
          Login
        </button>

        <div className="register-link">
          <p>
            Don't have an account ? <a href="">Register</a>
          </p>
        </div>
        <div className="login-with">
          <button type="submit" className="btn">
            Google
          </button>
          <button type="submit" className="btn">
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
