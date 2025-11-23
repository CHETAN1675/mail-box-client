import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { DB_URL } from "../firebaseDB";
import "./Inbox.css";
import "./MailRow.css";

export default function Inbox() {
  const [mails, setMails] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0);

  const currentEmail = useSelector((state) => state.auth.email) || "";
  const key = currentEmail.replace(/\./g, "_");

  useEffect(() => {
    if (!key){
      setMails([]);
      setUnreadCount(0);
      return;
    };
let cancelled;

    async function loadInbox() {
      try {
        const res = await fetch(`${DB_URL}/mails/inbox/${key}.json`);
        const data = await res.json();

        if (!data) {
          if(!cancelled){
          setMails([]);
          setUnreadCount(0);
          }
         
          return;
        }

        const arr = Object.entries(data).map(([id, mail]) => ({
          id,
          ...mail,
        }));

        arr.sort((a, b) => (b.timestamp || 0)- (a.timestamp || 0));
        if(!cancelled){
          setMails(arr);
          setUnreadCount(arr.filter((m)=>m.read!==true).length);
        }
      } catch (err) {
        console.error("Error loading inbox:", err);
      }
    }

    loadInbox();
    const interval = setInterval(loadInbox, 15000); // refresh every 15s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [key]);

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
