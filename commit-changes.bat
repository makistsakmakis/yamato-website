@echo off
REM Πηγαίνει στον φάκελο του ίδιου του script (το repo root)
cd /d "%~dp0"

echo ============================================
echo  YAMATO - Commit ^& Push
echo ============================================
echo.

echo [1/4] Normalize line endings...
git add --renormalize .

echo [2/4] Stage all changes...
git add -A

echo [3/4] Commit...
git commit -m "Drop Netlify, forms to Supabase, normalize line endings"

echo [4/4] Push...
git push

echo.
echo ============================================
echo  Done.
echo ============================================
pause
