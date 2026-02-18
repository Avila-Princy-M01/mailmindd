// TypeScript interfaces for MailMind

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body?: string;
  date: string;
  label?: string[];
  attachments?: Attachment[];
}

export interface Attachment {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId: string;
}

export interface PriorityResult {
  score: number;
  reason: string;
}

export interface CategoryResult {
  category: "Do Now" | "Needs Decision" | "Waiting" | "Low Energy";
  confidence: number;
}

export interface SpamResult {
  isSpam: boolean;
  confidence: number;
  reason: string;
}

export interface DeadlineResult {
  deadline: string | null;
  urgency: string;
  confidence: number;
}

export interface ArchivedEmail extends Email {
  completedAt: string;
  completedDate: string;
  todoTitle?: string;
}

export interface WeeklyAnalysis {
  weekEmails: number;
  tasksCompleted: number;
  urgentCount: number;
  highPriorityCount: number;
  lateNightCount: number;
  stressScore: number;
  stressLevel: string;
  stressColor: string;
  burnoutRisk: string;
  burnoutColor: string;
  productivityRate: number;
  recommendations: string[];
}

export interface BurnoutStats {
  stressScore: number;
  stressLevel: string;
  workloadTrend: string;
  recommendation: string;
}

export type SortBy = "none" | "priority" | "deadline" | "date" | "sender";
export type SortOrder = "asc" | "desc";
export type DeadlineFilter = "all" | "today" | "tomorrow" | "week" | "overdue";
export type ActiveFolder = "inbox" | "starred" | "snoozed" | "done" | "drafts" | "archive";
export type ActiveTab = "All Mails" | "Do Now" | "Waiting" | "Needs Decision" | "Low Energy";

export interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}
