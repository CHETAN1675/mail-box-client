import { useState } from "react";
import { Navbar, Container, Nav, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, setEmail } from "../store/authSlice";

export default function Hearder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [temp, setTemp] = useState(auth.email || "");

  const handleSetUser = (e) => {
    e.preventDefault();
    if (!temp) return;
    dispatch(setEmail(temp));
    alert("Current user set to: " + temp);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">Mail Box Client</Navbar.Brand>

        <Nav className="m-auto">
          {auth.isLoggedIn ? <Nav.Link as={Link} to="/inbox">Home</Nav.Link> : <div style={{padding: "8px 12px"}} className="small-muted">Home</div>}
        </Nav>

        <Form className="d-flex align-items-center me-2" onSubmit={handleSetUser}>
          <Form.Control
            type="email"
            placeholder="set current user email"
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            style={{ width: 260, marginRight: 8 }}
          />
          <Button variant="outline-primary" size="sm" type="submit">Set</Button>
        </Form>

        <div style={{ marginLeft: 12, fontSize: 14 }} className="small-muted">
          {auth.email || "Not logged in"}
        </div>

        <div style={{ marginLeft: 12 }}>
          {auth.isLoggedIn ? (
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button as={Link} to="/auth" variant="outline-primary" size="sm">Login</Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
