# Use em uma cópia descompactada do repositório; requer Git configurado e repositório já criado no GitHub.
param([string]$Repo = 'https://github.com/tulioscost/polvora-e-eter.git')
$ErrorActionPreference = 'Stop'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Instale o Git ou GitHub Desktop antes de continuar.' }
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path '.git')) { git init }
git branch -M main
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) { git remote add origin $Repo } else { git remote set-url origin $Repo }
git add .
git commit -m 'Pólvora & Éter v0.1.0 - Foundry 14'
if ($LASTEXITCODE -ne 0) { Write-Host 'Sem novos arquivos para registrar; tentando envio do branch.' }
git push -u origin main
Write-Host 'Acesse Actions no GitHub para acompanhar a criação do Release com system.json e ZIP.'
