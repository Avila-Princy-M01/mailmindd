import { NextResponse } from "next/server";
import { findSimilarEmails, buildRAGContext } from "@/utils/ragHelpers";

// OpenRouter configuration for Qwen 2.5 Coder 32B Instruct
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "qwen/qwen-2.5-coder-32b-instruct";

export async function POST(req: Request) {
  try {
    const { subject, snippet, body, from, date, useRAG = true } = await req.json();

    // Combine email content
    const emailContent = `
Subject: ${subject}
From: ${from}
Date: ${date}
Body: ${snippet || body || ""}
    `.trim();

    // RAG: Find similar past emails for context
    let ragContext = "";
    let similarEmailsCount = 0;
    if (useRAG) {
      const similarEmails = await findSimilarEmails(`${subject} ${snippet || body}`, 3);
      if (similarEmails.length > 0) {
        ragContext = buildRAGContext(similarEmails);
        similarEmailsCount = similarEmails.length;
      }
    }

    // Step 1: Analyze email and create action plan
    const analysisResponse = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
        "X-Title": "MailMind",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `You are an AI email assistant with access to past email context. Analyze the email and create an action plan.

${ragContext}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code blocks, no extra text):
{
  "summary": "Brief 2-line summary of the email",
  "needsReply": true,
  "replyDraft": "Draft reply text here",
  "hasEvent": false,
  "eventDetails": null,
  "taskTitle": "Actionable task title (3-6 words)",
  "priority": "medium",
  "suggestedFollowUp": "Follow-up action or null",
  "canAutoArchive": false,
  "ragUsed": ${useRAG && ragContext.length > 0},
  "similarEmailsCount": ${similarEmailsCount}
}

CRITICAL RULES:
- Return ONLY the JSON object
- No markdown formatting (no \`\`\`json)
- No explanations before or after
- All string values must be in quotes
- Use null for empty values, not "null" string
- needsReply, hasEvent, canAutoArchive must be boolean (true/false)
- priority must be one of: "high", "medium", "low"`,
          },
          {
            role: "user",
            content: emailContent,
          },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json();
      throw new Error(errorData.error?.message || "OpenRouter API request failed");
    }

    const analysisData = await analysisResponse.json();
    let analysisText = analysisData.choices[0].message.content || "{}";
    
    // Clean up the response - remove markdown code blocks if present
    analysisText = analysisText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    // Extract JSON from response (handle cases where AI adds extra text)
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response:", analysisText);
      // Return a default response
      return NextResponse.json({
        success: true,
        actions: {
          summary: "Email received: " + subject,
          needsReply: false,
          replyDraft: null,
          hasEvent: false,
          eventDetails: null,
          taskTitle: "Review: " + subject.substring(0, 30),
          priority: "medium",
          suggestedFollowUp: null,
          canAutoArchive: false,
        },
      });
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse JSON:", jsonMatch[0]);
      // Return a default response
      return NextResponse.json({
        success: true,
        actions: {
          summary: "Email received: " + subject,
          needsReply: false,
          replyDraft: null,
          hasEvent: false,
          eventDetails: null,
          taskTitle: "Review: " + subject.substring(0, 30),
          priority: "medium",
          suggestedFollowUp: null,
          canAutoArchive: false,
        },
      });
    }

    // Step 2: Generate detailed reply if needed and not already provided
    let finalReply = analysis.replyDraft;
    if (analysis.needsReply && (!finalReply || finalReply === "null" || finalReply.trim() === "")) {
      try {
        const replyResponse = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
            "X-Title": "MailMind",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: "You are a professional email assistant. Write a polite, concise reply. Return ONLY the reply text, no extra formatting.",
              },
              {
                role: "user",
                content: `Write a professional reply to this email:\n\n${emailContent}`,
              },
            ],
            temperature: 0.4,
            max_tokens: 300,
          }),
        });
        
        if (replyResponse.ok) {
          const replyData = await replyResponse.json();
          finalReply = replyData.choices[0].message.content;
        }
      } catch (replyError) {
        console.error("Reply generation error:", replyError);
        // Continue without reply
      }
    }

    // Return comprehensive action plan
    return NextResponse.json({
      success: true,
      actions: {
        summary: analysis.summary || "Email received",
        needsReply: analysis.needsReply === true,
        replyDraft: finalReply && finalReply !== "null" ? finalReply : null,
        hasEvent: analysis.hasEvent === true,
        eventDetails: analysis.eventDetails || null,
        taskTitle: analysis.taskTitle || "Review email",
        priority: analysis.priority || "medium",
        suggestedFollowUp: analysis.suggestedFollowUp || null,
        canAutoArchive: analysis.canAutoArchive === true,
      },
    });
  } catch (error: any) {
    console.error("HANDLE FOR ME ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process email",
      },
      { status: 500 }
    );
  }
}
