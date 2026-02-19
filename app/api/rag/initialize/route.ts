import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { initializeRAG, getRAGStats } from "@/utils/ragHelpers";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { emails } = await req.json();

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: "Emails array required" }, { status: 400 });
    }

    await initializeRAG(emails);
    const stats = getRAGStats();

    return NextResponse.json({
      success: true,
      stats,
      message: `RAG initialized with ${stats.totalEmails} emails`,
    });
  } catch (error: any) {
    console.error("RAG initialization error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = getRAGStats();

    return NextResponse.json({
      stats,
      ragEnabled: true,
    });
  } catch (error: any) {
    console.error("RAG stats error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
