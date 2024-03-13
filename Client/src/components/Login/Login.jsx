import React from "react";
import "./Login.css";

const Login = () => {
  return (
    <div class="wrapper">
      <form action="">
        <h1>Login</h1>
        <div class="input-box">
          <input type="text" placeholder="Email" required />
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Password" required />
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="remember-forget">
          <label>
            <input type="checkbox" name="" id="" />
            Remember Me{" "}
          </label>
          <a href="">Forgot Password ?</a>
        </div>

        <button type="submit" class="btn">
          Login
        </button>

        <div class="register-link">
          <p>
            Don't have an account ? <a href="">Register</a>
          </p>
        </div>
        <div class="login-with">
          <button type="submit" class="btn">
            Google
          </button>
          <button type="submit" class="btn">
            Facebook
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
