import React, { useState } from "react";
import ReactQuill from "react-quill";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";

export default function ComposeMail() {
  const userEmail = useSelector((state) => state.auth.email) || "";
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendMailHandler = async () => {
    if (!to || !subject || !body || body.trim() === "") {
      alert("Please fill To, Subject and Body.");
      return;
    }

    const mailId = uuid();
    const date = new Date().toISOString();

    const receiverKey = to.replace(/\./g, "_");
    const senderKey = (userEmail || "unknown").replace(/\./g, "_");

    try {
      await firebase.database().ref(`mails/inbox/${receiverKey}/${mailId}`).set({
        id: mailId,
        from: userEmail,
        subject,
        message: body,
        date,
      });

      await firebase.database().ref(`mails/sent/${senderKey}/${mailId}`).set({
        id: mailId,
        to,
        subject,
        message: body,
        date,
      });

      alert("Mail sent");
      setTo("");
      setSubject("");
      setBody("");
    } catch (err) {
      console.error(err);
      alert("Error sending mail: " + err.message);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "clean"],
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>

      <div style={{ minHeight: 260, marginBottom: 12 }}>
        <ReactQuill
          value={body}
          onChange={setBody}
          theme="snow"
          modules={quillModules}
          placeholder="Compose your message..."
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={sendMailHandler} style={{
          background: "#1a73e8", color: "#fff",
          padding: "10px 18px", border: "none", borderRadius: 6
        }}>
          Send
        </button>
      </div>
    </div>
  );
}
