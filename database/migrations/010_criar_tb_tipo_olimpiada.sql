-- =============================================
-- Migration 010: Tabela de Tipos de Olimpíada
-- Data: 2026-05-11
-- Descrição: Catálogo de olimpíadas pré-cadastradas
-- =============================================

-- Criar tabela de tipos de olimpíada (catálogo)
CREATE TABLE IF NOT EXISTS tb_tipo_olimpiada (
  idTipoOlimpiada INT AUTO_INCREMENT PRIMARY KEY,
  nomeOlimpiada   VARCHAR(200) NOT NULL,
  abreviacao      VARCHAR(20)  NOT NULL,
  descricao       TEXT         NULL,
  ativo           TINYINT(1)   NOT NULL DEFAULT 1,
  dataCriacao     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_tipo_olimpiada_abv (abreviacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir olimpíadas comuns como seed
INSERT INTO tb_tipo_olimpiada (nomeOlimpiada, abreviacao, descricao) VALUES
  ('Olimpíada Brasileira de Matemática das Escolas Públicas', 'OBMEP', 'Olimpíada nacional de matemática'),
  ('Olimpíada Brasileira de Matemática', 'OBM', 'Olimpíada nacional de matemática para todas as escolas'),
  ('Olimpíada Brasileira de Física', 'OBF', 'Olimpíada nacional de física'),
  ('Olimpíada Brasileira de Química', 'OBQ', 'Olimpíada nacional de química'),
  ('Olimpíada Brasileira de Astronomia', 'OBA', 'Olimpíada nacional de astronomia e astronáutica'),
  ('Olimpíada Brasileira de Biologia', 'OBBio', 'Olimpíada nacional de biologia'),
  ('Olimpíada Brasileira de Informática', 'OBI', 'Olimpíada nacional de informática'),
  ('Olimpíada Brasileira de Língua Portuguesa', 'OBLP', 'Olimpíada nacional de língua portuguesa'),
  ('Olimpíada Brasileira de Robótica', 'OBR', 'Olimpíada nacional de robótica'),
  ('Olimpíada Interna de Matemática', 'OIM', 'Olimpíada interna de matemática da rede'),
  ('Olimpíada Interna de Ciências', 'OIC', 'Olimpíada interna de ciências da rede'),
  ('Olimpíada Interna de Português', 'OIP', 'Olimpíada interna de português da rede')
ON DUPLICATE KEY UPDATE nomeOlimpiada = VALUES(nomeOlimpiada);

-- Adicionar coluna idTipoOlimpiada em tb_olimpiada (nullable para não quebrar registros existentes)
ALTER TABLE tb_olimpiada
  ADD COLUMN IF NOT EXISTS idTipoOlimpiada INT NULL AFTER idOlimpiada,
  ADD CONSTRAINT fk_olimpiada_tipo FOREIGN KEY (idTipoOlimpiada)
    REFERENCES tb_tipo_olimpiada(idTipoOlimpiada)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_tipo_olimpiada_ativo ON tb_tipo_olimpiada(ativo);
CREATE INDEX IF NOT EXISTS idx_olimpiada_tipo ON tb_olimpiada(idTipoOlimpiada);
