import { Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const loc = useLocation();

  return (
    <div className="mail-card">
      <div style={{marginBottom: 12}}>
        <Button as={Link} to="/compose" variant="primary" className="w-100">Compose</Button>
      </div>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/inbox" active={loc.pathname === "/inbox"}>Inbox</Nav.Link>
        <Nav.Link as={Link} to="/sent" active={loc.pathname === "/sent"}>Sent</Nav.Link>
      </Nav>
    </div>
  );
}
