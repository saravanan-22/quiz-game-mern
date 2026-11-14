import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import image from "./images/logo.svg.png";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/esm/Button";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import axios from "axios";
import background from "../../images/login_background.jpg";
import { API } from "../../../api";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // submitBtn-----------------------------------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError("");
    axios
      .post(`${API}/users/login`, { email, password })
      .then((res) => {
        const user = res.data.data;
        localStorage.setItem("uid", user._id);
        alert("Login completed successfully. Welcome!");
        navigate("/Home");
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setLoginError("Email or password doesn't match");
        } else {
          setLoginError(
            "Couldn't reach the server. It may be waking up (free hosting), so try again in about 30 seconds."
          );
        }
      });
  };

  const setDefaultValues = (e) => {
    e.preventDefault();
    setEmail("demo@quizapp.dev")
    setPassword("demo1234")
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <Card
        style={{
          width: "21rem",
          margin: "0 auto",
          padding: "1em",
          marginBottom: "4.5em",
          backgroundColor: "rgb(241, 241, 241)",
        }}
      >
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>Log in</Card.Title>
        </Card.Body>
        <>
          <Form onSubmit={handleSubmit} className="d-grid">
            <FloatingLabel
              controlId="floatingInput"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                required
                style={{ textAlign: "start" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                required
                style={{ textAlign: "start" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FloatingLabel>
            <p className="text-danger">{loginError}</p>
            <Link to="/ResetPassword" className="text-end">
              ResetPassword
            </Link>
            <Button type="submit">Submit</Button>
          </Form>
        </>
        <Card.Body>
          <h6>
            user credentials!{" "}
            <Button
              variant="outline-dark"
              size="sm"
              style={{ textDecoration: "underline" }}
              onClick={setDefaultValues}
            >
              Login
            </Button>
          </h6>
          <h6>
            Don't have an account? <Link to="/SignUp">Sign up</Link>
          </h6>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
