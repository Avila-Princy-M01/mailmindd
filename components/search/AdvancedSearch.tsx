"use client";

import { useState } from "react";

type SearchFilters = {
  query: string;
  sender?: string;
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  hasAttachment?: boolean;
  isStarred?: boolean;
  category?: string;
};

type Props = {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
};

export default function AdvancedSearch({ onSearch, onClear }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({ query: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({ query: "" });
    onClear();
  };

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 18, marginBottom: 20 }}>
      {/* Main Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="🔍 Search emails by sender, subject, keyword, or project..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#6D28D9,#2563EB)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            background: "white",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {showAdvanced ? "Hide" : "Advanced"}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #E5E7EB" }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
              From (Sender)
            </label>
            <input
              type="text"
              placeholder="sender@example.com"
              value={filters.sender || ""}
              onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
              Subject Contains
            </label>
            <input
              type="text"
              placeholder="Project name or keyword"
              value={filters.subject || ""}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
              Date From
            </label>
            <input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
              Date To
            </label>
            <input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>
              Category
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              style={inputStyle}
            >
              <option value="">All Categories</option>
              <option value="Do Now">Do Now</option>
              <option value="Needs Decision">Needs Decision</option>
              <option value="Waiting">Waiting</option>
              <option value="Low Energy">Low Energy</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
              <input
                type="checkbox"
                checked={filters.hasAttachment || false}
                onChange={(e) => setFilters({ ...filters, hasAttachment: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Has Attachment
            </label>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
              <input
                type="checkbox"
                checked={filters.isStarred || false}
                onChange={(e) => setFilters({ ...filters, isStarred: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              Starred Only
            </label>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={handleClear}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                background: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", alignSelf: "center" }}>Quick:</span>
        {["Today", "This Week", "Last 7 Days", "This Month"].map(quick => (
          <button
            key={quick}
            onClick={() => {
              const now = new Date();
              let dateFrom = "";
              if (quick === "Today") dateFrom = now.toISOString().split("T")[0];
              else if (quick === "This Week") {
                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                dateFrom = weekStart.toISOString().split("T")[0];
              } else if (quick === "Last 7 Days") {
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                dateFrom = weekAgo.toISOString().split("T")[0];
              } else if (quick === "This Month") {
                dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
              }
              setFilters({ ...filters, dateFrom });
              onSearch({ ...filters, dateFrom });
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "white",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {quick}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  fontSize: 13,
  outline: "none",
};
