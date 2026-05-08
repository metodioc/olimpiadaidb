-- Adicionar coluna idAnoLetivo na tabela tb_serie
-- Relacionamento com tb_ano_letivo

USE olimpiadaidb;

-- Verificar estrutura atual
DESCRIBE tb_serie;

-- Adicionar coluna idAnoLetivo se não existir
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'olimpiadaidb' 
  AND TABLE_NAME = 'tb_serie' 
  AND COLUMN_NAME = 'idAnoLetivo');

SELECT IF(@col_exists > 0, 
  'Coluna idAnoLetivo já existe em tb_serie', 
  'Adicionando coluna idAnoLetivo em tb_serie...') as status;

SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE tb_serie ADD COLUMN idAnoLetivo INT NULL AFTER idFilial', 
  'SELECT "Coluna já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Adicionar FK para tb_ano_letivo se não existir
SET @fk_exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = 'olimpiadaidb' 
  AND TABLE_NAME = 'tb_serie' 
  AND CONSTRAINT_NAME = 'fk_serie_ano_letivo');

SELECT IF(@fk_exists > 0, 
  'FK fk_serie_ano_letivo já existe', 
  'Adicionando FK fk_serie_ano_letivo...') as status;

SET @sql = IF(@fk_exists = 0, 
  'ALTER TABLE tb_serie ADD CONSTRAINT fk_serie_ano_letivo FOREIGN KEY (idAnoLetivo) REFERENCES tb_ano_letivo(idAnoLetivo) ON DELETE SET NULL', 
  'SELECT "FK já existe"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar estrutura final
DESCRIBE tb_serie;

-- Verificar constraints
SELECT 
  CONSTRAINT_NAME,
  COLUMN_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'olimpiadaidb' 
AND TABLE_NAME = 'tb_serie'
AND REFERENCED_TABLE_NAME IS NOT NULL;
