"use client";

import { useState, useEffect } from "react";

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  type: "deadline" | "meeting" | "appointment" | "reminder";
  emailId?: string;
  description?: string;
  reminderMinutes?: number;
};

type Props = {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onEventClick: (event: CalendarEvent) => void;
};

export default function CalendarView({ events, onAddEvent, onDeleteEvent, onEventClick }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "deadline": return "#EF4444";
      case "meeting": return "#3B82F6";
      case "appointment": return "#8B5CF6";
      case "reminder": return "#10B981";
      default: return "#6B7280";
    }
  };

  return (
    <div style={{ padding: 20, background: "white", borderRadius: 18, height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
          📅 Calendar
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg,#6D28D9,#2563EB)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          + Add Event
        </button>
      </div>

      {/* Month Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button onClick={goToPreviousMonth} style={navButton}>←</button>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937" }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={goToNextMonth} style={navButton}>→</button>
      </div>

      {/* Calendar Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} style={{ textAlign: "center", fontWeight: 700, fontSize: 12, color: "#6B7280", padding: 8 }}>
            {day}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: 100 }} />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDate(day);
          const isToday = new Date().getDate() === day &&
            new Date().getMonth() === currentDate.getMonth() &&
            new Date().getFullYear() === currentDate.getFullYear();

          return (
            <div
              key={day}
              style={{
                minHeight: 100,
                padding: 8,
                borderRadius: 12,
                border: isToday ? "2px solid #2563EB" : "1px solid #E5E7EB",
                background: isToday ? "#EEF2FF" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: isToday ? "#2563EB" : "#111827", marginBottom: 4 }}>
                {day}
              </div>
              {dayEvents.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  style={{
                    fontSize: 10,
                    padding: "3px 6px",
                    borderRadius: 6,
                    background: getEventColor(event.type),
                    color: "white",
                    marginBottom: 2,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600 }}>
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div style={{ marginTop: 30 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          📌 Upcoming Events
        </h3>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {events
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map(event => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  marginBottom: 8,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{event.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                  </div>
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: getEventColor(event.type),
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const navButton = {
  padding: "8px 16px",
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  background: "white",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 16,
  color: "#111827",
};
