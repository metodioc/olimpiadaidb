# Script para executar as migrations - OlimpiadaIDB

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Executando Migrations OlimpiadaIDB   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Carregar variaveis do .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
    Write-Host "Arquivo .env carregado" -ForegroundColor Green
} else {
    Write-Host "Arquivo .env nao encontrado!" -ForegroundColor Red
    exit 1
}

# Obter credenciais do .env
$dbUser = $env:DB_USER
$dbPassword = $env:DB_PASSWORD
$dbName = $env:DB_NAME
$dbHost = $env:DB_HOST
$dbPort = $env:DB_PORT

Write-Host ""
Write-Host "Banco de dados: $dbName" -ForegroundColor Yellow
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
    Write-Host "MySQL nao encontrado automaticamente." -ForegroundColor Red
    Write-Host ""
    $customPath = Read-Host "Digite o caminho completo do mysql.exe (ou ENTER para sair)"
    
    if ([string]::IsNullOrWhiteSpace($customPath)) {
        Write-Host "Operacao cancelada." -ForegroundColor Yellow
        exit 1
    }
    
    if (Test-Path $customPath) {
        $mysqlPath = $customPath
    } else {
        Write-Host "Caminho invalido!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "MySQL encontrado" -ForegroundColor Green
Write-Host ""

# Listar arquivos de migration
$migrationsPath = "database\migrations"
$sqlFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

if ($sqlFiles.Count -eq 0) {
    Write-Host "Nenhum arquivo de migration encontrado em $migrationsPath" -ForegroundColor Red
    exit 1
}

Write-Host "Encontrados $($sqlFiles.Count) arquivo(s) de migration" -ForegroundColor Cyan
Write-Host ""

# Executar cada migration
$success = 0
$errors = 0

foreach ($file in $sqlFiles) {
    if ($file.Name -eq "README.md") {
        continue
    }
    
    Write-Host "Executando: $($file.Name)..." -ForegroundColor Yellow
    
    try {
        $result = & $mysqlPath -u $dbUser -p"$dbPassword" -h $dbHost -P $dbPort $dbName -e "source $($file.FullName)" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Concluido: $($file.Name)" -ForegroundColor Green
            $success++
        } else {
            Write-Host "Erro ao executar: $($file.Name)" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            $errors++
        }
    } catch {
        Write-Host "Erro ao executar: $($file.Name)" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
}

# Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumo da Execucao" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Sucesso: $success" -ForegroundColor Green
Write-Host "Erros: $errors" -ForegroundColor Red
Write-Host ""

if ($errors -eq 0) {
    Write-Host "Todas as migrations foram executadas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximo passo: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "Algumas migrations falharam. Verifique os erros acima." -ForegroundColor Yellow
    exit 1
}
