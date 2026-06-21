@echo off
echo.
echo  YAMATO Admin - Building standalone .exe...
echo.

cd /d "C:\GERM\Yamato Website\Yamato - Website"

py -m pip install pyinstaller -q

py -m PyInstaller ^
  --onefile ^
  --add-data "yamato-admin.html;." ^
  --name "YAMATO-Admin" ^
  --distpath "admin-dist" ^
  --clean ^
  yamato-admin-server.py

echo.
echo  Done! Find the exe at: admin-dist\YAMATO-Admin.exe
echo.
pause
