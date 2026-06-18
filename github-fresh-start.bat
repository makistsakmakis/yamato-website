@echo off
echo ================================================
echo  YAMATO - Fresh Git Push (clean history)
echo ================================================
echo.

cd /d "C:\GERM\Yamato Website\Yamato - Website"

echo [1/6] Deleting old git history...
rmdir /s /q .git

echo.
echo [2/6] Fresh git init...
git init
git branch -M main

echo.
echo [3/6] Staging files (.gitignore excludes all secrets)...
git add .

echo.
echo [4/6] Verifying NO secrets in staging area...
echo --- The following should be EMPTY (no secret files) ---
git ls-files | findstr /i "set-vercel find_images yamato-admin .env secret"
echo --- End check ---

echo.
echo [5/6] Committing...
git commit -m "Initial commit - YAMATO website v1"

echo.
echo [6/6] Pushing to GitHub...
git remote add origin https://github.com/makistsakmakis/yamato-website.git
git push --force origin main

echo.
echo ================================================
echo  Done! Check github.com/makistsakmakis/yamato-website
echo ================================================
pause
