# MailMind - New Features Integration Guide

## 🎯 Overview

This guide explains how to integrate the three new major features into your existing MailMind application:

1. **Calendar Integration** - Track deadlines, meetings, and appointments
2. **Advanced Search & Filtering** - Find emails by sender, project, or topic
3. **Team Collaboration** - Shared inbox with task assignment and workload management

---

## 📅 Feature 1: Calendar Integration

### What's Included

**Components:**
- `components/calendar/CalendarView.tsx` - Main calendar component with month view
- `components/calendar/ReminderPopup.tsx` - Bottom-right reminder notifications
- `app/calendar/page.tsx` - Standalone calendar page

**API Routes:**
- `app/api/calendar/events/route.ts` - CRUD operations for calendar events
- `app/api/calendar/extract/route.ts` - AI-powered event extraction from emails

**Utilities:**
- `utils/calendarHelpers.ts` - Helper functions for date parsing and event management

### How to Use

#### 1. Auto-Extract Events from Emails

Add this to your email detail view in `app/page.tsx`:

```typescript
import { extractCalendarEventsFromEmail, saveCalendarEvent } from "@/utils/calendarHelpers";

// When opening an email
const openMailAndGenerateAI = async (id: string, mailPreview: any) => {
  // ... existing code ...
  
  // Extract calendar events
  const events = await extractCalendarEventsFromEmail(fullEmailData);
  
  if (events.length > 0) {
    // Show extracted events to user
    setExtractedEvents(events);
  }
};

// Add button to save event to calendar
<button onClick={() => saveCalendarEvent({
  ...event,
  emailId: selectedMail.id,
  reminderMinutes: 15
})}>
  📅 Add to Calendar
</button>
```

#### 2. Add Navigation Link

In your main navigation (around line 500-600 in `app/page.tsx`), add:

```typescript
<Link href="/calendar">
  <button style={navButtonStyle}>
    📅 Calendar
  </button>
</Link>
```

#### 3. Enable Reminder Popups

Add to your main page state:

```typescript
const [activeReminder, setActiveReminder] = useState<any>(null);

useEffect(() => {
  // Check for reminders every minute
  const interval = setInterval(checkReminders, 60000);
  return () => clearInterval(interval);
}, []);

// At the bottom of your JSX
{activeReminder && (
  <ReminderPopup
    event={activeReminder}
    onDismiss={() => setActiveReminder(null)}
    onSnooze={(minutes) => {
      // Snooze logic
      setActiveReminder(null);
    }}
  />
)}
```

---

## 🔍 Feature 2: Advanced Search & Filtering

### What's Included

**Components:**
- `components/search/AdvancedSearch.tsx` - Advanced search UI with filters

**API Routes:**
- `app/api/search/emails/route.ts` - Server-side Gmail search

**Utilities:**
- `utils/searchHelpers.ts` - Search, grouping, and filtering helpers

### How to Use

#### 1. Add Search Component to Main Page

In `app/page.tsx`, add state and component:

```typescript
import AdvancedSearch from "@/components/search/AdvancedSearch";
import { searchEmails, filterEmailsLocally } from "@/utils/searchHelpers";

const [searchResults, setSearchResults] = useState<any[]>([]);
const [isSearching, setIsSearching] = useState(false);

const handleSearch = async (filters: any) => {
  setIsSearching(true);
  
  // Option 1: Server-side search (uses Gmail API)
  const results = await searchEmails(filters);
  setSearchResults(results);
  
  // Option 2: Client-side filtering (faster, but limited)
  // const results = filterEmailsLocally(emails, filters);
  // setSearchResults(results);
  
  setIsSearching(false);
};

const handleClearSearch = () => {
  setSearchResults([]);
  setIsSearching(false);
};

// In your JSX, before the email list
<AdvancedSearch 
  onSearch={handleSearch}
  onClear={handleClearSearch}
/>

// Use searchResults instead of emails when displaying
const displayEmails = searchResults.length > 0 ? searchResults : emails;
```

