@echo off
cd /d %~dp0
"C:\Users\Pierre\AppData\Local\Programs\Python\Python312\python.exe" -m pelican content -o output -s pelicanconf.py -r -l -p 8000
