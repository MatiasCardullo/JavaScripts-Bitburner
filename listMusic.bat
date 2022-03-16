@echo off
set "path=%~1"
if not '%path:~-1%'=='\' set "path=%path%\"
echo %path%
pause
for /f "tokens=*" %%G in ('dir /b /s %path%*.*') do (
	if "%%~xG"==".wav" echo "%%G">>listMusicBitburner.txt
	if "%%~xG"==".ogg" echo "%%G">>listMusicBitburner.txt
	if "%%~xG"==".mp3" echo "%%G">>listMusicBitburner.txt
)
echo "%cd%\listMusicBitburner.txt"
pause
