import { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";

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
        ["blockquote", "clean"],
      ],
    },
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

    const receiverKey = to.replace(/\./g, "_");
    const senderKey = (userEmail || "unknown").replace(/\./g, "_");

    try {
      await fetch(
        `https://mailbox-client-app-a6ede-default-rtdb.firebaseio.com/mails/inbox/${receiverKey}/${mailId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: mailId,
            from: userEmail,
            subject,
            message: body,
            date,
          }),
        }
      );

      await fetch(
        `https://mailbox-client-app-a6ede-default-rtdb.firebaseio.com/mails/sent/${senderKey}/${mailId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            id: mailId,
            to,
            subject,
            message: body,
            date,
          }),
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
        <div ref={quillRef} style={{ height: "240px" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={sendMailHandler}
          style={{
            background: "#1a73e8",
            color: "#fff",
            padding: "10px 18px",
            border: "none",
            borderRadius: 6,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
