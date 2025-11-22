import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

export default function Sent() {
  const [mails, setMails] = useState([]);
  const currentEmail = useSelector((state) => state.auth.email) || "";
  const key = currentEmail.replace(/\./g, "_");

  useEffect(() => {
    if (!key) return;

    async function loadSent() {
      try {
        const res = await fetch(
          `https://mailbox-client-app-a6ede-default-rtdb.firebaseio.com/mails/sent/${key}.json`
        );

        const data = await res.json();
        if (!data) {
          setMails([]);
          return;
        }

        const arr = Object.values(data).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setMails(arr);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    loadSent();
  }, [key]);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1 }}>
        <h5>Sent</h5>

        {mails.length === 0 && <div className="small-muted">No sent mails</div>}

        {mails.map((m) => (
          <Link
            key={m.id}
            to={`/mail/sent/${m.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="mail-row">
              <div>
                <div>
                  <strong>{m.to}</strong> -{" "}
                  <span className="small-muted">{m.subject}</span>
                </div>

                <div
                  className="small-muted"
                  dangerouslySetInnerHTML={{
                    __html:
                      (m.message || "").slice(0, 120) +
                      ((m.message || "").length > 120 ? "..." : ""),
                  }}
                />
              </div>

              <div className="small-muted">
                {new Date(m.date).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
