# Quick RAG Test Guide

## 🎯 Goal
Test if RAG can find previous emails from the same sender.

## ⚡ Quick Test (2 minutes)

### 1. Open Browser Console
Press `F12` → Click "Console" tab

### 2. Refresh Page
Look for this message:
```
✅ RAG initialized with X emails
💡 TIP: Open any email and click '📧 Previous Emails (RAG)' to find emails from the same sender
```

✅ **If you see this** → RAG is initialized correctly
❌ **If you don't see this** → Share console output

### 3. Select Any Email
Click on any email from yourself (shreyasherikar18@gmail.com)

### 4. Click RAG Button
Click the green **"📧 Previous Emails (RAG)"** button

### 5. Check Results

#### ✅ SUCCESS - You should see:
- Alert: "✅ Found X previous emails from shreyasherikar18@gmail.com!"
- Modal with previous emails from that sender

#### ❌ FAILURE - You see:
- Alert: "ℹ️ No previous emails from this sender found"

## 📊 What to Check in Console

### On Page Load:
```
✅ RAG initialized with 50 emails
📊 RAG Stats: {totalEmails: 50, ...}
📊 RAG: Unique senders: 15
📊 RAG: Sample senders (raw): [...]
📊 RAG: Sample senders (cleaned): [...]
```

### When Clicking RAG Button:
```
🔍 RAG UI: Selected email from: Shreyas Herikar <shreyasherikar18@gmail.com>
🔍 RAG UI: Extracted sender: shreyasherikar18@gmail.com
🔍 RAG: Searching in 50 emails
🔍 RAG: Looking for emails from: "shreyasherikar18@gmail.com"
🔍 RAG: Available senders (10): [list of senders]
🔍 RAG: Sample cleaned emails: [cleaned addresses]
✓ RAG: Match found - "..." matches "..."
🔍 RAG: Found 5 emails from sender
✅ RAG: Using 5 emails from sender: shreyasherikar18@gmail.com
```

## 🐛 If Not Working

### Copy and share:
1. Full console output (from page load to clicking RAG)
2. How many emails in your inbox?
3. What sender are you testing with?

### Quick checks:
- [ ] Did RAG initialize? (check for "✅ RAG initialized" message)
- [ ] How many emails? (check "Searching in X emails")
- [ ] What senders are available? (check "Available senders" log)
- [ ] Does your email appear in the list?

## 🔧 What Was Fixed

1. **Better email extraction** - Now correctly extracts email from "Name <email>" format
2. **Exact matching** - No more fuzzy matching that could fail
3. **Detailed logging** - Every step is logged for debugging
4. **Better error messages** - Clear feedback on what's happening

## 💡 Pro Tip

Test with emails from yourself first! Since you're testing with shreyasherikar18@gmail.com, you should have multiple emails from yourself in the inbox.

---

**Ready?** Open console (F12) and follow the steps above! 🚀
