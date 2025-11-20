import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Navigation from "../components/Navbar";

export default function AppRouter() {
  const [token, setToken] = useState(null);

  const handleAuth = (idToken) => {
    setToken(idToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <>
      <Navigation isLoggedIn={!!token} onLogout={handleLogout} />

      <Routes>
        <Route path="/auth" element={<AuthForm onAuth={handleAuth} />} />
        <Route
          path="/home"
          element={token ? <h1 className="text-center">Welcome To HomePage!!</h1> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}
