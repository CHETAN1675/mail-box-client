import { useState } from "react";
import { useQuill } from "react-quilljs";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { DB_URL } from "../firebaseDB";
import { Button } from "react-bootstrap";
import "./ComposeMail.css";
import "quill/dist/quill.snow.css";

export default function ComposeMail() {
  const userEmail = useSelector((state) => state.auth.email) || "";
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");

  // react-quilljs
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote"],
        ["clean"],
      ],
    },
     formats: [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "blockquote",
    "clean"
  ],
    theme: "snow",
    placeholder: "Compose your message...",
  });

  const sendMailHandler = async () => {
    const body = quill ? quill.root.innerHTML : "";

    if (!to || !subject || !body || body.trim() === "") {
      alert("Please fill To, Subject and Body.");
      return;
    }

    const mailId = uuid();
    const date = new Date().toISOString();
    const timestamp = Date.now();

    const receiverKey = to.replace(/\./g, "_");
    const senderKey = (userEmail || "unknown").replace(/\./g, "_");

 const receiverPayload = {
      id: mailId,
      from: userEmail,
      subject,
      message: body,
      date,
      timestamp,
      read: false,
    };

    const senderPayload = {
      id: mailId,
      to,
      subject,
      message: body,
      date,
      timestamp,
      read: true,
    };


    try {
      await fetch(
        `${DB_URL}/mails/inbox/${receiverKey}/${mailId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(receiverPayload),
        }
      );

      await fetch(
        `https://mailbox-client-app-a6ede-default-rtdb.firebaseio.com/mails/sent/${senderKey}/${mailId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(senderPayload),
        }
      );

      alert("Mail sent");
      setTo("");
      setSubject("");
      if (quill) quill.setText("");
    } catch (err) {
      console.error(err);
      alert("Error sending mail");
    }
  };

  return (
    <div className="compose-wrapper" >
      <div style={{ marginBottom: 12 }}>
        <input
        className="compose-input"
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
         className="compose-input"
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="compose-editor">
        <div ref={quillRef} style={{ height: "240px" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={sendMailHandler} className="compose-send">
          Send
        </Button>
      </div>
    </div>
  );
}