#### 2. Group Emails by Sender or Project

```typescript
import { groupEmailsBySender, groupEmailsByProject } from "@/utils/searchHelpers";

// Add view toggle
const [groupBy, setGroupBy] = useState<"none" | "sender" | "project">("none");

// Group emails
const groupedEmails = groupBy === "sender" 
  ? groupEmailsBySender(emails)
  : groupBy === "project"
  ? groupEmailsByProject(emails)
  : { "All": emails };

// Display grouped
{Object.entries(groupedEmails).map(([group, groupEmails]) => (
  <div key={group}>
    <h3>{group} ({groupEmails.length})</h3>
    {groupEmails.map(email => (
      // ... email card ...
    ))}
  </div>
))}
```

#### 3. Quick Search by Sender

Add this button to each email card:

```typescript
<button onClick={() => handleSearch({ sender: mail.from })}>
  📧 All from this sender
</button>
```

---

## 👥 Feature 3: Team Collaboration

### What's Included

**Components:**
- `components/team/TeamCollaboration.tsx` - Full team collaboration UI
- `app/team/page.tsx` - Standalone team page

**API Routes:**
- `app/api/team/assignments/route.ts` - Team assignment management

### How to Use

#### 1. Add Team Navigation

In your main navigation:

```typescript
<Link href="/team">
  <button style={navButtonStyle}>
    👥 Team
  </button>
</Link>
```

#### 2. Add "Assign to Team" Button to Emails

In your email detail view:

```typescript
const [showAssignModal, setShowAssignModal] = useState(false);
const [teamMembers, setTeamMembers] = useState<any[]>([]);

// Load team members
useEffect(() => {
  fetch("/api/team/assignments")
    .then(res => res.json())
    .then(data => setTeamMembers(data.members));
}, []);

// Assign email function
const assignEmailToTeam = async (memberId: string, deadline?: string) => {
  await fetch("/api/team/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      emailId: selectedMail.id,
      assignedTo: memberId,
      deadline,
      notes: "Assigned from inbox",
      priority: getPriorityScore(selectedMail),
    }),
  });
  
  alert("✅ Email assigned to team member!");
  setShowAssignModal(false);
};

// In your email toolbar
<button onClick={() => setShowAssignModal(true)}>
  👥 Assign to Team
</button>

// Assignment modal
{showAssignModal && (
  <div style={modalStyle}>
    <h3>Assign Email to Team Member</h3>
    {teamMembers.map(member => (
      <button 
        key={member.id}
        onClick={() => assignEmailToTeam(member.id)}
      >
        {member.name} ({member.activeTasksCount} tasks)
      </button>
    ))}
  </div>
)}
```

#### 3. Show Team Assignments in Sidebar

```typescript
const [teamAssignments, setTeamAssignments] = useState<any[]>([]);

useEffect(() => {
  fetch("/api/team/assignments")
    .then(res => res.json())
    .then(data => setTeamAssignments(data.assignments));
}, []);

// In sidebar
<div>
  <h3>Team Assignments ({teamAssignments.length})</h3>
  {teamAssignments.map(assignment => (
    <div key={assignment.emailId}>
      {assignment.emailId} → {assignment.assignedTo}
      <span>{assignment.status}</span>
    </div>
  ))}
</div>
```

---

## 🔗 Complete Integration Example

Here's how to add all features to your main page:

