@echo off
echo Starting PHP Server on localhost:8000...
cd /d "%~dp0"

IF EXIST "C:\xampp\php\php.exe" (
    set PHP_BIN="C:\xampp\php\php.exe"
    set PHP_INI="C:\xampp\php\php.ini"
) ELSE IF EXIST "C:\Program Files\php\php.exe" (
    set PHP_BIN="C:\Program Files\php\php.exe"
    set PHP_INI="%~dp0php-db.ini"
) ELSE (
    set PHP_BIN=php
    set PHP_INI=
)

if defined PHP_INI (
    %PHP_BIN% -c %PHP_INI% -S localhost:8000 router.php
) ELSE (
    %PHP_BIN% -S localhost:8000 router.php
)
pause
pause