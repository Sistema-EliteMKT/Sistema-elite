@echo off
title Sistema Elite - Agente de impressao
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando pela primeira vez...
  call npm install
)
:loop
node agente.js
echo O agente parou. Reiniciando em 5 segundos...
timeout /t 5 >nul
goto loop
