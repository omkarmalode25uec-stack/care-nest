# Push Care Nest to GitHub
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Pushing Care Nest to GitHub: care-nest" -ForegroundColor Yellow
Write-Host "  Repository: https://github.com/omkarmalode25uec-stack/care-nest" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$token = Read-Host "Enter your GitHub Personal Access Token (from https://github.com/settings/tokens)"

if (-not $token) {
    Write-Host "Token cannot be empty. Please generate one from https://github.com/settings/tokens/new" -ForegroundColor Red
    pause
    exit
}

Write-Host "Pushing files to origin main..." -ForegroundColor Green
node "scripts/git_remote_push.mjs" "https://github.com/omkarmalode25uec-stack/care-nest.git" $token
Write-Host "Done!" -ForegroundColor Green
pause
