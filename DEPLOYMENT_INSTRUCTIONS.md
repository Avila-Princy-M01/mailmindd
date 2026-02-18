# 🚀 Deployment Instructions - New Features to GitHub

## Quick Deploy (Easiest Method)

### For Windows:
```bash
# Just double-click this file:
deploy-features.bat

# Or run in terminal:
.\deploy-features.bat
```

### For Mac/Linux:
```bash
# Make script executable (first time only)
chmod +x deploy-features.sh

# Run the script
./deploy-features.sh
```

The script will automatically:
1. ✅ Create branch `feature/calendar-search-team`
2. ✅ Add all 28 new files
3. ✅ Commit with detailed message
4. ✅ Push to your GitHub repository

---

## Manual Deploy (Step by Step)

If you prefer to do it manually:

### Step 1: Navigate to Project
```bash
cd mailmindd
```

### Step 2: Create New Branch
```bash
git checkout -b feature/calendar-search-team
```

### Step 3: Add All Files
```bash
# Add components
git add components/calendar/
git add components/search/
git add components/team/
git add components/dashboard/TopNavBar.tsx

# Add pages
git add app/calendar/
git add app/team/

# Add API routes
git add app/api/calendar/
git add app/api/search/
git add app/api/team/

# Add utilities
git add utils/calendarHelpers.ts
git add utils/searchHelpers.ts

# Add documentation
git add *.md
git add deploy-features.*
```

### Step 4: Commit
```bash
git commit -m "feat: Add Calendar, Advanced Search, and Team Collaboration features"
```

### Step 5: Push to GitHub
```bash
git push -u origin feature/calendar-search-team
```

---

## Verify Deployment

After pushing, verify on GitHub:

1. **Visit your repository:**
   ```
   https://github.com/shreysherikar/mailmindd
   ```

2. **Check branches:**
   ```
   https://github.com/shreysherikar/mailmindd/branches
   ```

3. **View your new branch:**
   ```
   https://github.com/shreysherikar/mailmindd/tree/feature/calendar-search-team
   ```

4. **Confirm files are there:**
   - components/calendar/ (2 files)
   - components/search/ (1 file)
   - components/team/ (1 file)
   - app/calendar/ (1 file)
   - app/team/ (1 file)
   - app/api/calendar/ (2 files)
   - app/api/search/ (1 file)
   - app/api/team/ (1 file)
   - utils/ (2 files)
   - Documentation (5 .md files)

---

## Create Pull Request (Optional)

If you want to review before merging to main:

1. Go to: https://github.com/shreysherikar/mailmindd
2. Click "Compare & pull request" button
3. Add description:
   ```
   ## New Features Added
   
   ### 📅 Calendar Integration
   - AI-powered event extraction from emails
   - Visual calendar with month view
   - Smart reminders with snooze
   
   ### 🔍 Advanced Search
   - Multi-field search (sender, subject, date)
   - Smart grouping by sender/project
   - Quick filters
   
   ### 👥 Team Collaboration
   - Email assignment to team members
   - Status tracking and workload management
   - Internal notes with @mentions
   - AI workload suggestions
   
   ## Testing
   - [ ] Calendar page works
   - [ ] Search filters work
   - [ ] Team dashboard loads
   - [ ] All API routes functional
   ```
4. Click "Create pull request"
5. Review changes
6. When ready, click "Merge pull request"

---

## Test Locally

Before or after pushing:

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Test features:
# - Main inbox: http://localhost:3000
# - Calendar: http://localhost:3000/calendar
# - Team: http://localhost:3000/team
```

---

## Troubleshooting

### "Permission denied" error
```bash
# For Mac/Linux, make script executable:
chmod +x deploy-features.sh
```

### "Branch already exists" error
```bash
# Switch to existing branch:
git checkout feature/calendar-search-team

# Or delete and recreate:
git branch -D feature/calendar-search-team
git checkout -b feature/calendar-search-team
```

### "Authentication failed" error
```bash
# Set up GitHub credentials:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Or use GitHub CLI:
gh auth login
```

### "Nothing to commit" error
```bash
# Check if files exist:
ls components/calendar/
ls app/calendar/

# If files are missing, they might not have been created
# Check the workspace directory
```

---

## What Gets Deployed

### New Files (28 total)

**Components (5):**
- components/calendar/CalendarView.tsx
- components/calendar/ReminderPopup.tsx
- components/search/AdvancedSearch.tsx
- components/team/TeamCollaboration.tsx
- components/dashboard/TopNavBar.tsx

**Pages (2):**
- app/calendar/page.tsx
- app/team/page.tsx

**API Routes (4):**
- app/api/calendar/events/route.ts
- app/api/calendar/extract/route.ts
- app/api/search/emails/route.ts
- app/api/team/assignments/route.ts

**Utilities (2):**
- utils/calendarHelpers.ts
- utils/searchHelpers.ts

**Documentation (7):**
- INTEGRATION_GUIDE.md
- NEW_FEATURES_README.md
- QUICK_REFERENCE.md
- ARCHITECTURE_DIAGRAM.md
- GIT_COMMIT_CHECKLIST.md
- DEPLOYMENT_INSTRUCTIONS.md
- deploy-features.sh / deploy-features.bat

**Existing Files Modified:** NONE ✓

---

## Safety Notes

✅ **Safe to deploy:**
- New branch (doesn't affect main)
- Only adds new files
- No existing code modified
- Can be easily reverted
- Can test before merging

❌ **Main branch:**
- Remains completely unchanged
- No risk to production code
- Can merge later when ready

---

## After Deployment

1. **Share the branch:**
   ```
   Send this link to team members:
   https://github.com/shreysherikar/mailmindd/tree/feature/calendar-search-team
   ```

2. **Continue development:**
   ```bash
   # Make more changes
   git add .
   git commit -m "fix: Update calendar styling"
   git push
   ```

3. **Merge to main (when ready):**
   ```bash
   git checkout main
   git merge feature/calendar-search-team
   git push
   ```

---

## Need Help?

Check these files:
- **Integration:** INTEGRATION_GUIDE.md
- **Features:** NEW_FEATURES_README.md
- **Quick Ref:** QUICK_REFERENCE.md
- **Architecture:** ARCHITECTURE_DIAGRAM.md

---

**Ready to deploy? Run the script or follow manual steps above!** 🚀
