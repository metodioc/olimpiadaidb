@echo off
echo ============================================
echo Migration: Alterar tb_aluno
echo ============================================
echo.

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Workbench 8.0 CE\mysql.exe

echo Executando migration...
"%MYSQL_PATH%" -u user_olimpiada -p olimpiadaidb < database\migrations\006_alterar_tb_aluno.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Migration executada com sucesso!
    echo ============================================
) else (
    echo.
    echo ============================================
    echo Erro ao executar migration!
    echo ============================================
)

pause
