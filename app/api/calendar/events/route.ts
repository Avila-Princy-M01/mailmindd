import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// In-memory storage (replace with database in production)
let calendarEvents: any[] = [];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = (session as any).user?.email;

    // Filter events for this user
    const userEvents = calendarEvents.filter(e => e.userId === userId);

    return NextResponse.json({ events: userEvents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const userId = (session as any).user?.email;

    const newEvent = {
      id: Date.now().toString(),
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    };

    calendarEvents.push(newEvent);

    return NextResponse.json({ event: newEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");
    const userId = (session as any).user?.email;

    calendarEvents = calendarEvents.filter(
      e => !(e.id === eventId && e.userId === userId)
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
