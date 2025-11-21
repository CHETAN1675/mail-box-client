import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

export default function Inbox() {
  const [mails, setMails] = useState([]);
  const currentEmail = useSelector((state) => state.auth.email) || "";
  const key = currentEmail.replace(/\./g, "_") || "";

  useEffect(() => {
    if (!key) return;
    const ref = firebase.database().ref(`mails/inbox/${key}`);
    const listener = ref.on("value", (snap) => {
      const val = snap.val() || {};
      const arr = Object.values(val).sort((a,b) => new Date(b.date) - new Date(a.date));
      setMails(arr);
    });

    return () => ref.off("value", listener);
  }, [key]);

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}><Sidebar /></div>
      <div style={{ flex: 1 }}>
        <h5>Inbox</h5>
        <div>
          {mails.length === 0 && <div className="small-muted">No mails</div>}
          {mails.map((m) => (
            <Link key={m.id} to={`/mail/inbox/${m.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="mail-row">
                <div>
                  <div><strong>{m.from}</strong> - <span className="small-muted">{m.subject}</span></div>
                  <div className="small-muted" dangerouslySetInnerHTML={{ __html: (m.message || "").slice(0,120) + ((m.message||"").length>120?"...":"") }} />
                </div>
                <div className="small-muted">{new Date(m.date).toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
