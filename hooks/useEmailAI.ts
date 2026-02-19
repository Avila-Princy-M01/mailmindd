import { useState } from "react";
import { Email, PriorityResult } from "@/types";
import { cleanEmailBody } from "@/utils/emailHelpers";

export function useEmailAI() {
  const [aiSummary, setAiSummary] = useState("");
  const [aiReason, setAiReason] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [loadingReply, setLoadingReply] = useState(false);
  const [editableReply, setEditableReply] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [aiPriorityMap, setAiPriorityMap] = useState<Record<string, PriorityResult>>({});
  const [aiTodoTitles, setAiTodoTitles] = useState<Record<string, string>>({});
  
  // RAG states
  const [similarEmails, setSimilarEmails] = useState<Email[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  
  // Agent states
  const [agentProcessing, setAgentProcessing] = useState(false);
  const [agentActions, setAgentActions] = useState<any>(null);
  const [agentStep, setAgentStep] = useState(0);
  const [showAgentModal, setShowAgentModal] = useState(false);

  async function generateSummary(mail: Email) {
    setLoadingAI(true);
    const emailContent = cleanEmailBody(mail.body || mail.snippet || "");

    if (!emailContent) {
      setAiSummary("⚠️ No email content available.");
      setLoadingAI(false);
      return;
    }

    const res = await fetch("/api/ai/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: mail.subject,
        snippet: emailContent,
        from: mail.from,
        date: mail.date,
      }),
    });

    const data = await res.json();
    setAiSummary(data.summary || "No summary generated.");
    setLoadingAI(false);
  }

  async function generateExplanation(mail: Email) {
    setLoadingAI(true);
    const res = await fetch("/api/ai/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: mail.subject || "",
        snippet: mail.snippet || mail.body || "",
        from: mail.from,
        date: mail.date,
      }),
    });
    const data = await res.json();
    setAiReason(data.explanation || "No explanation generated.");
    setLoadingAI(false);
  }

  async function generateReply(selectedMail: Email) {
    if (!selectedMail) {
      alert("Please select an email first");
      return;
    }

    setLoadingReply(true);
    setAiReply("");

    try {
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedMail.subject,
          snippet: selectedMail.snippet || selectedMail.body || "",
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
        setLoadingReply(false);
        return;
      }

      setAiReply(data.reply);
      setEditableReply(data.reply);
    } catch (error) {
      alert("Failed to generate reply. Check console for details.");
    }

    setLoadingReply(false);
  }

  async function generateAIPriorityForMail(mail: Email) {
    if (aiPriorityMap[mail.id]) return;

    const res = await fetch("/api/ai/priority", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: mail.subject,
        snippet: mail.snippet,
      }),
    });

    const data = await res.json();

    if (data.result?.score) {
      setAiPriorityMap((prev) => ({
        ...prev,
        [mail.id]: data.result,
      }));
    }
  }

  async function generateAITodoTitle(mail: Email) {
    if (aiTodoTitles[mail.id]) return;

    try {
      const res = await fetch("/api/ai/todo-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: mail.subject,
          snippet: mail.snippet,
        }),
      });

      const data = await res.json();

      if (data.title) {
        setAiTodoTitles((prev) => ({
          ...prev,
          [mail.id]: data.title,
        }));
      }
    } catch (error) {
      // Silent fail
    }
  }

  async function handleForMe(selectedMail: Email) {
    if (!selectedMail) {
      alert("Please select an email first");
      return;
    }

    setAgentProcessing(true);
    setShowAgentModal(true);
    setAgentStep(0);
    setAgentActions(null);

    try {
      setAgentStep(1);
      await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch("/api/ai/handle-for-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedMail.subject,
          snippet: selectedMail.snippet || "",
          body: selectedMail.body || "",
          from: selectedMail.from,
          date: selectedMail.date,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to process email");
      }

      setAgentActions(data.actions);
      setAgentStep(2);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (data.actions.hasEvent) {
        setAgentStep(3);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      if (data.actions.needsReply) {
        setAgentStep(4);
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setAgentStep(5);
    } catch (error: any) {
      console.error("Handle For Me error:", error);
      alert("❌ Agent failed: " + error.message);
      setShowAgentModal(false);
    }

    setAgentProcessing(false);
  }

  return {
    // States
    aiSummary,
    aiReason,
    loadingAI,
    aiReply,
    loadingReply,
    editableReply,
    copied,
    sending,
    aiPriorityMap,
    aiTodoTitles,
    similarEmails,
    loadingSimilar,
    showSimilar,
    agentProcessing,
    agentActions,
    agentStep,
    showAgentModal,
    
    // Setters
    setAiSummary,
    setAiReason,
    setAiReply,
    setEditableReply,
    setCopied,
    setSending,
    setAiTodoTitles,
    setSimilarEmails,
    setLoadingSimilar,
    setShowSimilar,
    setShowAgentModal,
    
    // Functions
    generateSummary,
    generateExplanation,
    generateReply,
    generateAIPriorityForMail,
    generateAITodoTitle,
    handleForMe,
  };
}
