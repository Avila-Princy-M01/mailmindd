import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { subject, body, snippet } = await req.json();

    const emailText = `${subject}\n\n${body || snippet}`;

    const prompt = `Extract calendar events from this email. Return ONLY a JSON array of events.

Email:
${emailText}

Extract:
- Meetings (with date, time if mentioned)
- Deadlines (with date)
- Appointments (with date, time)
- Reminders (with date)

Return format:
[
  {
    "title": "Meeting with client",
    "date": "2026-02-25",
    "time": "14:00",
    "type": "meeting",
    "description": "Discuss Q1 budget"
  }
]

If no events found, return empty array [].
IMPORTANT: Return ONLY valid JSON, no other text.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || "[]";
    
    // Extract JSON from response
    let events = [];
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        events = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("Failed to parse events:", e);
    }

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error("Calendar extraction error:", error);
    return NextResponse.json({ events: [], error: error.message });
  }
}
