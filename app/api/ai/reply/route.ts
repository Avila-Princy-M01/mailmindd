import { NextResponse } from "next/server";
import { findSimilarEmails, buildRAGContext } from "@/utils/ragHelpers";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is not configured");
}

export async function POST(req: Request) {
    if (!GROQ_API_KEY) {
        return NextResponse.json({
            reply: "Unable to generate reply. API key not configured.",
        }, { status: 500 });
    }

    try {
        const { subject, snippet, useRAG = false, from } = await req.json();

        // ✅ Validate input
        if (!subject && !snippet) {
            return NextResponse.json({
                reply: "Please provide email content to generate a reply.",
            });
        }

        // RAG: Find similar past emails for context (filtered by sender)
        let ragContext = "";
        let similarEmailsCount = 0;
        if (useRAG) {
            try {
                const senderEmail = from ? from.match(/<(.+?)>|([^\s<>]+@[^\s<>]+)/)?.[1] || from : undefined;
                const similarEmails = await findSimilarEmails(`${subject} ${snippet}`, 3, undefined, senderEmail);
                if (similarEmails.length > 0) {
                    ragContext = buildRAGContext(similarEmails);
                    similarEmailsCount = similarEmails.length;
                }
            } catch (ragError) {
                console.error("RAG error (non-fatal):", ragError);
                // Continue without RAG if it fails
            }
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 300,
                temperature: 0.4,
                messages: [
                    {
                        role: "system",
                        content: "You are an email assistant. Write a short, polite, professional reply. Keep it concise and actionable." + 
                                 (ragContext ? " Use the provided context from past emails to inform your response." : ""),
                    },
                    {
                        role: "user",
                        content: `${ragContext ? ragContext + "\n\n" : ""}Subject: ${subject || "No subject"}

Email Content:
${snippet || "No content"}

Write a professional reply:`,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Reply API Error:", response.status, errorText);
            return NextResponse.json({
                reply: "Thank you for your email. I will review it and get back to you soon.",
            });
        }

        const data = await response.json();
        const replyText = data.choices[0]?.message?.content || "Thank you for your email. I will respond shortly.";
        
        return NextResponse.json({
            reply: replyText,
            ragUsed: useRAG && ragContext.length > 0,
            similarEmailsCount,
        });
    } catch (err: any) {
        console.error("Reply Generation Error:", err.message);
        return NextResponse.json(
            {
                reply: "Thank you for your email. I will review it and respond soon.",
                error: err.message
            },
            { status: 500 }
        );
    }
}
