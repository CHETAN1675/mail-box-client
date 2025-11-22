import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Header";
import AuthForm from "../components/authform";
import ComposeMail from "../components/ComposeMail";
import Inbox from "../components/Inbox";
import Sent from "../components/sent";
import MailView from "../components/mailview";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/auth" />;
}

export default function AppRouter() {
  return (
    <>
      <div className="app-hero" />
      <Navbar />
      <div className="container-main">
        <div className="sidebar" />
        <div className="content">
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
        </div>
      </div>
    </>
  );
}
