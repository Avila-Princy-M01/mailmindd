export async function searchEmails(filters: any) {
  try {
    const res = await fetch("/api/search/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });

    const data = await res.json();
    return data.emails || [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export function filterEmailsLocally(emails: any[], filters: any) {
  let filtered = [...emails];

  // Filter by query (search in subject, from, snippet)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(email => {
      const searchText = `${email.subject} ${email.from} ${email.snippet}`.toLowerCase();
      return searchText.includes(query);
    });
  }

  // Filter by sender
  if (filters.sender) {
    const sender = filters.sender.toLowerCase();
    filtered = filtered.filter(email => 
      email.from?.toLowerCase().includes(sender)
    );
  }

  // Filter by subject
  if (filters.subject) {
    const subject = filters.subject.toLowerCase();
    filtered = filtered.filter(email => 
      email.subject?.toLowerCase().includes(subject)
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filtered = filtered.filter(email => {
      const emailDate = new Date(email.date);
      return emailDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter(email => {
      const emailDate = new Date(email.date);
      return emailDate <= toDate;
    });
  }

  return filtered;
}

export function groupEmailsBySender(emails: any[]) {
  const grouped: any = {};

  emails.forEach(email => {
    const sender = email.from?.split("<")[0].trim() || "Unknown";
    if (!grouped[sender]) {
      grouped[sender] = [];
    }
    grouped[sender].push(email);
  });

  return grouped;
}

export function groupEmailsByProject(emails: any[]) {
  const grouped: any = {
    "Uncategorized": []
  };

  emails.forEach(email => {
    const subject = email.subject || "";
    
    // Extract project name from subject (common patterns)
    let project = "Uncategorized";
    
    // Pattern: [ProjectName]
    const bracketMatch = subject.match(/\[([^\]]+)\]/);
    if (bracketMatch) {
      project = bracketMatch[1];
    }
    
    // Pattern: ProjectName:
    const colonMatch = subject.match(/^([^:]+):/);
    if (colonMatch && !bracketMatch) {
      project = colonMatch[1].trim();
    }

    if (!grouped[project]) {
      grouped[project] = [];
    }
    grouped[project].push(email);
  });

  return grouped;
}

export function getEmailThread(emails: any[], currentEmail: any) {
  const subject = currentEmail.subject?.replace(/^(re:|fwd?:)\s*/i, "").trim();
  
  return emails.filter(email => {
    const emailSubject = email.subject?.replace(/^(re:|fwd?:)\s*/i, "").trim();
    return emailSubject === subject;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
