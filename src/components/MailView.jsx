import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { useSelector } from "react-redux";


import Sidebar from "./Sidebar";
import { DB_URL } from "../firebaseDB";
import "./MailView.css";

export default function MailView() {
  const { box, mailId } = useParams(); // box is inbox or sent
  const [mail, setMail] = useState(null);
const currentEmail = useSelector((state) => state.auth.email) || "";
  const emailKey = currentEmail.replace(/\./g, "_");

  const navigate = useNavigate();

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

  async function handleDelete() {
    if (!window.confirm("Delete this mail permanently?")) return;

  const url = `${DB_URL}/mails/${box}/${emailKey}/${mailId}.json`;

  try {
    await fetch(url, { method: "DELETE" });

    navigate(`/mail/${box}`); // go back to inbox/sent list
  } catch (err) {
    console.error("Delete failed:", err);
  }
}


  if (!mail) return <div className="small-muted">Loading...</div>;

  return (
    <div className="mailview-container">
      <div style={{ width: 240 }}>
        <Sidebar />
      </div>

      <div className="mailview-main">
        <div className="mailview-header">
        <h4>{mail.subject}</h4>

      <button  className="mailview-delete-btn" onClick={handleDelete}>Delete</button>
       </div>
        <div className="mailview-meta">
          {box === "inbox" ? `From: ${mail.from}` : `To: ${mail.to}`} •{" "}
          {mail.date? new Date(mail.date).toLocaleString():""}
        </div>
        <div className="mailview-body" dangerouslySetInnerHTML={{ __html: mail.message }}/>
      </div>
      </div>
   
  );
}
