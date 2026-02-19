<div align="center">

# 🧠 MailMind

### AI-Powered Smart Email Assistant

**Problem Statement #1 — Smart Email Solutions**

**Team Cipher | AlgoQuest 2025 — Round 2**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge)](https://groq.com/)
[![Vitest](https://img.shields.io/badge/Vitest-LLM_Oracle-6E9F18?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

*An AI-powered email assistant that auto-prioritizes mails, extracts tasks, manages follow-ups, and boosts productivity using NLP, RAG, React, Node.js, and automation testing with LLMs.*

</div>

---

## 📋 Problem Statement Mapping

> **PS #1:** Build an AI-powered email assistant that auto-prioritizes mails, extracts tasks, manages follow-ups, and boosts productivity using NLP, RAG, React, Node.js, and automation testing with LLMs.

| Requirement | MailMind Implementation | Module |
|---|---|---|
| **Auto-prioritize mails** | AI Priority Scoring (1–100) with contextual reasoning via Llama 3.3 70B | `/api/ai/priority` |
| **Extract tasks** | AI To-Do Title Extraction + Agentic "Handle For Me" that autonomously generates action items | `/api/ai/todo-title`, `/api/ai/handle-for-me` |
| **Manage follow-ups** | AI-powered follow-up scheduling with intelligent timing suggestions | `/api/ai/follow-up`, `useFollowUps` hook |
| **Boost productivity** | Focus Mode, Weekly Analysis, Burnout Detection, Smart 4-Category Inbox, Calendar Integration | Multiple components |
| **NLP** | Natural language deadline extraction, email summarization, contextual explanation, spam/phishing detection | `/api/ai/extract-deadline`, `/api/ai/summarize`, `/api/ai/explain`, `/api/ai/spam-detect` |
| **RAG** | In-memory vector store with TF-IDF embeddings + cosine similarity for context-aware reply generation | `utils/ragHelpers.ts`, `/api/rag/*` |
| **React** | React 19 with Next.js 16 App Router, custom hooks (`useEmailAI`, `useFollowUps`, `useEmailFilters`) | Frontend layer |
| **Node.js** | Next.js serverless API routes (16+ endpoints), Gmail API integration, OAuth 2.0 | API layer |
| **Automation testing with LLMs** | **LLM-as-Test-Oracle** — 5 test suites where a second LLM validates AI output quality | `tests/llm-oracle.ts`, `tests/*.test.ts` |

---

## 🚀 The Problem

Email overload is real. Professionals receive **120+ emails daily**, and:
- 🔴 Important emails get buried under noise
- 🔴 Deadlines are missed because they're hidden in email text
- 🔴 Hours are wasted manually sorting, prioritizing, and responding
- 🔴 No existing tool understands email *context* — they just match keywords

## 💡 Our Solution

MailMind is an **AI-native email assistant** powered by **Groq's Llama 3.3 70B** that *understands* your emails contextually. It auto-prioritizes with reasoning, extracts actionable tasks, drafts intelligent replies using past email context (RAG), manages follow-ups, detects burnout, and even handles emails autonomously — all validated by our unique **LLM-as-Test-Oracle** testing framework.

---

## ✨ Key Features

### 🎯 1. AI Priority Scoring (1–100)
Real AI-powered priority analysis using Groq Llama 3.3 70B:
- Analyzes email content, urgency, sender importance, and action requirements
- Assigns a numeric priority score (1–100) with human-readable reasoning
- Context-aware — understands nuance, not just keyword matching
- Intelligent fallback with keyword-based scoring if API is unavailable

### 📂 2. Smart 4-Category Inbox
AI automatically categorizes every email into actionable groups:
| Category | Description | Example |
|---|---|---|
| **🔴 Do Now** | Urgent, time-sensitive, immediate action needed | "Server down — fix now" |
| **🟣 Needs Decision** | Requires your approval, input, or choice | "Budget proposal — please approve" |
| **🔵 Waiting** | Updates, FYI, awaiting response from others | "Project status update" |
| **🟢 Low Energy** | Newsletters, promotions, low-priority items | "Weekly newsletter" |

### 🛡️ 3. AI Spam & Phishing Detection
- Context-aware spam detection (not just keyword lists)
- Phishing attempt identification (e.g., `paypa1.com` vs `paypal.com`)
- Confidence scoring with detailed reasoning
- Catches promotional spam, urgency manipulation, and too-good-to-be-true offers

### 📅 4. NLP Deadline Extraction
Natural language understanding of deadlines:
- Extracts dates from phrases like *"by end of week"*, *"due tomorrow"*, *"before Friday"*
- Normalizes to standard format (Today, Tomorrow, specific dates)
- Calculates urgency level (Very High → None)
- Powers the deadline-based sorting and Focus Mode

### 🔍 5. RAG-Powered Context-Aware Replies
Retrieval-Augmented Generation for intelligent email responses:
- **In-memory vector store** with TF-IDF style embeddings (128-dimensional)
- **Cosine similarity** matching to find relevant past emails
- Generates replies enriched with context from similar past conversations
- Sender-aware filtering — only retrieves context from the same sender
- Stores up to 500 email embeddings with automatic memory management

### 🤖 6. Agentic "Handle For Me" (Autonomous AI)
Multi-step autonomous email processing:
1. **Analyze** — Summarizes the email
2. **Categorize** — Determines priority and category
3. **Draft Reply** — Generates a context-aware response (if needed)
4. **Extract Events** — Identifies calendar events
5. **Generate Task** — Creates an actionable to-do item
6. **Suggest Follow-Up** — Recommends next steps

All in a single click with a step-by-step progress modal.

### 📝 7. AI Email Summarization
- Concise summaries of long emails
- Extracts key points and action items
- Powered by Groq Llama 3.3 70B for nuanced understanding

### 💡 8. "Why This Matters" AI Explanation
- Explains *why* an email is important to you
- Contextual relevance analysis
- Helps you decide what to focus on

### ✅ 9. AI To-Do Title Extraction
- Converts emails into actionable task titles (3–6 words)
- AI-generated titles displayed with ✨ AI badge
- Falls back to smart subject-based titles

### 📅 10. Follow-Up Management
- AI suggests optimal follow-up timing (e.g., "Follow up in 3 days")
- Generates contextual reminder messages
- Tracks due and upcoming follow-ups
- Persistent storage via localStorage
- Dedicated Follow-Ups folder in sidebar

### 🎯 11. Focus Mode
- Distraction-free view of today's urgent tasks
- Time-of-day greeting (Morning/Afternoon/Evening)
- Priority-sorted task cards with AI-generated titles
- One-click "Mark as Done" workflow
- Motivational progress tracking

### 📊 12. Weekly Analysis & Burnout Detection
- **Email volume tracking** — emails received in the last 7 days
- **Stress scoring** (0–100) based on urgent keywords, deadlines, and timing patterns
- **Burnout risk assessment** — Low / Medium / High / Critical
- **Late-night email detection** — flags emails after 10 PM
- **Productivity rate** — completion ratio visualization
- **Personalized recommendations** — AI-driven suggestions to improve work-life balance

### 📆 13. Calendar Integration
- AI extracts events from email content (meetings, deadlines, appointments)
- Interactive monthly calendar view with color-coded event types
- Upcoming events panel with quick navigation
- Manual event creation support
- Event types: Deadline (red), Meeting (blue), Appointment (purple), Reminder (green)

### 👥 14. Team Collaboration
- **Email assignment** — assign emails to team members with deadlines
- **Workload dashboard** — visualize team workload distribution (Low/Medium/High)
- **Status tracking** — Assigned → In Progress → Waiting on Client → Completed
- **Internal notes** — threaded notes with @mention support
- **AI workload suggestions** — recommends task redistribution when team members are overloaded
- **Response rate metrics** — track team member performance

### 🔍 15. Advanced Search
- Multi-filter search: sender, subject, date range, category, attachments, starred
- Quick filters: Today, This Week, Last 7 Days, This Month
- Email grouping by sender and project
- Thread reconstruction for conversation view

### ✉️ 16. Full Gmail Integration
- **OAuth 2.0** authentication via NextAuth.js
- Fetch, read, compose, reply, and send emails
- Attachment handling
- Star, snooze, archive, and delete operations
- Draft management

---

## 🧪 Unique Innovation: LLM-as-Test-Oracle

> **Our testing approach is the key differentiator** — we use a second LLM as the test oracle to validate AI output quality, fulfilling the "automation testing with LLMs" requirement.

### How It Works

Traditional tests use hardcoded assertions. But how do you test if an AI's priority score is *reasonable*? Or if a generated reply is *professional*? **You ask another LLM to judge.**

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  Test Input      │────▶│  MailMind AI API  │────▶│  AI Output          │
│  (Sample Email)  │     │  (Groq Llama 3.3)│     │  (Score/Category/   │
│                  │     │                  │     │   Reply/Deadline)   │
└─────────────────┘     └──────────────────┘     └─────────┬───────────┘
                                                           │
                                                           ▼
                                                 ┌─────────────────────┐
                                                 │  LLM Test Oracle    │
                                                 │  (Groq Llama 3.3)  │
                                                 │                     │
                                                 │  "Is this output    │
                                                 │   reasonable?"      │
                                                 │                     │
                                                 │  Returns:           │
                                                 │  ✅ isValid          │
                                                 │  📊 confidence       │
                                                 │  💬 reasoning        │
                                                 └─────────────────────┘
```

### 5 LLM-Validated Test Suites

| Test Suite | What It Tests | Oracle Validates |
|---|---|---|
| `ai-priority.test.ts` | Priority scoring (1–100) | Is the score reasonable for this email's urgency? |
| `ai-categorization.test.ts` | 4-category classification | Is the category correct for this email type? |
| `ai-spam-detection.test.ts` | Spam & phishing detection | Is the spam/not-spam decision correct? |
| `ai-deadline-extraction.test.ts` | Deadline parsing from text | Is the extracted deadline accurate? |
| `ai-reply-quality.test.ts` | Reply generation quality | Is the reply professional, relevant, and appropriate? |

### Run Tests
```bash
npm test              # Run all LLM-validated tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual UI
npm run test:coverage # Coverage report
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                               │
│        Next.js 16 App Router + React 19 + TypeScript 5              │
│                                                                      │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │  Dashboard   │ │  Focus Mode  │ │  Calendar   │ │  Team Collab │  │
│  │  + Email     │ │  + Weekly    │ │  + Events   │ │  + Search    │  │
│  │  Detail/List │ │  Analysis    │ │  Extraction │ │  + Filters   │  │
│  └──────┬──────┘ └──────┬───────┘ └──────┬──────┘ └──────┬───────┘  │
│         │               │                │               │           │
│  ┌──────┴───────────────┴────────────────┴───────────────┴───────┐   │
│  │  Custom Hooks: useEmailAI │ useFollowUps │ useEmailFilters    │   │
│  └──────────────────────────┬────────────────────────────────────┘   │
└─────────────────────────────┼────────────────────────────────────────┘
                              │ HTTP / REST
┌─────────────────────────────┼────────────────────────────────────────┐
│                     API ROUTES LAYER (16+ Endpoints)                 │
│                    Next.js Serverless Functions                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🤖 AI Engine (/api/ai/*)                                   │    │
│  │  priority │ categorize │ spam-detect │ extract-deadline     │    │
│  │  reply    │ summarize  │ explain     │ todo-title           │    │
│  │  follow-up│ handle-for-me (Agentic)                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐   │
│  │ 📧 Gmail          │ │ 🔍 RAG            │ │ 📅 Calendar      │   │
│  │ /api/gmail/*      │ │ /api/rag/*        │ │ /api/calendar/*  │   │
│  │ list│msg│send│     │ │ initialize│       │ │ events│extract   │   │
│  │ reply│attachment   │ │ similar           │ │                  │   │
│  └───────────────────┘ └───────────────────┘ └──────────────────┘   │
│  ┌───────────────────┐ ┌───────────────────┐ ┌──────────────────┐   │
│  │ 🔐 Auth           │ │ 👥 Team           │ │ 🔎 Search        │   │
│  │ NextAuth.js       │ │ /api/team/*       │ │ /api/search/*    │   │
│  │ Google OAuth 2.0  │ │ assignments       │ │ emails           │   │
│  └───────────────────┘ └───────────────────┘ └──────────────────┘   │
└─────────────────────────────┼────────────────────────────────────────┘
                              │ External API Calls
┌─────────────────────────────┼────────────────────────────────────────┐
│                     EXTERNAL SERVICES                                │
│                                                                      │
│  🧠 Groq API (Llama 3.3 70B Versatile) ── AI Inference Engine       │
│  📧 Gmail API (googleapis)              ── Email Operations          │
│  🔐 NextAuth.js                         ── OAuth 2.0 Authentication  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | React framework with server components |
| | React 19 | UI library with latest features |
| | TypeScript 5 | Type-safe development |
| | Tailwind CSS 3 | Utility-first styling |
| | Framer Motion | Smooth animations and transitions |
| **Backend** | Next.js API Routes | 16+ serverless REST endpoints |
| | NextAuth.js | Google OAuth 2.0 authentication |
| | Gmail API (googleapis) | Full email integration |
| | Mailparser | Email content parsing |
| **AI / ML** | Groq Cloud | Ultra-fast AI inference platform |
| | Llama 3.3 70B Versatile | Primary LLM for all AI features |
| | RAG (Custom) | In-memory vector store + cosine similarity |
| **Testing** | Vitest | Test runner with 30s timeout for LLM calls |
| | LLM Test Oracle | Second LLM validates AI output quality |
| **Dev Tools** | ESLint | Code linting |
| | PostCSS + Autoprefixer | CSS processing |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Gmail account
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Google Cloud OAuth credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Avila-Princy-M01/mailmindd.git
cd mailmindd

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local file:
```

```env
# Groq AI (Llama 3.3 70B Versatile)
GROQ_API_KEY=your_groq_api_key_here

# Google OAuth (for Gmail integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

```bash
# 4. Run the development server
npm run dev

# 5. Open in browser
# Visit: http://localhost:3000
```

### Run Tests (LLM-Validated)
```bash
npm test              # Run all 5 LLM-oracle test suites
npm run test:watch    # Watch mode for development
npm run test:ui       # Visual test UI
npm run test:coverage # Coverage report
```

---

## 🎯 API Endpoints

### AI-Powered Features (Groq Llama 3.3 70B)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/priority` | AI priority scoring (1–100) with reasoning |
| `POST` | `/api/ai/categorize` | Smart 4-category classification |
| `POST` | `/api/ai/spam-detect` | Spam & phishing detection with confidence |
| `POST` | `/api/ai/extract-deadline` | NLP deadline extraction from text |
| `POST` | `/api/ai/reply` | RAG-enhanced reply generation |
| `POST` | `/api/ai/summarize` | Email summarization |
| `POST` | `/api/ai/explain` | "Why This Matters" explanation |
| `POST` | `/api/ai/todo-title` | To-do title extraction |
| `POST` | `/api/ai/follow-up` | Follow-up timing suggestions |
| `POST` | `/api/ai/handle-for-me` | Agentic autonomous email handling |

### Gmail Integration
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/gmail` | Fetch inbox messages |
| `GET` | `/api/gmail/message` | Get specific message details |
| `POST` | `/api/gmail/send` | Send new email |
| `POST` | `/api/gmail/reply` | Reply to email thread |
| `GET` | `/api/gmail/attachment` | Download attachment |

### RAG, Calendar, Team & Search
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rag/initialize` | Initialize RAG vector store with emails |
| `POST` | `/api/rag/similar` | Find semantically similar emails |
| `POST` | `/api/calendar/extract` | AI event extraction from email |
| `POST` | `/api/calendar/events` | Manage calendar events |
| `GET/POST` | `/api/team/assignments` | Team email assignments |
| `POST` | `/api/search/emails` | Advanced email search |

---

## 📁 Project Structure

```
mailmindd/
├── app/
│   ├── api/
│   │   ├── ai/                    # 10 AI-powered endpoints
│   │   │   ├── priority/          # Priority scoring
│   │   │   ├── categorize/        # Email categorization
│   │   │   ├── spam-detect/       # Spam detection
│   │   │   ├── extract-deadline/  # Deadline extraction
│   │   │   ├── reply/             # Reply generation
│   │   │   ├── summarize/         # Summarization
│   │   │   ├── explain/           # Explanation
│   │   │   ├── todo-title/        # Task extraction
│   │   │   ├── follow-up/         # Follow-up scheduling
│   │   │   └── handle-for-me/     # Agentic AI
│   │   ├── gmail/                 # Gmail API integration
│   │   ├── rag/                   # RAG vector operations
│   │   ├── calendar/              # Calendar features
│   │   ├── team/                  # Team collaboration
│   │   ├── search/                # Advanced search
│   │   └── auth/                  # NextAuth.js OAuth
│   ├── calendar/                  # Calendar page
│   ├── team/                      # Team page
│   ├── page.tsx                   # Main dashboard
│   └── layout.tsx                 # Root layout
├── components/
│   ├── dashboard/                 # EmailList, TopNavBar
│   ├── calendar/                  # CalendarView, ReminderPopup
│   ├── team/                      # TeamCollaboration
│   ├── search/                    # AdvancedSearch
│   ├── EmailDetail.tsx            # Email detail with RAG
│   ├── FocusMode.tsx              # Focus Mode view
│   ├── WeeklyAnalysis.tsx         # Analytics dashboard
│   ├── ComposeModal.tsx           # Email composer
│   ├── Sidebar.tsx                # Navigation sidebar
│   └── SplashScreen.tsx           # Loading screen
├── hooks/
│   ├── useEmailAI.ts              # AI features hook
│   ├── useFollowUps.ts            # Follow-up management
│   └── useEmailFilters.ts         # Sorting & filtering
├── utils/
│   ├── ragHelpers.ts              # RAG: embeddings, similarity, vector store
│   ├── emailHelpers.ts            # Email parsing utilities
│   ├── calendarHelpers.ts         # Calendar extraction
│   └── searchHelpers.ts           # Search & grouping
├── lib/
│   └── ai-utils.ts                # Shared AI utilities
├── types/
│   └── index.ts                   # TypeScript interfaces
├── tests/
│   ├── llm-oracle.ts              # LLM Test Oracle engine
│   ├── ai-priority.test.ts        # Priority scoring tests
│   ├── ai-categorization.test.ts  # Categorization tests
│   ├── ai-spam-detection.test.ts  # Spam detection tests
│   ├── ai-deadline-extraction.test.ts  # Deadline tests
│   ├── ai-reply-quality.test.ts   # Reply quality tests
│   └── setup.ts                   # Test environment setup
└── vitest.config.ts               # Vitest configuration
```

---

## 📊 Performance

| Metric | Value |
|---|---|
| AI Response Time | **< 2 seconds** (Groq's ultra-fast inference) |
| Batch Processing | 10 emails analyzed simultaneously |
| RAG Vector Store | Up to 500 emails with automatic eviction |
| Embedding Dimension | 128-dimensional TF-IDF vectors |
| Caching | In-memory AI result caching per session |
| Parallel Processing | Multiple AI requests run concurrently |

---

## 🔒 Privacy & Security

- **OAuth 2.0** — Secure Gmail authentication via Google
- **No Email Storage** — Emails processed on-demand, never persisted on server
- **API Key Security** — All secrets stored in environment variables
- **Client-Side Caching** — AI results cached in browser memory only
- **RAG Privacy** — Vector embeddings stored in-memory, cleared on restart
- **HTTPS Only** — Secure communication in production

---

## 👥 Team Cipher

Built with passion for **AlgoQuest 2025 — Round 2**

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) — Ultra-fast AI inference platform
- [Meta AI](https://ai.meta.com/) — Llama 3.3 70B Versatile model
- [Google](https://developers.google.com/gmail) — Gmail API
- [Vercel](https://vercel.com/) — Next.js framework
- [Vitest](https://vitest.dev/) — Testing framework

---

## 📞 Links

- **GitHub**: [https://github.com/Avila-Princy-M01/mailmindd](https://github.com/Avila-Princy-M01/mailmindd)
- **Original Repo**: [https://github.com/shreysherikar/mailmindd](https://github.com/shreysherikar/mailmindd)

---

<div align="center">

**Built with ❤️ by Team Cipher for AlgoQuest 2025**

*MailMind — Where AI meets your inbox.*

</div>
