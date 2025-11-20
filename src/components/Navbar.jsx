import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function Navigation({ isLoggedIn, onLogout }) {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand>Mail-Box-Client</Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="m-auto">
            {isLoggedIn && (
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!isLoggedIn && <Nav.Link as={Link} to="/auth">Login</Nav.Link>}

            {isLoggedIn && (
              <Nav.Link onClick={onLogout} style={{ color: "red" }}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
