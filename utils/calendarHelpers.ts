export async function extractCalendarEventsFromEmail(email: any) {
  try {
    const res = await fetch("/api/calendar/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: email.subject,
        body: email.body,
        snippet: email.snippet,
      }),
    });

    const data = await res.json();
    return data.events || [];
  } catch (error) {
    console.error("Failed to extract calendar events:", error);
    return [];
  }
}

export async function saveCalendarEvent(event: any) {
  try {
    const res = await fetch("/api/calendar/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error("Failed to save calendar event:", error);
    return null;
  }
}

export function parseDeadlineFromText(text: string): Date | null {
  const lower = text.toLowerCase();
  const now = new Date();

  // Today
  if (lower.includes("today")) {
    return now;
  }

  // Tomorrow
  if (lower.includes("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // This week
  if (lower.includes("this week")) {
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    return endOfWeek;
  }

  // Next week
  if (lower.includes("next week")) {
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  }

  // Match date patterns like "Feb 25" or "25 Feb"
  const dateMatch = text.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthMap: any = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = monthMap[dateMatch[2].toLowerCase()];
    const year = now.getFullYear();
    return new Date(year, month, day);
  }

  // Match date patterns like "2026-02-25"
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (isoMatch) {
    return new Date(isoMatch[0]);
  }

  return null;
}

export function extractTimeFromText(text: string): string | undefined {
  // Match patterns like "2:00 PM", "14:00", "2pm"
  const timeMatch = text.match(/\b(\d{1,2}):?(\d{2})?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

  return undefined;
}
