"use client";

import { useState } from "react";

interface ComposeModalProps {
  showCompose: boolean;
  setShowCompose: (show: boolean) => void;
}

export default function ComposeModal({
  showCompose,
  setShowCompose,
}: ComposeModalProps) {
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  if (!showCompose) return null;

  const sendComposedEmail = async () => {
    if (!composeTo || !composeSubject || !composeBody) {
      alert("❌ Please fill in all fields (To, Subject, Body)");
      return;
    }

    setSendingEmail(true);

    try {
      const res = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Email sent successfully!");
        setComposeTo("");
        setComposeSubject("");
        setComposeBody("");
        setShowCompose(false);
      } else {
        alert("❌ Error: " + (data.error || "Failed to send email"));
      }
    } catch (error) {
      alert("❌ Failed to send email. Check console for details.");
    }

    setSendingEmail(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
      onClick={() => setShowCompose(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 24,
          padding: 32,
          width: "90%",
          maxWidth: 600,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
          ✍ Compose Email
        </h2>

        <input
          type="email"
          placeholder="To: recipient@example.com"
          value={composeTo}
          onChange={(e) => setComposeTo(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            marginBottom: 14,
            fontSize: 14,
          }}
        />

        <input
          type="text"
          placeholder="Subject"
          value={composeSubject}
          onChange={(e) => setComposeSubject(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            marginBottom: 14,
            fontSize: 14,
          }}
        />

        <textarea
          placeholder="Write your message..."
          value={composeBody}
          onChange={(e) => setComposeBody(e.target.value)}
          rows={10}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            marginBottom: 20,
            fontSize: 14,
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={sendComposedEmail}
            disabled={sendingEmail}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: sendingEmail
                ? "#9CA3AF"
                : "linear-gradient(135deg,#2563EB,#0EA5E9)",
              color: "white",
              fontWeight: 700,
              cursor: sendingEmail ? "not-allowed" : "pointer",
            }}
          >
            {sendingEmail ? "Sending..." : "Send Email →"}
          </button>

          <button
            onClick={() => setShowCompose(false)}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
