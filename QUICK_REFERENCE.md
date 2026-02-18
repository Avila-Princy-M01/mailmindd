# 🚀 MailMind New Features - Quick Reference

## 📁 File Structure

```
app/
├── calendar/
│   └── page.tsx                    # Calendar page
├── team/
│   └── page.tsx                    # Team collaboration page
└── api/
    ├── calendar/
    │   ├── events/route.ts         # CRUD for calendar events
    │   └── extract/route.ts        # AI event extraction
    ├── search/
    │   └── emails/route.ts         # Advanced email search
    └── team/
        └── assignments/route.ts    # Team assignment management

components/
├── calendar/
│   ├── CalendarView.tsx           # Main calendar component
│   └── ReminderPopup.tsx          # Bottom-right reminder
├── search/
│   └── AdvancedSearch.tsx         # Search UI with filters
├── team/
│   └── TeamCollaboration.tsx      # Team dashboard
└── dashboard/
    └── TopNavBar.tsx              # Navigation bar

utils/
├── calendarHelpers.ts             # Calendar utilities
└── searchHelpers.ts               # Search & grouping utilities
```

---

## 🔗 Quick Integration Snippets

### Add Navigation Links

```typescript
// In app/page.tsx
import Link from "next/link";

<div style={{ display: "flex", gap: 12 }}>
  <Link href="/calendar">
    <button>📅 Calendar</button>
  </Link>
  <Link href="/team">
    <button>👥 Team</button>
  </Link>
</div>
```

### Add Search to Main Page

```typescript
import AdvancedSearch from "@/components/search/AdvancedSearch";
import { searchEmails } from "@/utils/searchHelpers";

const [searchResults, setSearchResults] = useState<any[]>([]);

<AdvancedSearch 
  onSearch={async (filters) => {
    const results = await searchEmails(filters);
    setSearchResults(results);
  }}
  onClear={() => setSearchResults([])}
/>
```

### Extract Calendar Events from Email

```typescript
import { extractCalendarEventsFromEmail, saveCalendarEvent } from "@/utils/calendarHelpers";

// When opening email
const events = await extractCalendarEventsFromEmail(email);

// Show to user
{events.map(event => (
  <button onClick={() => saveCalendarEvent({
    ...event,
    emailId: email.id,
    reminderMinutes: 15
  })}>
    📅 Add: {event.title}
  </button>
))}
```

### Assign Email to Team

```typescript
// Add assign button
<button onClick={async () => {
  await fetch("/api/team/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailId: selectedMail.id,
      assignedTo: "member-id",
      deadline: "2026-03-01",
      notes: "Please handle this",
      priority: 80,
    }),
  });
}}>
  👥 Assign to Team
</button>
```

### Add Reminder Popup

```typescript
import ReminderPopup from "@/components/calendar/ReminderPopup";

const [activeReminder, setActiveReminder] = useState<any>(null);

// At bottom of JSX
{activeReminder && (
  <ReminderPopup
    event={activeReminder}
    onDismiss={() => setActiveReminder(null)}
    onSnooze={(minutes) => {
      setTimeout(() => setActiveReminder(activeReminder), minutes * 60000);
      setActiveReminder(null);
    }}
  />
)}
```

---

## 🎯 Common Use Cases

### 1. Search All Emails from One Sender

```typescript
import { searchEmails } from "@/utils/searchHelpers";

const results = await searchEmails({ 
  sender: "john@company.com" 
});
```

### 2. Group Emails by Project

```typescript
import { groupEmailsByProject } from "@/utils/searchHelpers";

const grouped = groupEmailsByProject(emails);
// Returns: { "Project Alpha": [...], "Project Beta": [...] }

Object.entries(grouped).map(([project, emails]) => (
  <div key={project}>
    <h3>{project} ({emails.length})</h3>
    {/* Render emails */}
  </div>
))
```

### 3. Get Email Thread

```typescript
import { getEmailThread } from "@/utils/searchHelpers";

const thread = getEmailThread(allEmails, currentEmail);
// Returns all emails in same conversation
```

### 4. Parse Deadline from Text

```typescript
import { parseDeadlineFromText, extractTimeFromText } from "@/utils/calendarHelpers";

const deadline = parseDeadlineFromText("Submit by Feb 25");
// Returns: Date object for Feb 25, 2026

const time = extractTimeFromText("Meeting at 2:30 PM");
// Returns: "14:30"
```

### 5. Load Team Assignments

```typescript
const res = await fetch("/api/team/assignments");
const data = await res.json();

const members = data.members;      // Team members list
const assignments = data.assignments; // All assignments
```

---

## 🎨 Styling Reference

### Color Palette

```typescript
// Primary Colors
const colors = {
  primary: "#2563EB",      // Blue
  secondary: "#6D28D9",    // Purple
  success: "#10B981",      // Green
  warning: "#F59E0B",      // Orange
  danger: "#EF4444",       // Red
  
  // Event Types
  deadline: "#EF4444",     // Red
  meeting: "#3B82F6",      // Blue
  appointment: "#8B5CF6",  // Purple
  reminder: "#10B981",     // Green
  
  // Status Colors
  assigned: "#3B82F6",
  inProgress: "#F59E0B",
  waiting: "#8B5CF6",
  completed: "#10B981",
};
```

