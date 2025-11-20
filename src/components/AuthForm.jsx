import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";


export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !confirmPassword)) {
      setError("Fill all fields");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const URL = isLogin
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBXUG_HOGxUmxeBTtnzu_YOowRSdwTlYzY"
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBXUG_HOGxUmxeBTtnzu_YOowRSdwTlYzY";

    try {
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Authentication failed");
      }

      onAuth(data.idToken);
       navigate("/home");
       
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <Card className="p-4 shadow auth-card">
        <h3 className="text-center mb-3">{isLogin ? "Login" : "Sign Up"}</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          )}

          <Button type="submit" className="w-100 mt-2">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </Form>

        <Button
          variant="light"
          className="w-100 mt-3 border"
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? "Create an account" : "Already have an account? Login"}
        </Button>
      </Card>
    </div>
  );
}
