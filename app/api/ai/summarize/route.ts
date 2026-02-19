import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/ai-utils";
import { findSimilarEmails, buildRAGContext } from "@/utils/ragHelpers";

export async function POST(req: Request) {
  try {
    const { subject, snippet, from, date, useRAG = true } = await req.json();

    // ✅ Trim input to avoid token overload
    const safeSnippet = (snippet || "").slice(0, 2000);

    // RAG: Find similar past emails for context (filtered by sender)
    let ragContext = "";
    let similarEmailsCount = 0;
    if (useRAG) {
      const senderEmail = from ? from.match(/<(.+?)>|([^\s<>]+@[^\s<>]+)/)?.[1] || from : undefined;
      const similarEmails = await findSimilarEmails(`${subject} ${safeSnippet}`, 3, undefined, senderEmail);
      if (similarEmails.length > 0) {
        ragContext = buildRAGContext(similarEmails);
        similarEmailsCount = similarEmails.length;
      }
    }

    const response = await callOpenRouter([
      {
        role: "user",
        content: `
You are an email assistant with access to past email context.

${ragContext}

Summarize this email clearly in this format:

📩 From: ...
📅 Received Date: ...
⏳ Deadline: (if mentioned)
📌 Summary: (2-3 lines)
${similarEmailsCount > 0 ? '🔍 Context: Based on ' + similarEmailsCount + ' previous emails from this sender' : ''}

Email:

Subject: ${subject}
From: ${from}
Received: ${date}

Body:
${safeSnippet}
          `,
      },
    ], {
      temperature: 0.3,
      maxTokens: 500,
    });

    const summary = response.choices[0].message.content;

    return NextResponse.json({
      summary,
      ragUsed: useRAG && ragContext.length > 0,
      similarEmailsCount,
    });
  } catch (error: any) {
    console.error("SUMMARY ERROR:", error);

    // ✅ Handle Rate Limit
    if (error?.message?.includes("rate limit") || error?.message?.includes("429")) {
      return NextResponse.json(
        {
          summary:
            "⚠️ API rate limit reached. Please wait 1 minute and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { summary: "❌ Error generating summary" },
      { status: 500 }
    );
  }
}
