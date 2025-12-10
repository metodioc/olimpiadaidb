# Migrations - OlimpiadaIDB

Este diretório contém todos os scripts SQL de migração do banco de dados do sistema OlimpiadaIDB.

## 📋 Ordem de Execução

Execute as migrations na ordem numérica:

1. **001_criar_tabelas_controle_acesso.sql** - Tabelas de usuários, perfis e permissões
2. **002_criar_tabelas_estrutura_escolar.sql** - Tabelas de filial, série, turma, aluno
3. **003_criar_tabelas_olimpiadas.sql** - Tabelas de olimpíadas, inscrições e resultados
4. **004_criar_tabelas_disciplinas.sql** - Tabelas de disciplinas e áreas de conhecimento
5. **005_inserir_dados_iniciais.sql** - Seeds com dados iniciais do sistema

## 🚀 Como Executar

### Opção 1: Via MySQL Workbench
1. Abra o MySQL Workbench
2. Conecte ao seu servidor MySQL
3. Abra cada arquivo .sql na ordem
4. Execute (Ctrl + Shift + Enter)

### Opção 2: Via Linha de Comando
```bash
# Navegue até o diretório de migrations
cd database/migrations

# Execute cada migration na ordem
mysql -u seu_usuario -p nome_do_banco < 001_criar_tabelas_controle_acesso.sql
mysql -u seu_usuario -p nome_do_banco < 002_criar_tabelas_estrutura_escolar.sql
mysql -u seu_usuario -p nome_do_banco < 003_criar_tabelas_olimpiadas.sql
mysql -u seu_usuario -p nome_do_banco < 004_criar_tabelas_disciplinas.sql
mysql -u seu_usuario -p nome_do_banco < 005_inserir_dados_iniciais.sql
```

### Opção 3: Executar Todas de Uma Vez
```bash
# No PowerShell (Windows)
Get-ChildItem -Path ".\database\migrations\*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Executando: $($_.Name)"
    Get-Content $_.FullName | mysql -u seu_usuario -p nome_do_banco
}
```

## 📊 Estrutura do Banco de Dados

### Total de Tabelas: 23

#### Controle de Acesso (5 tabelas)
- `tb_perfil` - Perfis de usuário
- `tb_usuario` - Usuários do sistema
- `tb_permissao` - Permissões disponíveis
- `tb_perfil_permissao` - Vínculo perfil x permissão
- `tb_log_acesso` - Log de acessos

#### Estrutura Escolar (7 tabelas)
- `tb_ano_letivo` - Anos letivos
- `tb_filial` - Filiais/Unidades
- `tb_grupo_escola` - Grupos escolares
- `tb_serie` - Séries/Anos
- `tb_turma` - Turmas
- `tb_pessoa` - Dados pessoais
- `tb_aluno` - Alunos

#### Dados Pessoais (2 tabelas)
- `tb_pessoa_fone` - Telefones
- `tb_pessoa_image` - Imagens/Fotos

#### Olimpíadas (5 tabelas)
- `tb_olimpiada` - Olimpíadas
- `tb_olimpiada_filial` - Vínculo olimpíada x filial
- `tb_olimpiada_inscricao` - Inscrições
- `tb_tipo_medalha` - Tipos de medalhas
- `tb_olimpiada_resultado` - Resultados

#### Disciplinas (3 tabelas)
- `tb_area_conhecimento` - Áreas do conhecimento
- `tb_disciplina` - Disciplinas
- `tb_olimpiada_disciplina` - Vínculo olimpíada x disciplina

## ⚠️ Importante

- **Backup**: Sempre faça backup antes de executar migrations em produção
- **Ambiente**: Teste primeiro em ambiente de desenvolvimento
- **Senha Admin**: Altere a senha do usuário admin padrão após a primeira execução
- **Encoding**: Certifique-se que o banco está configurado para UTF-8 (utf8mb4)

## 🔐 Usuário Padrão

Após executar as migrations, será criado um usuário administrador:

- **Email**: admin@olimpiadaidb.com
- **Senha**: admin123 (ALTERE IMEDIATAMENTE!)

## 📝 Notas

- Todas as tabelas usam `InnoDB` como engine
- Charset: `utf8mb4_unicode_ci` para suporte completo a caracteres especiais
- Timestamps automáticos em `createdAt` e `updatedAt`
- Índices criados para otimização de consultas
- Foreign Keys configuradas com `ON DELETE CASCADE` quando apropriado
