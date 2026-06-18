@echo off
echo ================================================
echo  YAMATO - GitHub Push Fix
echo  Removes secrets from git and force-pushes
echo ================================================
echo.

cd /d "C:\GERM\Yamato Website\Yamato - Website"

echo [1/4] Removing secret files from git tracking...
git rm --cached yamato-admin-server.py 2>nul
git rm --cached site/.env.local 2>nul
git rm --cached site/import/.env 2>nul
git rm --cached -r site/.vercel 2>nul
git rm --cached -r site/import/.vercel 2>nul
git rm --cached "YAMATO - The Full Cambo Pitch.pptx" 2>nul

echo.
echo [2/4] Staging updated .gitignore...
git add .gitignore

echo.
echo [3/4] Amending commit (replacing the one with secrets)...
git commit --amend --no-edit

echo.
echo [4/4] Force-pushing to GitHub...
git push --force origin main

echo.
echo ================================================
echo  Done! Check github.com/makistsakmakis/yamato-website
echo ================================================
pause
