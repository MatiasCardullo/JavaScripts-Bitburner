for /f "tokens=2 delims=," %A in ('tasklist /FI "IMAGENAME eq bitburner.exe" /FO CSV /NH') DO TASKKILL /PID %A
shutdown /p /f
