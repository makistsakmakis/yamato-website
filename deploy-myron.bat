@echo off
echo ================================================
echo  YAMATO - Commit, Push ^& Deploy (Myron PC)
echo ================================================
echo.

cd /d "C:\Users\MyronFlouris\OneDrive - GERM SA\Documents\GitHub\yamato-website"

echo [1/4] Setting git identity...
git config --global user.email "makistsakmakis@gmail.com"
git config --global user.name "makistsakmakis"

echo.
echo [2/4] Committing changes...
git add .
git commit -m "New intro video: desktop + mobile versions, plays once per visit"

echo.
echo [3/4] Pushing to GitHub...
git push origin main

echo.
echo [4/4] Deploying to Vercel...
cd site
set NODE_OPTIONS=--use-system-ca
npx vercel deploy --prod

echo.
echo ================================================
echo  Done! Check https://site-psi-pied-16.vercel.app
echo ================================================
pause
