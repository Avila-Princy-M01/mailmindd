import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is not configured");
}

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json({
      reminder: "Follow up on this email",
      daysUntilFollowUp: 3,
    }, { status: 500 });
  }

  try {
    const { subject, snippet, from, date } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "You are an email assistant. Generate a concise follow-up reminder. Return ONLY a JSON object with this structure: {\"reminder\": \"short reminder text\", \"daysUntilFollowUp\": number}. No markdown, no extra text.",
          },
          {
            role: "user",
            content: `Generate a follow-up reminder for this email:

Subject: ${subject}
From: ${from}
Date: ${date}
Content: ${snippet}

Consider: Does this need a reply? Is it time-sensitive? When should I follow up?`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Groq API request failed");
    }

    const data = await response.json();
    let resultText = data.choices[0]?.message?.content || "{}";
    
    // Clean up response
    resultText = resultText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return NextResponse.json({
        reminder: `Follow up on: ${subject}`,
        daysUntilFollowUp: 3,
      });
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      reminder: result.reminder || `Follow up on: ${subject}`,
      daysUntilFollowUp: result.daysUntilFollowUp || 3,
    });
  } catch (err: any) {
    console.error("Follow-up generation error:", err.message);
    return NextResponse.json(
      {
        reminder: "Follow up on this email",
        daysUntilFollowUp: 3,
      },
      { status: 500 }
    );
  }
}