### Common Styles

```typescript
const buttonStyle = {
  padding: "10px 18px",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg,#6D28D9,#2563EB)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 14,
};

const cardStyle = {
  padding: 20,
  borderRadius: 18,
  border: "1px solid #E5E7EB",
  background: "white",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #E5E7EB",
  fontSize: 14,
  outline: "none",
};
```

---

## 📊 API Quick Reference

### Calendar Events

```typescript
// GET - Load all events
fetch("/api/calendar/events")

// POST - Create event
fetch("/api/calendar/events", {
  method: "POST",
  body: JSON.stringify({
    title: "Team Meeting",
    date: "2026-02-25",
    time: "14:00",
    type: "meeting",
    emailId: "email-123",
    description: "Discuss Q1 goals",
    reminderMinutes: 15,
  })
})

// DELETE - Remove event
fetch("/api/calendar/events?id=event-123", { method: "DELETE" })

// POST - Extract events from email
fetch("/api/calendar/extract", {
  method: "POST",
  body: JSON.stringify({
    subject: email.subject,
    body: email.body,
    snippet: email.snippet,
  })
})
```

### Email Search

```typescript
// POST - Search with filters
fetch("/api/search/emails", {
  method: "POST",
  body: JSON.stringify({
    query: "budget",              // General search
    sender: "john@company.com",   // From specific sender
    subject: "review",            // Subject contains
    dateFrom: "2026-02-01",       // After date
    dateTo: "2026-02-28",         // Before date
    hasAttachment: true,          // Has files
    isStarred: true,              // Starred only
    category: "Do Now",           // Category filter
  })
})
```

### Team Assignments

```typescript
// GET - Load team data
fetch("/api/team/assignments")

// POST - Create assignment
fetch("/api/team/assignments", {
  method: "POST",
  body: JSON.stringify({
    emailId: "email-123",
    assignedTo: "member-id",
    deadline: "2026-03-01",
    notes: "Handle this urgently",
    priority: 80,
  })
})

// PATCH - Update assignment
fetch("/api/team/assignments", {
  method: "PATCH",
  body: JSON.stringify({
    emailId: "email-123",
    status: "in-progress",        // Update status
    note: "Working on it now",    // Add note
  })
})
```

---

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx
```

### Team Members (Temporary)

Edit `app/api/team/assignments/route.ts`:

```typescript
let teamMembers = [
  { id: "1", name: "Alice", email: "alice@co.com", activeTasksCount: 5, responseRate: 92 },
  { id: "2", name: "Bob", email: "bob@co.com", activeTasksCount: 3, responseRate: 88 },
];
```

---

## 🐛 Debugging

### Calendar not showing events?

```typescript
// Check if events are loading
console.log("Events:", events);

// Check API response
fetch("/api/calendar/events")
  .then(r => r.json())
  .then(d => console.log("API Response:", d));
```

### Search not working?

```typescript
// Check filters
console.log("Search filters:", filters);

// Check API response
fetch("/api/search/emails", {
  method: "POST",
  body: JSON.stringify(filters)
})
  .then(r => r.json())
  .then(d => console.log("Search results:", d));
```

### Team assignments not saving?

```typescript
// Check session
console.log("Session:", session);

// Check API response
fetch("/api/team/assignments")
  .then(r => r.json())
  .then(d => console.log("Team data:", d));
```

---

## ✅ Testing Checklist

### Calendar
- [ ] Navigate to /calendar
- [ ] See current month displayed
- [ ] Click on a date
- [ ] Add new event
- [ ] Event appears on calendar
- [ ] Reminder pops up at scheduled time

### Search
- [ ] Type in search box
- [ ] Results appear
- [ ] Click "Advanced"
- [ ] Fill filters
- [ ] Get filtered results
- [ ] Clear search works

### Team
- [ ] Navigate to /team
- [ ] See team dashboard
- [ ] View team members
- [ ] Assign an email
- [ ] Update assignment status
- [ ] Add internal note
- [ ] Check workload metrics

---

## 🚀 Performance Tips

1. **Lazy load components**
   ```typescript
   const CalendarView = dynamic(() => import("@/components/calendar/CalendarView"));
   ```

2. **Debounce search**
   ```typescript
   const debouncedSearch = debounce(handleSearch, 300);
   ```

3. **Cache search results**
   ```typescript
   const [searchCache, setSearchCache] = useState<Map>(new Map());
   ```

4. **Paginate team assignments**
   ```typescript
   const [page, setPage] = useState(1);
   const pageSize = 20;
   ```

---

## 📚 Additional Resources

- **Full Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Feature Documentation**: See `NEW_FEATURES_README.md`
- **Component Comments**: Check inline comments in component files
- **API Documentation**: See route files for detailed comments

---

**Quick Links:**
- Calendar: http://localhost:3000/calendar
- Team: http://localhost:3000/team
- Main Inbox: http://localhost:3000/

---

*Last Updated: February 2026*
