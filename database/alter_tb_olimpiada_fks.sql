-- Corrigir estrutura da tb_olimpiada
-- Adicionar FKs para as tabelas relacionadas

USE olimpiadaidb;

-- Verificar estrutura atual
DESCRIBE tb_olimpiada;

-- Verificar quais colunas existem
SELECT COLUMN_NAME 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'olimpiadaidb' 
AND TABLE_NAME = 'tb_olimpiada'
ORDER BY ORDINAL_POSITION;

-- Adicionar idTipoCorrecao apenas se não existir
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'olimpiadaidb' 
  AND TABLE_NAME = 'tb_olimpiada' 
  AND COLUMN_NAME = 'idTipoCorrecao');

SELECT IF(@col_exists > 0, 
  'Coluna idTipoCorrecao já existe', 
  'Adicionando coluna idTipoCorrecao...') as status;

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE tb_olimpiada ADD COLUMN idTipoCorrecao INT NULL AFTER ano', 
  'SELECT "Coluna já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar FK para tipo de correção (se não existir)
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = 'olimpiadaidb' 
  AND TABLE_NAME = 'tb_olimpiada' 
  AND CONSTRAINT_NAME = 'fk_olimpiada_tipo_correcao');

SELECT IF(@fk_exists > 0, 
  'FK fk_olimpiada_tipo_correcao já existe', 
  'Adicionando FK fk_olimpiada_tipo_correcao...') as status;

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE tb_olimpiada ADD CONSTRAINT fk_olimpiada_tipo_correcao FOREIGN KEY (idTipoCorrecao) REFERENCES tb_tipo_correcao(idTipoCorrecao) ON DELETE SET NULL',
  'SELECT "FK já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar estrutura final
DESCRIBE tb_olimpiada;

-- Verificar constraints
SELECT 
  CONSTRAINT_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'olimpiadaidb' 
AND TABLE_NAME = 'tb_olimpiada'
AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar dados
SELECT 
  idOlimpiada,
  nomeOlimpiada,
  ano,
  idLocalAplicacao,
  idTipoPagamento,
  idTipoCorrecao,
  valorCusto
FROM tb_olimpiada
LIMIT 5;
