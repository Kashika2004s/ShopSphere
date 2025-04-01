import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Id received:", responseData.id);
        setIsSignedUp(true);
      } else {
        const responseData = await response.json();
        setError(responseData.message || "Signup failed");
      }
    } catch (error) {
      setError("Error during signup");
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="mainbox">
      <div className="loginBox">
        <h2 className="heading">Sign Up</h2>
        {error && <p className="error">{error}</p>}

        {isSignedUp ? (
          <div className="successBox">
            <p>A confirmation email has been sent to you. Please verify your email to complete the signup process.</p>
            <button className="successButton" onClick={() => navigate("/")}>Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="inputGroupContainer">
              <div className="halfWidthInputGroup">
                <label>Username</label>
                <input type="text" name="username" required />
              </div>
              <div className="halfWidthInputGroup">
                <label>Full Name</label>
                <input type="text" name="fullname" required />
              </div>
            </div>

            <div className="fullWidthInputGroup">
              <label>Email</label>
              <input type="email" name="email" required />
            </div>

            <div className="inputGroupContainer">
              <div className="halfWidthInputGroup">
                <label>Password</label>
                <input type="password" name="password" required />
              </div>
              <div className="halfWidthInputGroup">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" required />
              </div>
            </div>

            <div className="fullWidthInputGroup">
              <label>Address</label>
              <input type="text" name="address" required />
            </div>

            <div className="fullWidthInputGroup">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" required />
            </div>

            <button type="submit" className="submitButton">Sign Up</button>
          </form>
        )}
      </div>

      {/* CSS Styling */}
      <style>{`
        .mainbox {
          background: linear-gradient(135deg,#f0d3dd, #d0e1ef);
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loginBox {
          background-color: #ffffff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
        }

        .heading {
          font-size: 32px;
          font-weight: bold;
          margin-bottom : 5px;
          text-align: center;
          color:rgb(75, 72, 72);
        }

        .inputGroupContainer {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .halfWidthInputGroup, .fullWidthInputGroup {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 8px;
          color: #555;
        }

        input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color:#eadeed;
          color: #333;
        }

        input:focus {
          border-color:rgb(203, 238, 234);
          outline: none;
        }

        .submitButton, .successButton {
        margin:20px 20px 10px 250px;
        
          background-color:#6f6fe2;
          text-align: center;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .submitButton:hover, .successButton:hover {
          background-color:rgb(155, 170, 232);
        }

        .error {
          color: red;
        }

        .successBox {
          background-color: #E7F9E7;
          border: 1px solidrgb(205, 143, 198);
          padding: 50px;
          border-radius: 8px;
          color:rgb(205, 120, 177);
        }
      `}</style>
    </div>
  );
};

export default SignUp;
