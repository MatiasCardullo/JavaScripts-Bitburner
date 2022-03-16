@echo off
for /f "tokens=*" %%G in ('dir /b /s %~1\*.*') do (
	if "%%~xG"==".wav" echo "%%G">>listMusicBitburner.txt
	if "%%~xG"==".ogg" echo "%%G">>listMusicBitburner.txt
	if "%%~xG"==".mp3" echo "%%G">>listMusicBitburner.txt
)
echo "%cd%\listMusicBitburner.txt"
pause
