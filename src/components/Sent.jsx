import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import useFetchMails from "../hooks/useFetchMails"; 
import "./Sent.css";
import "./MailRow.css";

 

export default function Sent() {
  const email = useSelector((state) => state.auth.email) || "";
  const { mails } = useFetchMails("sent", email);
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <Sidebar  unreadCount={0} />
      </div>

      <div style={{ flex: 1 }}>
        <h5>Sent</h5>

        {mails.length === 0 && <div className="small-muted">No sent mails</div>}

        {mails.map((m) => (
          <Link
            key={m.id}
            to={`/mail/sent/${m.id}`}
            style={{ textDecoration: "none", color: "inherit" , display: "block" }}
          >
            <div className="mail-row">
              <div className="unread-dot--invisible" />
                <div className="mail-row__content">
                <div className="mail-row__top">
                <div className="mail-row__sender">{m.to}</div>
                  <div className="mail-row__subject">{m.subject}</div>
                </div>

                <div
                  className="mail-row__snippet"
                  dangerouslySetInnerHTML={{
                    __html:
                      (m.message || "").replace(/<[^>]+>/g, "").slice(0, 120) +
                      ((m.message || "").replace(/<[^>]+>/g, "").length > 120 ? "..." : ""),
                  }}
                />
              </div>

              <div className="mail-row__time">
                {m.date ? new Date(m.date).toLocaleString():""}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
