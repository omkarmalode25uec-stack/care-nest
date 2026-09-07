@echo off
title Push Care Nest to GitHub
echo ===================================================
echo   Pushing Care Nest to GitHub: care-nest
echo   Repository: https://github.com/omkarmalode25uec-stack/care-nest
echo ===================================================
echo.
set /p GITHUB_TOKEN="Enter your GitHub Personal Access Token (from https://github.com/settings/tokens): "
echo.
echo Pushing code to GitHub main branch...
node scripts/git_remote_push.mjs https://github.com/omkarmalode25uec-stack/care-nest.git %GITHUB_TOKEN%
echo.
pause
