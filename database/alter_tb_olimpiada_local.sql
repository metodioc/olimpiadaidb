-- Alterar tabela tb_olimpiada para usar FK com tb_local_aplicacao

-- 1. Adicionar nova coluna idLocalAplicacao
ALTER TABLE tb_olimpiada 
ADD COLUMN idLocalAplicacao INT NULL AFTER localAplicacao;

-- 2. Adicionar FK
ALTER TABLE tb_olimpiada
ADD CONSTRAINT fk_olimpiada_local
FOREIGN KEY (idLocalAplicacao) REFERENCES tb_local_aplicacao(idLocalAplicacao)
ON DELETE SET NULL;

-- 3. (OPCIONAL) Migrar dados existentes se houver
-- Caso você tenha dados na coluna localAplicacao (texto), você pode criar os locais e atualizar:
-- UPDATE tb_olimpiada o
-- INNER JOIN tb_local_aplicacao l ON o.localAplicacao = l.nomeLocal
-- SET o.idLocalAplicacao = l.idLocalAplicacao
-- WHERE o.localAplicacao IS NOT NULL;

-- 4. (OPCIONAL) Remover coluna antiga localAplicacao após migração
-- ALTER TABLE tb_olimpiada DROP COLUMN localAplicacao;

-- Verificar estrutura
DESCRIBE tb_olimpiada;
