import React, { useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const switchMode = () => {
    setError("");
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailInput || !password || (!isLogin && !confirmPassword)) {
      setError("Please fill all fields.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const API_KEY = "AIzaSyBXUG_HOGxUmxeBTtnzu_YOowRSdwTlYzY";
    const URL = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
      const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          email: emailInput,
          password,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        const message = data?.error?.message || "Authentication failed";
        setError(message);
        return;
      }

      // store token/email via Redux
      dispatch(login({ token: data.idToken, email: data.email || emailInput }));

      console.log("User has successfully signed up.");
      navigate("/inbox");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "72vh" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Card className="p-4 shadow-sm mail-card">
          <h3 className="text-center mb-3">{isLogin ? "Login" : "Sign Up"}</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={emailInput} onChange={(e)=>setEmailInput(e.target.value)} required />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </Form.Group>

            {!isLogin && (
              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
              </Form.Group>
            )}

            <Button disabled={loading} type="submit" className="w-100 mt-2">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form>

          <Button variant="light" className="w-100 mt-3 border" onClick={switchMode}>
            {isLogin ? "Create new account" : "Already have an account? Login"}
          </Button>
        </Card>
      </div>
    </Container>
  );
}
