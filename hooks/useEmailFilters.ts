import { useState, useEffect, useMemo } from "react";
import { Email, ActiveFolder } from "@/types";

export function useEmailFilters(emails: Email[], activeFolder: ActiveFolder) {
  const [sortBy, setSortBy] = useState<"none" | "priority" | "deadline" | "date" | "sender">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "today" | "tomorrow" | "week" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);
  const [doneIds, setDoneIds] = useState<string[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedStarred = localStorage.getItem("starredIds");
    const savedSnoozed = localStorage.getItem("snoozedIds");
    const savedDone = localStorage.getItem("doneIds");
    const savedSortBy = localStorage.getItem("sortBy") as any || "none";
    const savedSortOrder = localStorage.getItem("sortOrder") as any || "desc";
    const savedDeadlineFilter = localStorage.getItem("deadlineFilter") as any || "all";

    if (savedStarred) setStarredIds(JSON.parse(savedStarred));
    if (savedSnoozed) setSnoozedIds(JSON.parse(savedSnoozed));
    if (savedDone) setDoneIds(JSON.parse(savedDone));
    setSortBy(savedSortBy);
    setSortOrder(savedSortOrder);
    setDeadlineFilter(savedDeadlineFilter);
  }, []);

  // Save sort preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("sortBy", sortBy);
      localStorage.setItem("sortOrder", sortOrder);
      localStorage.setItem("deadlineFilter", deadlineFilter);
    }
  }, [sortBy, sortOrder, deadlineFilter]);

  const filteredEmails = useMemo(() => {
    let filtered = [...emails];

    // Filter by folder
    if (activeFolder === "starred") {
      filtered = filtered.filter(e => starredIds.includes(e.id));
    } else if (activeFolder === "snoozed") {
      filtered = filtered.filter(e => snoozedIds.includes(e.id));
    } else if (activeFolder === "inbox") {
      filtered = filtered.filter(e => !snoozedIds.includes(e.id) && !doneIds.includes(e.id));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e =>
        e.subject?.toLowerCase().includes(query) ||
        e.from?.toLowerCase().includes(query) ||
        e.snippet?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [emails, activeFolder, starredIds, snoozedIds, doneIds, searchQuery]);

  function toggleStar(emailId: string) {
    setStarredIds((prev) => {
      const updated = prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId];
      localStorage.setItem("starredIds", JSON.stringify(updated));
      return updated;
    });
  }

  function snoozeEmail(emailId: string) {
    setSnoozedIds((prev) => {
      const updated = [...prev, emailId];
      localStorage.setItem("snoozedIds", JSON.stringify(updated));
      return updated;
    });
  }

  function markDone(emailId: string) {
    setDoneIds((prev) => {
      const updated = [...prev, emailId];
      localStorage.setItem("doneIds", JSON.stringify(updated));
      return updated;
    });
  }

  return {
    // States
    sortBy,
    sortOrder,
    deadlineFilter,
    searchQuery,
    starredIds,
    snoozedIds,
    doneIds,
    filteredEmails,
    
    // Setters
    setSortBy,
    setSortOrder,
    setDeadlineFilter,
    setSearchQuery,
    setStarredIds,
    setSnoozedIds,
    setDoneIds,
    
    // Functions
    toggleStar,
    snoozeEmail,
    markDone,
  };
}
