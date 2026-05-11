-- Migration: Adicionar campo CPF na tb_pessoa
-- Data: 2026-05-08
-- Descrição: Adiciona coluna cpf para sincronização com TOTVS Educacional

ALTER TABLE tb_pessoa
  ADD COLUMN cpf VARCHAR(14) NULL AFTER dtnasc;

ALTER TABLE tb_pessoa
  ADD INDEX idx_pessoa_cpf (cpf);

-- Verificar estrutura final
DESCRIBE tb_pessoa;

SELECT 'Campo CPF adicionado com sucesso na tb_pessoa!' AS status;
