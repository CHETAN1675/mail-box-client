import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MailView() {
  const { box, mailId } = useParams(); // box is inbox or sent
  const [mail, setMail] = useState(null);

  const emailKey = (localStorage.getItem("email") || "").replace(/\./g, "_");

  useEffect(() => {
    if (!mailId || !emailKey) return;

    async function fetchMail() {
      try {
        const url = `https://mailbox-react-abc123-default-rtdb.firebaseio.com/mails/${box}/${emailKey}/${mailId}.json`;
        const res = await fetch(url);
        const data = await res.json();
        setMail(data);
      } catch (err) {
        console.error("Error loading mail:", err);
      }
    }

    fetchMail();
  }, [box, mailId, emailKey]);

  if (!mail) return <div className="small-muted">Loading...</div>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ width: 240 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1 }}>
        <h4>{mail.subject}</h4>

        <div className="small-muted" style={{ marginBottom: 10 }}>
          {box === "inbox" ? `From: ${mail.from}` : `To: ${mail.to}`} •{" "}
          {new Date(mail.date).toLocaleString()}
        </div>

        <div dangerouslySetInnerHTML={{ __html: mail.message }} />
      </div>
    </div>
  );
}
