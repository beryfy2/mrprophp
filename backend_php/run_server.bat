@echo off
echo Starting PHP Server on localhost:8000...
cd /d "%~dp0"

IF EXIST "C:\xampp\php\php.exe" (
    set PHP_BIN="C:\xampp\php\php.exe"
) ELSE (
    set PHP_BIN=php
)

%PHP_BIN% -S localhost:8000 router.php
pause