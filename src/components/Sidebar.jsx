import { Nav, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"

export default function Sidebar({ unreadCount = 0 }) {
  const loc = useLocation();
   const inboxLabel = `Inbox${unreadCount > 0 ? ` (${unreadCount})` : ""}`;

  return (
    <div className="mail-card">
      <div style={{marginBottom: 12}}>
        <Button as={Link} to="/compose" variant="primary" className="w-100">Compose</Button>
      </div>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/inbox" active={loc.pathname === "/inbox"}>{inboxLabel}</Nav.Link>
        <Nav.Link as={Link} to="/sent" active={loc.pathname === "/sent"}>Sent</Nav.Link>
      </Nav>
    </div>
  );
}
