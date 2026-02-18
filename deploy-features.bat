@echo off
REM MailMind - Deploy New Features to GitHub Branch (Windows)
REM This script creates a new branch and commits all new features

echo ========================================
echo MailMind - Deploying New Features
echo ========================================
echo.

set BRANCH_NAME=feature/calendar-search-team

echo Step 1: Checking current branch...
git branch --show-current
echo.

echo Step 2: Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%
if errorlevel 1 (
    echo Branch might already exist, switching to it...
    git checkout %BRANCH_NAME%
)
echo.

echo Step 3: Adding new files...
git add components/calendar/ 2>nul
git add components/search/ 2>nul
git add components/team/ 2>nul
git add components/dashboard/TopNavBar.tsx 2>nul
git add app/calendar/ 2>nul
git add app/team/ 2>nul
git add app/api/calendar/ 2>nul
git add app/api/search/ 2>nul
git add app/api/team/ 2>nul
git add utils/calendarHelpers.ts 2>nul
git add utils/searchHelpers.ts 2>nul
git add *.md 2>nul
git add deploy-features.bat 2>nul
git add deploy-features.sh 2>nul

echo Files added successfully
echo.

echo Step 4: Checking status...
git status
echo.

echo Step 5: Committing changes...
git commit -m "feat: Add Calendar, Advanced Search, and Team Collaboration features" -m "Features Added:" -m "- Calendar Integration with AI event extraction and reminders" -m "- Advanced Search with filters, grouping, and Gmail API integration" -m "- Team Collaboration with assignments, status tracking, and workload management"

if errorlevel 1 (
    echo Commit failed or no changes to commit
    pause
    exit /b 1
)
echo Changes committed successfully
echo.

echo Step 6: Pushing to GitHub...
git push -u origin %BRANCH_NAME%

if errorlevel 1 (
    echo.
    echo Push failed. Please check your GitHub credentials
    echo You may need to run: git push -u origin %BRANCH_NAME%
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Features deployed to GitHub
echo ========================================
echo.
echo Branch: %BRANCH_NAME%
echo Repository: https://github.com/shreysherikar/mailmindd
echo.
echo Next steps:
echo 1. Visit: https://github.com/shreysherikar/mailmindd/tree/%BRANCH_NAME%
echo 2. Review the changes
echo 3. Create a Pull Request when ready
echo 4. Test locally: npm run dev
echo.
echo New features available at:
echo - Calendar: http://localhost:3000/calendar
echo - Team: http://localhost:3000/team
echo - Search: On main inbox page
echo.
pause
