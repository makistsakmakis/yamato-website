@echo off
echo.
echo  YAMATO Admin - Building standalone .exe...
echo.

REM Install PyInstaller if not already installed
py -m pip install pyinstaller -q

REM Build the exe
py -m PyInstaller ^
  --onefile ^
  --add-data "yamato-admin.html;." ^
  --name "YAMATO-Admin" ^
  --distpath "admin-dist" ^
  yamato-admin-server.py

echo.
echo  Done! Find the exe at: admin-dist\YAMATO-Admin.exe
echo  Send this file to the other admins (no installation needed).
echo.
pause
