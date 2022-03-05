@echo off
for /f "tokens=*" %%G in ('dir /b /s %~1\*.*') do (
	set toList=false
	if "%%~xG"==".wav" (set toList=true)
	if "%%~xG"==".ogg" (set toList=true)
	if "%%~xG"==".mp3" (set toList=true)
	if %toList%==true (echo "%%G">>listMusicBitburner.txt)
)
echo %cd%\listMusicBitburner.txt
pause
