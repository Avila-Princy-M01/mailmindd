import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// In-memory storage (replace with database in production)
let teamAssignments: any[] = [];
let teamMembers: any[] = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul@company.com",
    activeTasksCount: 5,
    responseRate: 92,
  },
  {
    id: "2",
    name: "Anjali Sharma",
    email: "anjali@company.com",
    activeTasksCount: 3,
    responseRate: 88,
  },
  {
    id: "3",
    name: "Priya Singh",
    email: "priya@company.com",
    activeTasksCount: 8,
    responseRate: 95,
  },
];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      assignments: teamAssignments,
      members: teamMembers,
    });
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
    const { emailId, assignedTo, deadline, notes, priority } = body;

    const assignment = {
      emailId,
      assignedTo,
      assignedBy: (session as any).user?.email,
      deadline,
      status: "assigned",
      notes: notes ? [notes] : [],
      priority: priority || 50,
      createdAt: new Date().toISOString(),
    };

    teamAssignments.push(assignment);

    // Update member's active task count
    const member = teamMembers.find(m => m.id === assignedTo);
    if (member) {
      member.activeTasksCount++;
    }

    return NextResponse.json({ assignment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { emailId, status, note } = body;

    const assignment = teamAssignments.find(a => a.emailId === emailId);
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (status) {
      const oldStatus = assignment.status;
      assignment.status = status;

      // Update member's active task count
      if (status === "completed" && oldStatus !== "completed") {
        const member = teamMembers.find(m => m.id === assignment.assignedTo);
        if (member && member.activeTasksCount > 0) {
          member.activeTasksCount--;
        }
      }
    }

    if (note) {
      assignment.notes.push(note);
    }

    return NextResponse.json({ assignment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
