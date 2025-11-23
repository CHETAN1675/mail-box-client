import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import useFetchMails from "../hooks/useFetchMails";
import "./Inbox.css";
import "./MailRow.css";

export default function Inbox() {
 
 const email = useSelector((state) => state.auth.email) || "";
  const { mails, unreadCount } = useFetchMails("inbox", email);


  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <Sidebar unreadCount={unreadCount} />
      </div>

      <div style={{ flex: 1 }}>
        <h5>Inbox</h5>

        <div>
          {mails.length === 0 && (
            <div className="small-muted">No mails</div>
          )}

          {mails.map((m) => (
            <Link
              key={m.id}
              to={`/mail/inbox/${m.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display:"block",
              }}
            >
              <div className="mail-row" role="button" aria-label={`Open mail ${m.subject}`} > {/* Left unread dot (visible only for unread) */}
               {m.read === true ? (
                  <div className="unread-dot--invisible" />
                ) : (
                  <div className="unread-dot" />
                )}

                <div className="mail-row__content">
                  <div className="mail-row__top">
                    <div className="mail-row__sender">{m.from}</div>
                    <div className="mail-row__subject"> - {m.subject}</div>
                  </div>

                  <div
                    className="mail-row__snippet"
                    dangerouslySetInnerHTML={{
                      __html:
                        (m.message || "").slice(0, 120) +
                        ((m.message || "").length > 120 ? "..." : ""),
                    }}
                  />
                </div>

                <div className="mail-row__time">
                   {m.date ? new Date(m.date).toLocaleString() : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
