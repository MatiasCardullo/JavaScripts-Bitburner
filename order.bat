@echo off

for /f "tokens=*" %%F in ('dir /b _*') do (
	echo %%F
	for /f "delims=_ tokens=1-2" %%G in ("%%F") do (
		if NOT EXIST %%G\ (mkdir %%G)
		move %%F %%G\%%H
	)
)