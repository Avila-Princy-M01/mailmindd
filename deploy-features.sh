#!/bin/bash

# MailMind - Deploy New Features to GitHub Branch
# This script creates a new branch and commits all new features

echo "🚀 MailMind - Deploying New Features"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Branch name
BRANCH_NAME="feature/calendar-search-team"

echo -e "${BLUE}Step 1: Checking current branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
echo ""

# Check if we're already on the feature branch
if [ "$CURRENT_BRANCH" = "$BRANCH_NAME" ]; then
    echo -e "${YELLOW}Already on $BRANCH_NAME branch${NC}"
else
    echo -e "${BLUE}Step 2: Creating new branch: $BRANCH_NAME${NC}"
    git checkout -b $BRANCH_NAME
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Branch created successfully${NC}"
    else
        echo -e "${YELLOW}Branch might already exist, switching to it...${NC}"
        git checkout $BRANCH_NAME
    fi
fi
echo ""

echo -e "${BLUE}Step 3: Adding new files...${NC}"

# Add component files
echo "Adding components..."
git add components/calendar/CalendarView.tsx 2>/dev/null
git add components/calendar/ReminderPopup.tsx 2>/dev/null
git add components/search/AdvancedSearch.tsx 2>/dev/null
git add components/team/TeamCollaboration.tsx 2>/dev/null
git add components/dashboard/TopNavBar.tsx 2>/dev/null

# Add page files
echo "Adding pages..."
git add app/calendar/page.tsx 2>/dev/null
git add app/team/page.tsx 2>/dev/null

# Add API routes
echo "Adding API routes..."
git add app/api/calendar/events/route.ts 2>/dev/null
git add app/api/calendar/extract/route.ts 2>/dev/null
git add app/api/search/emails/route.ts 2>/dev/null
git add app/api/team/assignments/route.ts 2>/dev/null

# Add utilities
echo "Adding utilities..."
git add utils/calendarHelpers.ts 2>/dev/null
git add utils/searchHelpers.ts 2>/dev/null

# Add documentation
echo "Adding documentation..."
git add INTEGRATION_GUIDE.md 2>/dev/null
git add NEW_FEATURES_README.md 2>/dev/null
git add QUICK_REFERENCE.md 2>/dev/null
git add ARCHITECTURE_DIAGRAM.md 2>/dev/null
git add GIT_COMMIT_CHECKLIST.md 2>/dev/null
git add deploy-features.sh 2>/dev/null

echo -e "${GREEN}✓ Files added${NC}"
echo ""

echo -e "${BLUE}Step 4: Checking status...${NC}"
git status
echo ""

echo -e "${BLUE}Step 5: Committing changes...${NC}"
git commit -m "feat: Add Calendar, Advanced Search, and Team Collaboration features

Features Added:
- 📅 Calendar Integration with AI event extraction and reminders
- 🔍 Advanced Search with filters, grouping, and Gmail API integration
- 👥 Team Collaboration with assignments, status tracking, and workload management

Components:
- CalendarView, ReminderPopup
- AdvancedSearch with multiple filters
- TeamCollaboration with dashboard, assignments, and members tabs
- TopNavBar for navigation

API Routes:
- /api/calendar/events - CRUD for calendar events
- /api/calendar/extract - AI-powered event extraction
- /api/search/emails - Advanced email search
- /api/team/assignments - Team assignment management

Utilities:
- calendarHelpers - Date parsing, event extraction
- searchHelpers - Search, filtering, grouping

Documentation:
- Complete integration guide
- Feature documentation
- Quick reference for developers
- Architecture diagrams"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Changes committed successfully${NC}"
else
    echo -e "${YELLOW}⚠ Commit failed or no changes to commit${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 6: Pushing to GitHub...${NC}"
git push -u origin $BRANCH_NAME

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}======================================"
    echo -e "✓ SUCCESS! Features deployed to GitHub"
    echo -e "======================================${NC}"
    echo ""
    echo "Branch: $BRANCH_NAME"
    echo "Repository: https://github.com/shreysherikar/mailmindd"
    echo ""
    echo "Next steps:"
    echo "1. Visit: https://github.com/shreysherikar/mailmindd/tree/$BRANCH_NAME"
    echo "2. Review the changes"
    echo "3. Create a Pull Request when ready"
    echo "4. Test locally: npm run dev"
    echo ""
    echo "New features available at:"
    echo "- Calendar: http://localhost:3000/calendar"
    echo "- Team: http://localhost:3000/team"
    echo "- Search: On main inbox page"
    echo ""
else
    echo -e "${YELLOW}⚠ Push failed. Please check your GitHub credentials${NC}"
    echo "You may need to:"
    echo "1. Set up GitHub authentication"
    echo "2. Run: git push -u origin $BRANCH_NAME"
    exit 1
fi
