// RAG (Retrieval-Augmented Generation) Helper Functions
// Simple in-memory vector store for email embeddings

import { callOpenRouter } from "./openrouter";

// In-memory storage for email embeddings
let emailEmbeddings: Array<{
  emailId: string;
  subject: string;
  body: string;
  from: string;
  embedding: number[];
  timestamp: number;
}> = [];

// Generate embedding for text using OpenRouter
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use a simple hash-based embedding for speed (TF-IDF style)
    // In production, you'd use OpenRouter's embedding model
    return simpleTextEmbedding(text);
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return simpleTextEmbedding(text);
  }
}

// Simple TF-IDF style embedding (fast, no API calls needed)
function simpleTextEmbedding(text: string): number[] {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const embedding = new Array(128).fill(0);
  
  // Hash each word to a dimension and increment
  words.forEach(word => {
    const hash = hashString(word) % 128;
    embedding[hash] += 1;
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
}

// Simple string hash function
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// Store email embedding
export async function storeEmailEmbedding(email: {
  id: string;
  subject: string;
  body: string;
  from: string;
}) {
  const text = `${email.subject} ${email.body}`;
  const embedding = await generateEmbedding(text);
  
  // Check if already exists
  const existingIndex = emailEmbeddings.findIndex(e => e.emailId === email.id);
  
  if (existingIndex >= 0) {
    emailEmbeddings[existingIndex] = {
      emailId: email.id,
      subject: email.subject,
      body: email.body,
      from: email.from,
      embedding,
      timestamp: Date.now(),
    };
  } else {
    emailEmbeddings.push({
      emailId: email.id,
      subject: email.subject,
      body: email.body,
      from: email.from,
      embedding,
      timestamp: Date.now(),
    });
  }
  
  // Keep only last 500 emails to prevent memory issues
  if (emailEmbeddings.length > 500) {
    emailEmbeddings = emailEmbeddings.slice(-500);
  }
}

// Helper function to extract clean email address
function extractCleanEmail(emailString: string): string {
  if (!emailString) return "";
  
  const lower = emailString.toLowerCase().trim();
  
  // Try multiple patterns to extract email
  // Pattern 1: "Name <email@domain.com>"
  const angleMatch = lower.match(/<([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})>/);
  if (angleMatch) return angleMatch[1];
  
  // Pattern 2: Direct email "email@domain.com"
  const directMatch = lower.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/);
  if (directMatch) return directMatch[1];
  
  // Pattern 3: Just return cleaned string
  return lower;
}

// Find similar emails using RAG
export async function findSimilarEmails(
  queryText: string,
  topK: number = 3,
  excludeEmailId?: string,
  senderEmail?: string // NEW: Filter by sender
): Promise<Array<{
  emailId: string;
  subject: string;
  body: string;
  from: string;
  similarity: number;
}>> {
  if (emailEmbeddings.length === 0) {
    console.log('⚠️ RAG: No emails in embeddings store');
    return [];
  }
  
  console.log(`🔍 RAG: Searching in ${emailEmbeddings.length} emails`);
  console.log(`🔍 RAG: Query sender: "${senderEmail}"`);
  
  const queryEmbedding = await generateEmbedding(queryText);
  
  // Filter emails
  let filteredEmails = emailEmbeddings.filter(e => e.emailId !== excludeEmailId);
  
  // NEW: If sender specified, ONLY show emails from same sender (no fallback)
  if (senderEmail) {
    const senderEmailClean = extractCleanEmail(senderEmail);
    
    console.log(`🔍 RAG: Looking for emails from: "${senderEmailClean}"`);
    console.log(`🔍 RAG: Original sender string: "${senderEmail}"`);
    
    // Log all unique senders in database
    const uniqueSenders = [...new Set(emailEmbeddings.map(e => e.from))];
    console.log(`🔍 RAG: Available senders (${uniqueSenders.length}):`, uniqueSenders);
    
    // Log ALL cleaned emails for debugging
    const allCleanedEmails = uniqueSenders.map(s => ({
      original: s,
      cleaned: extractCleanEmail(s)
    }));
    console.log(`🔍 RAG: All cleaned emails:`, allCleanedEmails);
    
    const senderEmails = filteredEmails.filter(e => {
      const fromEmailClean = extractCleanEmail(e.from);
      const matches = fromEmailClean === senderEmailClean;
      
      console.log(`🔍 RAG: Comparing "${fromEmailClean}" === "${senderEmailClean}" = ${matches}`);
      
      if (matches) {
        console.log(`✓ RAG: Match found - "${e.from}" (${fromEmailClean}) matches "${senderEmail}" (${senderEmailClean})`);
      }
      
      return matches;
    });
    
    console.log(`🔍 RAG: Found ${senderEmails.length} emails from sender`);
    
    // CRITICAL FIX: If no emails from sender, return empty array (don't fall back to semantic search)
    if (senderEmails.length === 0) {
      console.log(`⚠️ RAG: No previous emails from sender: ${senderEmail}`);
      console.log(`⚠️ RAG: Searched for: "${senderEmailClean}"`);
      return []; // Return empty instead of falling back to semantic search
    }
    
    filteredEmails = senderEmails;
    console.log(`✅ RAG: Using ${senderEmails.length} emails from sender: ${senderEmail}`);
  }
  
  // Calculate similarities
  const similarities = filteredEmails
    .map(email => ({
      emailId: email.emailId,
      subject: email.subject,
      body: email.body,
      from: email.from,
      similarity: cosineSimilarity(queryEmbedding, email.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  console.log(`🔍 RAG: Returning ${similarities.length} results`);
  if (similarities.length > 0) {
    console.log(`🔍 RAG: Top result from: "${similarities[0].from}" (similarity: ${(similarities[0].similarity * 100).toFixed(1)}%)`);
  }
  
  return similarities;
}

// Build context from similar emails for RAG
export function buildRAGContext(similarEmails: Array<{
  subject: string;
  body: string;
  from: string;
  similarity: number;
}>): string {
  if (similarEmails.length === 0) {
    return "";
  }
  
  let context = "\n\n--- RELEVANT PAST EMAIL CONTEXT (RAG) ---\n";
  context += "Here are similar past emails for context:\n\n";
  
  similarEmails.forEach((email, index) => {
    context += `[Past Email ${index + 1}] (Similarity: ${(email.similarity * 100).toFixed(1)}%)\n`;
    context += `From: ${email.from}\n`;
    context += `Subject: ${email.subject}\n`;
    context += `Content: ${email.body.substring(0, 300)}...\n\n`;
  });
  
  context += "--- END CONTEXT ---\n\n";
  
  return context;
}

// Get RAG stats
export function getRAGStats() {
  return {
    totalEmails: emailEmbeddings.length,
    oldestEmail: emailEmbeddings.length > 0 
      ? new Date(emailEmbeddings[0].timestamp).toISOString()
      : null,
    newestEmail: emailEmbeddings.length > 0
      ? new Date(emailEmbeddings[emailEmbeddings.length - 1].timestamp).toISOString()
      : null,
  };
}

// Initialize RAG with existing emails
export async function initializeRAG(emails: Array<{
  id: string;
  subject: string;
  body: string;
  from: string;
}>) {
  console.log(`🔍 RAG: Initializing with ${emails.length} emails...`);
  
  let successCount = 0;
  for (const email of emails) {
    try {
      await storeEmailEmbedding(email);
      successCount++;
    } catch (error) {
      console.error(`❌ RAG: Failed to store email ${email.id}:`, error);
    }
  }
  
  console.log(`✅ RAG: Initialized with ${successCount}/${emails.length} email embeddings`);
  console.log(`📊 RAG: Total emails in store: ${emailEmbeddings.length}`);
  
  // Log sample of senders with their cleaned versions
  const uniqueSenders = [...new Set(emailEmbeddings.map(e => e.from))];
  console.log(`📊 RAG: Unique senders: ${uniqueSenders.length}`);
  console.log(`📊 RAG: Sample senders (raw):`, uniqueSenders.slice(0, 5));
  
  // Helper function to extract clean email (defined inline for logging)
  const extractCleanEmail = (emailString: string): string => {
    const lower = emailString.toLowerCase().trim();
    const match = lower.match(/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/);
    return match ? match[1] : lower;
  };
  
  console.log(`📊 RAG: Sample senders (cleaned):`, uniqueSenders.slice(0, 5).map(s => extractCleanEmail(s)));
}
