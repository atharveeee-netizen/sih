# HoneyChain SIH-26021 Live Demo Runner (PowerShell)
Write-Host "==============================================================================" -ForegroundColor Yellow
Write-Host "  HONEYCHAIN: DEPIN HONEY PROVENANCE & AI HIVE DIAGNOSTICS (SIH PS 26021)" -ForegroundColor Yellow
Write-Host "  Ministry of MSME, Coordination Section | Team: Beevil Knievel" -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "[1/3] Running Python Gateway & AI Test Suite..." -ForegroundColor Cyan
python gateway/test_gateway_suite.py
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Gateway test suite failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "[2/3] Running One-Click End-to-End DePIN Demo..." -ForegroundColor Cyan
python demo_honeychain_flow.py

Write-Host ""
Write-Host "[3/3] Launching Next.js 16 Web Dashboard & Consumer QR Portal..." -ForegroundColor Cyan
Start-Process "http://localhost:3000/verify/1"
cd frontend
npm.cmd run dev
