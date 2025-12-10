# Script para executar migration 006 - Dados de Filiais e Estrutura
# Execute este script ANTES de testar criação de olimpíadas com filiais

$ErrorActionPreference = "Stop"

Write-Host "🗄️  Executando Migration 006 - Dados Iniciais de Filiais e Estrutura" -ForegroundColor Cyan
Write-Host ""

$user = "user_olimpiada"
$password = "IDBc@mq1"
$database = "olimpiadaidb"
$migrationFile = "database\migrations\006_dados_filiais_estrutura.sql"

# Verificar se arquivo existe
if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Arquivo de migration não encontrado: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📋 INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "Execute este comando no MySQL Workbench ou via terminal:" -ForegroundColor White
Write-Host ""
Write-Host "OPÇÃO 1 - MySQL Workbench:" -ForegroundColor Green
Write-Host "1. Abra o MySQL Workbench"
Write-Host "2. Conecte ao banco 'olimpiadaidb'"
Write-Host "3. Abra o arquivo: $migrationFile"
Write-Host "4. Execute o script (Ctrl+Shift+Enter)"
Write-Host ""
Write-Host "OPÇÃO 2 - Linha de comando (se tiver mysql no PATH):" -ForegroundColor Green
Write-Host "mysql -u $user -p$password $database < $migrationFile"
Write-Host ""
Write-Host "📊 Dados que serão inseridos:" -ForegroundColor Cyan
Write-Host "  • 3 Anos Letivos (2024, 2025, 2026)"
Write-Host "  • 5 Filiais (Centro, Norte, Sul, Leste, Oeste)"
Write-Host "  • 3 Grupos Escola (EF1, EF2, EM)"
Write-Host "  • 12 Séries (1º ao 9º ano EF + 1º ao 3º ano EM)"
Write-Host "  • 5 Ramos/Níveis de competição"
Write-Host ""
Write-Host "✅ Após executar, você poderá criar olimpíadas vinculando filiais!" -ForegroundColor Green
Write-Host ""
