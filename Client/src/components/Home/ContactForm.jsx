import React, { useState } from "react";
import axios from "axios";
import { contactUs } from "../../Api/userApi";
import "./ContactForm.scss";
import { toast } from "react-toastify";
const ContactForm = () => {
  // State variables to store form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [message, setMessage] = useState("");

  const clearForm = (e) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setContactNo("");
    setMessage("");
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object with form data
    const formData = {
      name,
      email,
      contactNo,
      message,
    };

    try {
      // Send form data to an endpoint using Axios
      const response = await contactUs(formData);

      if (response.data) {
        toast(
          <div className="border border-blue-500 text-blue-500 font-semibold rounded-md p-4 shadow-md bg-transparent">
            {response.data.message}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      console.log("Email sent:", response.data);

      // Clear form fields after successful submission
      clearForm(e);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="background-container md:w-[90vw] lg:w-[80vw] mx-auto ">
      <div className="container-contact">
        <div className="screen-contact">
          {/* Form */}
          <form className="">
            <div className="screen-contact-body">
              <div className="screen-contact-body-item left">
                <div className="app-title">
                  <span>CONTACT</span>
                  <span>US</span>
                </div>
                <div className="app-contact">CONTACT INFO : +11 1111111111</div>
              </div>
              <div className="screen-contact-body-item">
                <div className="app-form">
                  <div className="app-form-group">
                    <input
                      className="app-form-control text-blue-500"
                      placeholder="NAME"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="app-form-group">
                    <input
                      className="app-form-control text-blue-500"
                      placeholder="EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="app-form-group">
                    <input
                      className="app-form-control text-blue-500"
                      placeholder="CONTACT NO"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                    />
                  </div>
                  <div className="app-form-group message">
                    <input
                      className="app-form-control text-blue-500"
                      placeholder="MESSAGE"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="app-form-group buttons">
                    <button
                      onClick={clearForm}
                      className="app-form-button mr-4"
                    >
                      CANCEL
                    </button>

                    <button onClick={handleSubmit} className="app-form-button">
                      SEND
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Credits */}
        <div className="credits">
          inspired by
          <a
            className="credits-link"
            href="https://dribbble.com/shots/2666271-Contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="dribbble" viewBox="0 0 200 200">
              <g stroke="#ffffff" fill="none">
                {/* Dribble SVG */}
              </g>
            </svg>
            Gururaj
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
