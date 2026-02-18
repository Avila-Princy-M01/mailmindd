"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  currentPage?: "inbox" | "calendar" | "team";
  onSearch?: (query: string) => void;
};

export default function TopNavBar({ currentPage = "inbox", onSearch }: Props) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "white",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      {/* Logo & Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>
          MailMind
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          <NavButton
            label="📧 Inbox"
            active={currentPage === "inbox"}
            onClick={() => router.push("/")}
          />
          <NavButton
            label="📅 Calendar"
            active={currentPage === "calendar"}
            onClick={() => router.push("/calendar")}
          />
          <NavButton
            label="👥 Team"
            active={currentPage === "team"}
            onClick={() => router.push("/team")}
          />
        </div>
      </div>

      {/* Search (if provided) */}
      {onSearch && (
        <div style={{ flex: 1, maxWidth: 400, marginLeft: 20 }}>
          <input
            type="text"
            placeholder="🔍 Quick search..."
            onChange={(e) => onSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

function NavButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 10,
        border: "none",
        background: active ? "linear-gradient(135deg,#6D28D9,#2563EB)" : "transparent",
        color: active ? "white" : "#6B7280",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}
