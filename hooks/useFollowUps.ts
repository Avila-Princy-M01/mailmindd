import { useState, useEffect } from "react";
import { Email } from "@/types";

export interface FollowUp {
  emailId: string;
  email: Email;
  reminder: string;
  daysUntilFollowUp: number;
  createdAt: string;
  followUpDate: string;
}

export function useFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loadingFollowUp, setLoadingFollowUp] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("followUps");
    if (saved) {
      setFollowUps(JSON.parse(saved));
    }
  }, []);

  async function addFollowUp(email: Email) {
    setLoadingFollowUp(true);

    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: email.subject,
          snippet: email.snippet || email.body || "",
          from: email.from,
          date: email.date,
        }),
      });

      const data = await res.json();

      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + data.daysUntilFollowUp);

      const newFollowUp: FollowUp = {
        emailId: email.id,
        email,
        reminder: data.reminder,
        daysUntilFollowUp: data.daysUntilFollowUp,
        createdAt: new Date().toISOString(),
        followUpDate: followUpDate.toISOString(),
      };

      setFollowUps((prev) => {
        const updated = [newFollowUp, ...prev];
        localStorage.setItem("followUps", JSON.stringify(updated));
        return updated;
      });

      alert(`✅ Follow-up reminder set for ${data.daysUntilFollowUp} days from now`);
    } catch (error) {
      console.error("Follow-up error:", error);
      alert("❌ Failed to create follow-up reminder");
    }

    setLoadingFollowUp(false);
  }

  function removeFollowUp(emailId: string) {
    setFollowUps((prev) => {
      const updated = prev.filter(f => f.emailId !== emailId);
      localStorage.setItem("followUps", JSON.stringify(updated));
      return updated;
    });
  }

  function getDueFollowUps() {
    const now = new Date();
    return followUps.filter(f => new Date(f.followUpDate) <= now);
  }

  function getUpcomingFollowUps() {
    const now = new Date();
    return followUps.filter(f => new Date(f.followUpDate) > now);
  }

  return {
    followUps,
    loadingFollowUp,
    addFollowUp,
    removeFollowUp,
    getDueFollowUps,
    getUpcomingFollowUps,
  };
}
