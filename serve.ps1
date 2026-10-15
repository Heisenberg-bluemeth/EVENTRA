# EVENTRA Quick Launcher
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Or pass an argument:
#   .\serve.ps1 dev
#   .\serve.ps1 test
#   .\serve.ps1 build
#   .\serve.ps1 preview

param (
    [string]$Action = "dev"
)

$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    $env:PATH = "$nodePath;$env:PATH"
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  EVENTRA — Discover the Moment. Experience the Extraordinary." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

switch ($Action.ToLower()) {
    "test" {
        Write-Host "Running Vitest test suite..." -ForegroundColor Green
        & cmd.exe /c "npm test"
    }
    "build" {
        Write-Host "Building production distribution..." -ForegroundColor Green
        & cmd.exe /c "npm run build"
    }
    "preview" {
        Write-Host "Starting Vite preview server on production build..." -ForegroundColor Green
        & cmd.exe /c "npm run preview"
    }
    default {
        Write-Host "Starting Vite development server..." -ForegroundColor Green
        Write-Host "Press Ctrl+C to terminate the server.`n" -ForegroundColor DarkGray
        & cmd.exe /c "npm run dev"
    }
}
