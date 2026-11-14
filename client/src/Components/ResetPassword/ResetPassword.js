import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import axios from "axios";
import image from "../images/forgot_password.jpg";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../api";

const labelStyle = {
  fontWeight: "bold",
  display: "inline-block",
  marginRight: "0.5em",
};

const inputStyle = {
  display: "inline-block",
  width: "50%",
  textAlign: "start",
  marginBottom: "5px",
};

// Step 1: confirm the account with its email + registered phone number.
// Step 2: choose a new password. The server checks both again before saving.
const ResetPassword = () => {
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const errorText = (err, fallback) =>
    (err.response && err.response.data && err.response.data.message) || fallback;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!verified) {
      axios
        .post(`${API}/users/forgotPassword/verify`, {
          email: emailValue,
          ph: phoneValue,
        })
        .then(() => setVerified(true))
        .catch((err) =>
          setError(errorText(err, "Couldn't reach the server. Please try again."))
        );
      return;
    }

    axios
      .patch(`${API}/users/forgotPassword`, {
        email: emailValue,
        ph: phoneValue,
        password: userPassword,
      })
      .then(() => {
        alert("password update successfully");
        navigate("/");
      })
      .catch((err) =>
        setError(errorText(err, "Couldn't update the password. Please try again."))
      );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Center the form vertically
      }}
    >
      <Container>
        <Form onSubmit={handleSubmit}>
          {!verified ? (
            <>
              <Form.Group controlId="resetEmail">
                <Form.Label style={labelStyle}>Email :</Form.Label>
                <Form.Control
                  type="email"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Type your valid email Id?"
                />
              </Form.Group>
              <Form.Group controlId="resetPhone">
                <Form.Label style={labelStyle}>Phone :</Form.Label>
                <Form.Control
                  type="tel"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Phone number you signed up with"
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group controlId="resetPassword">
              <Form.Label style={labelStyle}>New password :</Form.Label>
              <Form.Control
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  ...inputStyle,
                  width: "70%",
                  backgroundColor: "black",
                  color: "white",
                }}
                placeholder="At least 6 characters"
              />
            </Form.Group>
          )}
          {error && (
            <p style={{ color: "red", fontWeight: "bold", marginBottom: "5px" }}>
              {error}
            </p>
          )}
          <Button type="submit" variant="outline-dark">
            Submit
          </Button>
          <Link to={"/"}>
            <Button variant="outline-dark" className="ms-2">
              Home
            </Button>
          </Link>
        </Form>
      </Container>
    </div>
  );
};

export default ResetPassword;
