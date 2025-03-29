import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

function Register({ isAuthenticated, setIsAuthenticated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const avatarHandler = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("avatar", avatar);
    await axios
      .post("http://localhost:4000/api/v1/user/register", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAvatar("");
        setIsAuthenticated(true);
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #121212;
            margin: 0;
            padding: 0;
            color: #e0e0e0;
          }

          .bg-gradient {
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            min-height: 100vh;
            padding-top: 50px;
          }

          .form-container {
            background-color: #212121;
            color: #fff;
            border-radius: 15px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            padding: 30px;
            max-width: 400px;
          }

          h3 {
            font-size: 2rem;
            font-weight: 600;
            letter-spacing: 1px;
          }

          .form-control-custom {
            background-color: #333;
            color: #fff;
            border: 1px solid #444;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
          }

          .form-control-custom:focus {
            border-color: #00bcd4;
            background-color: #444;
            box-shadow: 0 0 5px rgba(0, 188, 212, 0.5);
          }

          button {
            background-color: #00bcd4;
            border: none;
            font-size: 1.1rem;
            padding: 15px;
            border-radius: 25px;
            transition: all 0.3s ease;
          }

          button:hover {
            background-color: #0097a7;
            box-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
          }

          button:focus {
            box-shadow: 0 0 0 0.2rem rgba(0, 188, 212, 0.5);
          }

          a {
            color: #00bcd4;
          }

          a:hover {
            color: #0097a7;
            text-decoration: underline;
          }
        `}
      </style>

      <Container
        className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient"
        style={{ padding: "50px" }}
      >
        <Form onSubmit={handleRegister} className="w-100 shadow-lg p-5 rounded form-container">
          <h3 className="text-center mb-4 text-white">Register</h3>

          <Form.Group className="mb-4" controlId="formBasicName">
            <Form.Label className="text-white">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-3 form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicEmail">
            <Form.Label className="text-white">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-3 form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPhone">
            <Form.Label className="text-white">Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-3 form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-3 form-control-custom"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicAvatar">
            <Form.Label className="text-white">Avatar</Form.Label>
            <Form.Control
              type="file"
              onChange={avatarHandler}
              className="rounded-3 form-control-custom"
            />
          </Form.Group>

          <Form.Group className="text-center mb-4">
            <Form.Label className="text-white">
              Already Registered?{" "}
              <Link to={"/login"} className="text-decoration-none text-light fw-bold">
                Login Now
              </Link>
            </Form.Label>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 text-light fw-bold fs-5 rounded-3 py-2"
          >
            Register
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default Register;

