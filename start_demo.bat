@echo off
title HoneyChain SIH-26021 Live Demo Runner
color 0E

echo ==============================================================================
echo   HONEYCHAIN: DEPIN HONEY PROVENANCE ^& AI HIVE DIAGNOSTICS (SIH PS 26021)
echo   Ministry of MSME, Coordination Section ^| Team: Beevil Knievel
echo ==============================================================================
echo.

echo [1/3] Running Python Gateway ^& AI Test Suite...
python gateway/test_gateway_suite.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gateway test suite failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Running One-Click End-to-End DePIN Demo...
python demo_honeychain_flow.py

echo.
echo [3/3] Launching Next.js 16 Web Dashboard ^& Consumer QR Portal...
cd frontend
start http://localhost:3000/verify/1
npm.cmd run dev
