# ===================================
# Script para criar o banco de dados
# OlimpiadaIDB
# ===================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Criando Banco de Dados OlimpiadaIDB  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Carregar variáveis do .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "✅ Arquivo .env carregado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, copie o arquivo .env.example para .env e configure suas credenciais." -ForegroundColor Yellow
    exit 1
}

# Obter credenciais do .env
$dbUser = $env:DB_USER
$dbPassword = $env:DB_PASSWORD
$dbName = $env:DB_NAME
$dbHost = $env:DB_HOST
$dbPort = $env:DB_PORT

Write-Host ""
Write-Host "Configurações:" -ForegroundColor Yellow
Write-Host "  Host: $dbHost" -ForegroundColor Gray
Write-Host "  Porta: $dbPort" -ForegroundColor Gray
Write-Host "  Usuário: $dbUser" -ForegroundColor Gray
Write-Host "  Banco: $dbName" -ForegroundColor Gray
Write-Host ""

# Tentar localizar o mysql.exe
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 9.0\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe"
)

$mysqlPath = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "❌ MySQL não encontrado automaticamente." -ForegroundColor Red
    Write-Host ""
    $customPath = Read-Host "Digite o caminho completo do mysql.exe (ou ENTER para sair)"
    
    if ([string]::IsNullOrWhiteSpace($customPath)) {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit 1
    }
    
    if (Test-Path $customPath) {
        $mysqlPath = $customPath
    } else {
        Write-Host "❌ Caminho inválido!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ MySQL encontrado em: $mysqlPath" -ForegroundColor Green
Write-Host ""

# Criar banco de dados
Write-Host "⏳ Criando banco de dados '$dbName'..." -ForegroundColor Yellow

$createDbQuery = "CREATE DATABASE IF NOT EXISTS ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

try {
    $result = & $mysqlPath -u $dbUser -p"$dbPassword" -h $dbHost -P $dbPort -e $createDbQuery 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Banco de dados '$dbName' criado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Próximos passos:" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "1. Execute as migrations:" -ForegroundColor White
        Write-Host "   npm run migrate" -ForegroundColor Gray
        Write-Host ""
        Write-Host "2. Inicie o servidor:" -ForegroundColor White
        Write-Host "   npm run dev" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "❌ Erro ao criar banco de dados:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erro ao executar comando MySQL:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
