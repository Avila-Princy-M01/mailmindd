import { Email, PriorityResult } from "@/types";
import { extractEmail, getInitials, getPriorityColor } from "@/utils/emailHelpers";

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  isStarred: boolean;
  aiPriority?: PriorityResult;
  onClick: () => void;
  onToggleStar: () => void;
}

export default function EmailListItem({
  email,
  isSelected,
  isStarred,
  aiPriority,
  onClick,
  onToggleStar,
}: EmailListItemProps) {
  const senderEmail = extractEmail(email.from);
  const initials = getInitials(senderEmail);
  const isUnread = email.labelIds?.includes("UNREAD");

  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #E5E7EB",
        cursor: "pointer",
        background: isSelected ? "#EFF6FF" : isUnread ? "#F9FAFB" : "white",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = isUnread ? "#F9FAFB" : "white";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Email Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontWeight: isUnread ? 700 : 500,
                fontSize: 14,
                color: "#111827",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email.from?.split("<")[0].trim() || senderEmail}
            </span>
            
            {aiPriority && (
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: getPriorityColor(aiPriority.score),
                  color: "white",
                  fontWeight: 600,
                }}
              >
                P{aiPriority.score}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: isUnread ? 600 : 400,
              color: "#374151",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginBottom: 4,
            }}
          >
            {email.subject || "(No Subject)"}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#6B7280",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {email.snippet}
          </div>
        </div>

        {/* Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            padding: 4,
            flexShrink: 0,
          }}
        >
          {isStarred ? "⭐" : "☆"}
        </button>

        {/* Date */}
        <div
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            flexShrink: 0,
            minWidth: 60,
            textAlign: "right",
          }}
        >
          {new Date(email.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
