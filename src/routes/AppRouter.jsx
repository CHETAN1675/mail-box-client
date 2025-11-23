import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import Navbar from "../components/Header";
import { Spinner } from "react-bootstrap";

// Lazy-loaded components
const AuthForm = lazy(() => import("../components/AuthForm"));
const ComposeMail = lazy(() => import("../components/ComposeMail"));
const Inbox = lazy(() => import("../components/Inbox"));
const Sent = lazy(() => import("../components/Sent"));
const MailView = lazy(() => import("../components/MailView"));

// Protected route wrapper
function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/auth" />;
}

// Fallback loader for lazy-loaded components
function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <>
      <div className="app-hero" />
      <Navbar />
      <div className="container-main">
        <div className="sidebar" />
        <div className="content">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/auth" element={<AuthForm />} />

              <Route
                path="/compose"
                element={
                  <ProtectedRoute>
                    <div className="mail-card"><ComposeMail /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/inbox"
                element={
                  <ProtectedRoute>
                    <div className="mail-card"><Inbox /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sent"
                element={
                  <ProtectedRoute>
                    <div className="mail-card"><Sent /></div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/mail/:box/:mailId"
                element={
                  <ProtectedRoute>
                    <div className="mail-card"><MailView /></div>
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/inbox" />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
}
