@echo off

REM ===== Config =====
set IMAGE_NAME=chatbot-app
set IMAGE_TAG=latest
set VITE_MY_CAREER_URL=https://mycareer.waikato.ac.nz/
set VITE_WAIKATO_UNIVERSITY_URL=https://www.waikato.ac.nz/int/
set VITE_BACKEND_URL=http://170.64.164.173:3090

echo Building Docker image...

docker build ^
 --build-arg VITE_MY_CAREER_URL=%VITE_MY_CAREER_URL% ^
 --build-arg VITE_WAIKATO_UNIVERSITY_URL=%VITE_WAIKATO_UNIVERSITY_URL% ^
 --build-arg VITE_BACKEND_URL=%VITE_BACKEND_URL% ^
 -t %IMAGE_NAME%:%IMAGE_TAG% ^
 .

IF %ERRORLEVEL% EQU 0 (
    echo Build completed successfully!
) ELSE (
    echo Build failed!
    exit /b 1
)