import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { DB_URL } from "../firebaseDB";
import "./MailView.css";

export default function MailView() {
  const { box, mailId } = useParams(); // box is inbox or sent
  const [mail, setMail] = useState(null);
const currentEmail = useSelector((state) => state.auth.email) || "";
  const emailKey = currentEmail.replace(/@./g, "_");

  useEffect(() => {
    if (!mailId || !emailKey) return;
       let cancelled = false;

    async function fetchMail() {
      try {
        const url = `${DB_URL}/mails/${box}/${emailKey}/${mailId}.json`;
        const res = await fetch(url);
        const data = await res.json();

        if(!cancelled){
         setMail(data);
        }
        
        if (box === "inbox" && data && data.read !== true) {
          try {

         await fetch(url, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
        headers:{ "Content-Type": "application/json" }    
       });

       if (!cancelled) setMail((prev) => (prev ? { ...prev, read: true } : prev));
      }catch (err) {
            console.error("Error marking mail read:", err);
          }
      }
     } catch (err) {
        console.error("Error loading mail:", err);
      }
    }

    fetchMail();

    return () => {
      cancelled = true;
    };
  }, [box, mailId, emailKey]);

  if (!mail) return <div className="small-muted">Loading...</div>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1 }}>
        <h4>{mail.subject}</h4>

        <div className="mailview-meta">
          {box === "inbox" ? `From: ${mail.from}` : `To: ${mail.to}`} •{" "}
          {mail.date? new Date(mail.date).toLocaleString():""}
        </div>

        <div dangerouslySetInnerHTML={{ __html: mail.message }} />
      </div>
    </div>
  );
}
