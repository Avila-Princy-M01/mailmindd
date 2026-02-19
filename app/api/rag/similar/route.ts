import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { findSimilarEmails, storeEmailEmbedding } from "@/utils/ragHelpers";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { queryText, topK = 3, excludeEmailId, senderEmail } = await req.json();

    if (!queryText) {
      return NextResponse.json({ error: "Query text required" }, { status: 400 });
    }

    const similarEmails = await findSimilarEmails(queryText, topK, excludeEmailId, senderEmail);

    return NextResponse.json({
      similarEmails,
      count: similarEmails.length,
      ragEnabled: true,
      filteredBySender: !!senderEmail,
      senderEmail: senderEmail || null,
    });
  } catch (error: any) {
    console.error("RAG similar search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