```typescript
// app/page.tsx additions

import AdvancedSearch from "@/components/search/AdvancedSearch";
import ReminderPopup from "@/components/calendar/ReminderPopup";
import TopNavBar from "@/components/dashboard/TopNavBar";
import { extractCalendarEventsFromEmail } from "@/utils/calendarHelpers";
import { searchEmails } from "@/utils/searchHelpers";

export default function Home() {
  // ... existing state ...
  
  // New state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeReminder, setActiveReminder] = useState<any>(null);
  const [extractedEvents, setExtractedEvents] = useState<any[]>([]);
  
  // Search handler
  const handleSearch = async (filters: any) => {
    const results = await searchEmails(filters);
    setSearchResults(results);
  };
  
  // Enhanced email opening
  const openMailAndGenerateAI = async (id: string, mailPreview: any) => {
    // ... existing code ...
    
    // Extract calendar events
    const events = await extractCalendarEventsFromEmail(fullEmailData);
    setExtractedEvents(events);
  };
  
  return (
    <div>
      {/* Top Navigation */}
      <TopNavBar currentPage="inbox" onSearch={(q) => handleSearch({ query: q })} />
      
      {/* Advanced Search */}
      <AdvancedSearch 
        onSearch={handleSearch}
        onClear={() => setSearchResults([])}
      />
      
      {/* Email List */}
      <EmailList emails={searchResults.length > 0 ? searchResults : emails} />
      
      {/* Calendar Events from Email */}
      {extractedEvents.length > 0 && (
        <div style={calendarEventsStyle}>
          <h3>📅 Events Found in Email</h3>
          {extractedEvents.map(event => (
            <button onClick={() => saveCalendarEvent(event)}>
              Add: {event.title} - {event.date}
            </button>
          ))}
        </div>
      )}
      
      {/* Reminder Popup */}
      {activeReminder && (
        <ReminderPopup
          event={activeReminder}
          onDismiss={() => setActiveReminder(null)}
          onSnooze={(min) => setActiveReminder(null)}
        />
      )}
    </div>
  );
}
```

---

## 🗄️ Database Setup (Production)

For production, replace in-memory storage with a database:

### Calendar Events Schema

```sql
CREATE TABLE calendar_events (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  date DATETIME NOT NULL,
  time VARCHAR(10),
  type ENUM('deadline', 'meeting', 'appointment', 'reminder'),
  email_id VARCHAR(255),
  description TEXT,
  reminder_minutes INT DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Team Assignments Schema

```sql
CREATE TABLE team_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email_id VARCHAR(255) NOT NULL,
  assigned_to VARCHAR(255) NOT NULL,
  assigned_by VARCHAR(255) NOT NULL,
  deadline DATE,
  status ENUM('assigned', 'in-progress', 'waiting-on-client', 'completed'),
  priority INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  note TEXT NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES team_assignments(id)
);
```

---

## 🎨 Styling Tips

All components use inline styles for easy customization. To match your theme:

1. Update color variables in components
2. Replace gradient colors: `#6D28D9` and `#2563EB`
3. Adjust border radius for consistency
4. Update font weights and sizes

---

## 🚀 Next Steps

1. **Test Calendar**: Open an email with a deadline → see if events are extracted
2. **Test Search**: Search for a sender name → verify results
3. **Test Team**: Assign an email → check team dashboard
4. **Add Navigation**: Link all three features from main page
5. **Customize UI**: Match colors and styles to your design

---

## 📝 Notes

- Calendar events are stored per user (uses session email)
- Team assignments are shared across team members
- Search uses Gmail API for server-side search (more accurate)
- All features work with existing email data structure
- No breaking changes to existing functionality

---

## 🐛 Troubleshooting

**Calendar events not extracting?**
- Check GROQ_API_KEY is set in `.env`
- Verify email has date/time mentions

**Search not working?**
- Ensure Gmail API scopes include `gmail.readonly`
- Check session has valid access token

**Team page empty?**
- Default team members are hardcoded in API
- Replace with database query in production

---

## 💡 Enhancement Ideas

- Add Google Calendar sync
- Email threading view
- Team chat integration
- Mobile responsive design
- Export calendar to .ics
- Slack notifications for assignments
- Advanced analytics dashboard

---

Need help? Check the component files for detailed inline comments!
