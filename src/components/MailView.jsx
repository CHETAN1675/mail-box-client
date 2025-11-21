import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MailView() {
  const { box, mailId } = useParams();
  const [mail, setMail] = useState(null);
  const key = (localStorage.getItem("email") || "").replace(/\./g, "_");

  useEffect(() => {
    if (!mailId || !key) return;
    const path = `mails/${box}/${key}/${mailId}`;
    firebase.database().ref(path).once("value").then(snap => {
      setMail(snap.val());
    }).catch(err => {
      console.error(err);
    });
  }, [box, mailId, key]);

  if (!mail) return <div className="small-muted">Loading...</div>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}><Sidebar /></div>
      <div style={{ flex: 1 }}>
        <h4>{mail.subject}</h4>
        <div className="small-muted" style={{ marginBottom: 10 }}>
          {box === "inbox" ? `From: ${mail.from}` : `To: ${mail.to}`} • {new Date(mail.date).toLocaleString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: mail.message }} />
      </div>
    </div>
  );
}
