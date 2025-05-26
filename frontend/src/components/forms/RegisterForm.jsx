import React, { useState } from "react";
import axios from "axios";
import { setAuthToken } from "../../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

const RegisterForm = ({ onRegister }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const url = isRegisterMode
        ? "http://localhost:8000/users/register"
        : "http://localhost:8000/users/login";

      const payload = isRegisterMode
        ? { name, email, password }
        : { email, password };

      const res = await axios.post(url, payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setAuthToken(token);
      onRegister();
    } catch (err) {
      const errorText =
        err.response?.data?.error || err.message || "Authentication failed.";
      setErrorMsg(errorText);
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col>
            <Card className="shadow-lg p-4" style={{ width: "22rem" }}>
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  {isRegisterMode ? "Register" : "Login"}
                </Card.Title>

                {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {isRegisterMode && (
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    {isRegisterMode ? "Register" : "Login"}
                  </Button>
                </Form>

                <div className="mt-3 text-center">
                  {isRegisterMode
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <Button
                    variant="link"
                    onClick={() => {
                      setIsRegisterMode(!isRegisterMode);
                      setErrorMsg("");
                      setName("");
                      setEmail("");
                      setPassword("");
                    }}
                  >
                    {isRegisterMode ? "Login here" : "Register here"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterForm;
