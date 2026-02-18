"use client";

import { useState } from "react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  activeTasksCount: number;
  responseRate: number;
};

type AssignedEmail = {
  emailId: string;
  assignedTo: string;
  assignedBy: string;
  deadline?: string;
  status: "assigned" | "in-progress" | "waiting-on-client" | "completed";
  notes: string[];
  priority: number;
};

type Props = {
  teamMembers: TeamMember[];
  assignedEmails: AssignedEmail[];
  onAssignEmail: (emailId: string, memberId: string, deadline?: string, notes?: string) => void;
  onUpdateStatus: (emailId: string, status: string) => void;
  onAddNote: (emailId: string, note: string) => void;
};

export default function TeamCollaboration({
  teamMembers,
  assignedEmails,
  onAssignEmail,
  onUpdateStatus,
  onAddNote,
}: Props) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "assignments" | "members">("dashboard");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "#3B82F6";
      case "in-progress": return "#F59E0B";
      case "waiting-on-client": return "#8B5CF6";
      case "completed": return "#10B981";
      default: return "#6B7280";
    }
  };

  const getWorkloadLevel = (count: number) => {
    if (count > 10) return { level: "High", color: "#EF4444" };
    if (count > 5) return { level: "Medium", color: "#F59E0B" };
    return { level: "Low", color: "#10B981" };
  };

  const totalPending = assignedEmails.filter(e => e.status !== "completed").length;
  const avgResponseRate = teamMembers.reduce((sum, m) => sum + m.responseRate, 0) / teamMembers.length;

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 18, height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
          👥 Team Collaboration
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280" }}>
          Shared email intelligence workspace for your team
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #E5E7EB" }}>
        {[
          { id: "dashboard", label: "📊 Dashboard", icon: "📊" },
          { id: "assignments", label: "📋 Assignments", icon: "📋" },
          { id: "members", label: "👥 Team Members", icon: "👥" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 14,
              color: activeTab === tab.id ? "#2563EB" : "#6B7280",
              borderBottom: activeTab === tab.id ? "3px solid #2563EB" : "none",
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div>
          {/* Metrics Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            <MetricCard
              title="Total Pending"
              value={totalPending}
              icon="📧"
              color="#3B82F6"
            />
            <MetricCard
              title="Avg Response Rate"
              value={`${avgResponseRate.toFixed(0)}%`}
              icon="⚡"
              color="#10B981"
            />
            <MetricCard
              title="Team Members"
              value={teamMembers.length}
              icon="👥"
              color="#8B5CF6"
            />
          </div>

          {/* Workload Distribution */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
              📊 Workload Distribution
            </h3>
            {teamMembers.map(member => {
              const workload = getWorkloadLevel(member.activeTasksCount);
              return (
                <div
                  key={member.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #E5E7EB",
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 800,
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>
                        {member.activeTasksCount} active tasks • {member.responseRate}% response rate
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: workload.color,
                      color: "white",
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {workload.level}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Suggestions */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
              border: "1px solid #C7D2FE",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>
              🤖 AI Workload Suggestions
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#1E3A8A", fontSize: 13 }}>
              {teamMembers
                .filter(m => m.activeTasksCount > 8)
                .map(m => (
                  <li key={m.id} style={{ marginBottom: 4 }}>
                    <strong>{m.name}</strong> has {m.activeTasksCount} pending tasks - consider redistributing
                  </li>
                ))}
              {teamMembers.filter(m => m.activeTasksCount > 8).length === 0 && (
                <li>Workload is well balanced across the team ✅</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="🔍 Search assignments..."
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          {assignedEmails.map(assignment => {
            const assignee = teamMembers.find(m => m.id === assignment.assignedTo);
            return (
              <div
                key={assignment.emailId}
                style={{
                  padding: 16,
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  marginBottom: 12,
                  background: selectedEmail === assignment.emailId ? "#F9FAFB" : "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: getStatusColor(assignment.status),
                          color: "white",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {assignment.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "#F3F4F6",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Priority: {assignment.priority}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 4 }}>
                      Email ID: {assignment.emailId}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      Assigned to: <strong>{assignee?.name}</strong>
                      {assignment.deadline && ` • Deadline: ${assignment.deadline}`}
                    </div>
                  </div>
                  <select
                    value={assignment.status}
                    onChange={(e) => onUpdateStatus(assignment.emailId, e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="waiting-on-client">Waiting on Client</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Internal Notes */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>
                    💬 Internal Notes
                  </div>
                  {assignment.notes.map((note, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        background: "#F9FAFB",
                        fontSize: 12,
                        color: "#374151",
                        marginBottom: 6,
                      }}
                    >
                      {note}
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="Add internal note (use @name to tag)"
                      value={selectedEmail === assignment.emailId ? noteText : ""}
                      onChange={(e) => {
                        setSelectedEmail(assignment.emailId);
                        setNoteText(e.target.value);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #E5E7EB",
                        fontSize: 12,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={() => {
                        if (noteText.trim()) {
                          onAddNote(assignment.emailId, noteText);
                          setNoteText("");
                        }
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#2563EB",
                        color: "white",
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team Members Tab */}
      {activeTab === "members" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {teamMembers.map(member => {
            const workload = getWorkloadLevel(member.activeTasksCount);
            return (
              <div
                key={member.id}
                style={{
                  padding: 20,
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  background: "white",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#6D28D9,#2563EB)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {member.email}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Active Tasks</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {member.activeTasksCount}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Response Rate</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {member.responseRate}%
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>Workload</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: workload.color,
                      color: "white",
                    }}
                  >
                    {workload.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        background: "white",
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>
        {title}
      </div>
    </div>
  );
}
