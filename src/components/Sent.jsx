import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { DB_URL } from "../firebaseDB";
import "./Sent.css";
import "./MailRow.css";

export default function Sent() {
  const [mails, setMails] = useState([]);
  const currentEmail = useSelector((state) => state.auth.email) || "";
  const key = currentEmail.replace(/[@.]/g, "_");

  useEffect(() => {
    if (!key) return;

    let cancelled = false;

    async function loadSent() {
      try {
        const res = await fetch (`${DB_URL}/mails/sent/${key}.json`);

        const data = await res.json();
        if (!data) {
          if(!cancelled) setMails([]);
          return;
        }

         const arr = Object.values(data).map((mail) => ({
          id: mail.id,
          ...mail,
        }));

     arr.sort((a, b) => (new Date(b.date) - new Date(a.date)));

        if(!cancelled) setMails(arr);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    loadSent();

        const interval = setInterval(loadSent, 15000);
        return () => clearInterval(interval);

  }, [key]);

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
