import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signUp } from "../../Api/authApi";
import "./Register.scss";
import { AiOutlineUser } from "react-icons/ai";
import { BsKey } from "react-icons/bs";

class RegistrationForm extends React.Component {
  render() {
    const backgroundImageUrl =
      "https://stimg.cardekho.com/images/carexteriorimages/630x420/Renault/KWID/10076/1705905595853/front-left-side-47.jpg?impolicy=resize&imwidth=480";
    return (
      <div
        className="wrapper"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="inner">
          <form action="">
            <h3>Registration Form</h3>
            <div className="form-group">
              <div className="form-wrapper">
                <label htmlFor="">First Name</label>
                <input type="text" className="form-control" />
              </div>
              <div className="form-wrapper">
                <label htmlFor="">Last Name</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Email</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Password</label>
              <input type="password" className="form-control" />
            </div>
            <div className="form-wrapper">
              <label htmlFor="">Confirm Password</label>
              <input type="password" className="form-control" />
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" /> I accept the Terms of Use & Privacy
                Policy.
                <span className="checkmark"></span>
              </label>
            </div>
            <button>Register Now</button>
          </form>
        </div>
      </div>
    );
  }
}

export default RegistrationForm;
