# Script para criar usuário administrador no banco de dados
# Credenciais do admin: admin@escola.com / Admin@123

$user = "user_olimpiada"
$password = "IDBc@mq1"
$database = "olimpiadaidb"
$sqlFile = "create_admin.sql"

Write-Host "🔐 Criando usuário administrador..." -ForegroundColor Cyan

# Executar o script SQL usando o comando mysql
# Se você tem o MySQL Workbench, pode abrir o arquivo create_admin.sql diretamente

Write-Host ""
Write-Host "📋 INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "1. Abra o MySQL Workbench ou phpMyAdmin"
Write-Host "2. Conecte ao banco 'olimpiadaidb'"
Write-Host "3. Execute o conteúdo do arquivo: create_admin.sql"
Write-Host ""
Write-Host "Ou execute via linha de comando:" -ForegroundColor Green
Write-Host "mysql -u $user -p$password $database < $sqlFile"
Write-Host ""
Write-Host "📧 Credenciais do administrador:" -ForegroundColor Cyan
Write-Host "   Email: admin@escola.com"
Write-Host "   Senha: Admin@123"
Write-Host ""
