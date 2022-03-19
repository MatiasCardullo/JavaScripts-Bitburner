@echo off
for /f "tokens=*" %%G in ('dir /b /s %cd%\*.*') do (
	if "%%~xG"==".js" del "%%G"
	if "%%~xG"==".script" del "%%G"
	if "%%~xG"==".txt" del "%%G"
)
