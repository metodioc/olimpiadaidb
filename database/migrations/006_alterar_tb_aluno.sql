-- Migration: Alterar estrutura da tb_aluno
-- Data: 2025-12-17
-- Descrição: Remover idPessoa e idTurma, adicionar campos de código para relacionamento direto com TOTVS

-- 0. Desabilitar verificação de FK temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Limpar dados existentes
TRUNCATE TABLE tb_olimpiada_inscricao;
TRUNCATE TABLE tb_aluno;

-- 2. Remover constraints antigas (se existirem)
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS fk_aluno_pessoa;
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS fk_aluno_turma;
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS fk_aluno_grupo_escola;
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS tb_aluno_ibfk_1;
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS tb_aluno_ibfk_2;
ALTER TABLE tb_aluno DROP FOREIGN KEY IF EXISTS tb_aluno_ibfk_3;

-- 3. Remover colunas antigas
ALTER TABLE tb_aluno DROP COLUMN IF EXISTS idPessoa;
ALTER TABLE tb_aluno DROP COLUMN IF EXISTS idTurma;

-- 4. Adicionar novas colunas
ALTER TABLE tb_aluno 
  ADD COLUMN codPessoa VARCHAR(20) NULL AFTER idGrupoEscola,
  ADD COLUMN codTurma VARCHAR(20) NULL AFTER codPessoa,
  ADD COLUMN codFilial VARCHAR(10) NULL AFTER codTurma,
  ADD COLUMN codSerie VARCHAR(10) NULL AFTER codFilial,
  ADD COLUMN anoLetivo INT NULL AFTER codSerie;

-- 5. Adicionar índices para melhor performance
ALTER TABLE tb_aluno 
  ADD INDEX idx_aluno_codpessoa (codPessoa),
  ADD INDEX idx_aluno_codturma (codTurma),
  ADD INDEX idx_aluno_codfilial (codFilial),
  ADD INDEX idx_aluno_codserie (codSerie),
  ADD INDEX idx_aluno_anoletivo (anoLetivo),
  ADD INDEX idx_aluno_ra_ano (ra, anoLetivo);

-- 6. Adicionar comentários
ALTER TABLE tb_aluno COMMENT = 'Tabela de alunos - sincronizada com TOTVS via códigos diretos';

-- 7. Reabilitar verificação de FK
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar estrutura final
DESCRIBE tb_aluno;

-- Mostrar status
SELECT 
  'tb_aluno alterada com sucesso!' as status,
  COUNT(*) as total_registros 
FROM tb_aluno;
