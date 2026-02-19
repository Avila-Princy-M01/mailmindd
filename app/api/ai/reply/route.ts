import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/ai-utils";
import { findSimilarEmails, buildRAGContext } from "@/utils/ragHelpers";

export async function POST(req: Request) {
    try {
        const { subject, snippet, useRAG = true, from } = await req.json();

        // RAG: Find similar past emails for context (filtered by sender)
        let ragContext = "";
        if (useRAG) {
            const senderEmail = from ? from.match(/<(.+?)>|([^\s<>]+@[^\s<>]+)/)?.[1] || from : undefined;
            const similarEmails = await findSimilarEmails(`${subject} ${snippet}`, 3, undefined, senderEmail);
            if (similarEmails.length > 0) {
                ragContext = buildRAGContext(similarEmails);
            }
        }

        const response = await callOpenRouter([
            {
                role: "system",
                content: "You are an email assistant. Write a short, polite, professional reply. Use the provided context from past emails to inform your response style and content.",
            },
            {
                role: "user",
                content: `${ragContext}
Subject: ${subject}

Email Content:
${snippet}

Write a reply message:
          `,
            },
        ], {
            temperature: 0.4,
            maxTokens: 300,
        });

        const replyText = response.choices[0].message.content;

        return NextResponse.json({
            reply: replyText || "No reply generated.",
            ragUsed: useRAG && ragContext.length > 0,
            similarEmailsCount: useRAG ? (ragContext.length > 0 ? 3 : 0) : 0,
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}
