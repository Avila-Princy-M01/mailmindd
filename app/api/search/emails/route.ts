import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const filters = await req.json();

    const auth = new google.auth.OAuth2();
    auth.setCredentials({
      access_token: (session as any).accessToken,
    });

    const gmail = google.gmail({ version: "v1", auth });

    // Build Gmail search query
    let query = "";

    if (filters.query) {
      query += filters.query + " ";
    }

    if (filters.sender) {
      query += `from:${filters.sender} `;
    }

    if (filters.subject) {
      query += `subject:${filters.subject} `;
    }

    if (filters.dateFrom) {
      query += `after:${filters.dateFrom.replace(/-/g, "/")} `;
    }

    if (filters.dateTo) {
      query += `before:${filters.dateTo.replace(/-/g, "/")} `;
    }

    if (filters.hasAttachment) {
      query += "has:attachment ";
    }

    if (filters.isStarred) {
      query += "is:starred ";
    }

    query = query.trim();

    // Search Gmail
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: query || undefined,
      maxResults: 5,
    });

    const messages = listRes.data.messages || [];

    // Fetch full details
    const emails = await Promise.all(
      messages.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: m.id!,
          format: "metadata",
          metadataHeaders: ["Subject", "From", "Date"],
        });

        const headers = msg.data.payload?.headers || [];
        const get = (name: string) =>
          headers.find((h: any) => h.name === name)?.value || "";

        return {
          id: m.id,
          subject: get("Subject"),
          from: get("From"),
          date: get("Date") || new Date().toISOString(),
          snippet: msg.data.snippet || "",
        };
      })
    );

    // Apply category filter if specified
    let filteredEmails = emails;
    if (filters.category) {
      filteredEmails = emails.filter((email) => {
        const category = getEmailCategory(email);
        return category === filters.category;
      });
    }

    return NextResponse.json({ emails: filteredEmails, query });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getEmailCategory(mail: any) {
  const subject = (mail.subject || "").toLowerCase();
  const snippet = (mail.snippet || "").toLowerCase();
  const text = subject + " " + snippet;

  if (
    text.includes("urgent") ||
    text.includes("asap") ||
    text.includes("today") ||
    text.includes("deadline today")
  ) {
    return "Do Now";
  }

  if (
    text.includes("decision") ||
    text.includes("approve") ||
    text.includes("confirm") ||
    text.includes("rsvp")
  ) {
    return "Needs Decision";
  }

  if (
    text.includes("update") ||
    text.includes("newsletter") ||
    text.includes("notification")
  ) {
    return "Waiting";
  }

  return "Low Energy";
}
