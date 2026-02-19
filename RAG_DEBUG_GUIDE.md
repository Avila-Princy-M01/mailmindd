# RAG Debugging Guide

## How to Debug RAG "Same Sender" Feature

The RAG system now has extensive logging to help identify why it's not finding emails from the same sender.

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Click on the "Console" tab
3. Keep it open while testing

### Step 2: Test RAG Feature
1. Select any email in your inbox
2. Click the "📧 Previous Emails (RAG)" button
3. Watch the console output

### Step 3: Analyze Console Logs

You should see logs like this:

```
🔍 RAG UI: Selected email from: Shreyas Herikar <shreyasherikar18@gmail.com>
🔍 RAG UI: Extracted sender: shreyasherikar18@gmail.com
🔍 RAG: Searching in 50 emails
🔍 RAG: Query sender: "shreyasherikar18@gmail.com"
🔍 RAG: Looking for emails from: "shreyasherikar18@gmail.com"
🔍 RAG: Available senders (10): [list of senders]
🔍 RAG: Sample cleaned emails: [cleaned email addresses]
✓ RAG: Match found - "..." matches "..."
🔍 RAG: Found 5 emails from sender
✅ RAG: Using 5 emails from sender: shreyasherikar18@gmail.com
```

### Step 4: Check for Issues

#### Issue 1: "No emails in embeddings store"
**Problem**: RAG wasn't initialized
**Solution**: Refresh the page to trigger RAG initialization

#### Issue 2: "Found 0 emails from sender"
**Problem**: Email format mismatch
**Check the logs**:
- What does "Extracted sender" show?
- What do "Available senders" show?
- Do they match?

**Common mismatches**:
- Stored: `"Shreyas Herikar <shreyasherikar18@gmail.com>"`
- Searching: `"shreyasherikar18@gmail.com"`
- These should now match with the improved extraction

#### Issue 3: RAG initialized with 0 emails
**Problem**: Emails not loaded when RAG initialized
**Solution**: Check if emails loaded successfully first

### Step 5: Share Console Output

If still not working, copy the console output and share:
1. The "RAG UI" logs (what email was selected)
2. The "RAG: Available senders" log (what's in the database)
3. The "RAG: Found X emails" log (what was found)

### Recent Improvements

**Version 2 (Current)**:
- ✅ More robust email extraction using proper regex
- ✅ Exact email matching (no fuzzy logic)
- ✅ Shows both raw and cleaned email formats
- ✅ Better debugging with step-by-step logs

**What Changed**:
- Old regex: `/([^\s<>]+@[^\s<>]+)/` (too loose)
- New regex: `/([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/` (proper email format)
- This ensures "Name <email@domain.com>" correctly extracts "email@domain.com"

### Expected Behavior

When working correctly:
1. You select an email from `shreyasherikar18@gmail.com`
2. RAG searches for all emails from `shreyasherikar18@gmail.com`
3. Finds 5+ previous emails from that sender
4. Shows alert: "✅ Found 5 previous emails from shreyasherikar18@gmail.com!"
5. Displays them in a modal

### Quick Test

To verify RAG is working:
1. Send yourself 3-4 test emails with different subjects
2. Refresh the page (to initialize RAG with all emails)
3. Open one of your test emails
4. Click "📧 Previous Emails (RAG)"
5. Should find the other test emails from yourself

### Still Not Working?

Share these details:
1. Full console output (copy/paste)
2. How many emails are in your inbox?
3. What email address are you testing with?
4. Does the "RAG initialized with X emails" log appear on page load?
