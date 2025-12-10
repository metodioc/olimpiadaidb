-- =====================================================
-- MIGRATION 007: CRIAR TABELA tb_ramo E DADOS FALTANTES
-- Data: 2025-12-03
-- Descrição: Cria tabela tb_ramo e insere dados de filiais/séries
--            que faltaram na migration 006
-- =====================================================

-- ===================
-- CRIAR TABELA tb_ramo
-- ===================
CREATE TABLE IF NOT EXISTS `tb_ramo` (
  `idRamo` INT NOT NULL AUTO_INCREMENT,
  `nomeRamo` VARCHAR(100) NOT NULL,
  `descricao` TEXT,
  `ordem` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idRamo`),
  UNIQUE KEY `uk_nome_ramo` (`nomeRamo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================
-- FILIAIS (caso não existam)
-- ===================
INSERT IGNORE INTO `tb_filial` (`codFilial`, `filial`, `abFilial`) VALUES
(1, 'Unidade Centro', 'CTR'),
(2, 'Unidade Norte', 'NRT'),
(3, 'Unidade Sul', 'SUL'),
(4, 'Unidade Leste', 'LST'),
(5, 'Unidade Oeste', 'OST');

-- ===================
-- GRUPOS ESCOLA (caso não existam)
-- ===================
INSERT IGNORE INTO `tb_grupo_escola` (`grupoEscola`, `abGrupoEscola`) VALUES
('Ensino Fundamental I', 'EF1'),
('Ensino Fundamental II', 'EF2'),
('Ensino Médio', 'EM');

-- ===================
-- SÉRIES (caso não existam)
-- IMPORTANTE: Cada série precisa estar vinculada a uma filial
-- ===================
-- Séries para Unidade Centro (idFilial = 1)
INSERT IGNORE INTO `tb_serie` (`codSerie`, `abSerie`, `serie`, `idFilial`) VALUES
(1, '1EF', '1º Ano EF', 1),
(2, '2EF', '2º Ano EF', 1),
(3, '3EF', '3º Ano EF', 1),
(4, '4EF', '4º Ano EF', 1),
(5, '5EF', '5º Ano EF', 1),
(6, '6EF', '6º Ano EF', 1),
(7, '7EF', '7º Ano EF', 1),
(8, '8EF', '8º Ano EF', 1),
(9, '9EF', '9º Ano EF', 1),
(10, '1EM', '1º Ano EM', 1),
(11, '2EM', '2º Ano EM', 1),
(12, '3EM', '3º Ano EM', 1);

-- ===================
-- RAMOS (NÍVEIS DE COMPETIÇÃO)
-- ===================
INSERT IGNORE INTO `tb_ramo` (`nomeRamo`, `descricao`, `ordem`) VALUES
('Nível 1', 'Alunos do 6º e 7º anos do Ensino Fundamental', 1),
('Nível 2', 'Alunos do 8º e 9º anos do Ensino Fundamental', 2),
('Nível 3', 'Alunos do Ensino Médio', 3),
('Júnior', 'Categoria Júnior - Ensino Fundamental I', 4),
('Sênior', 'Categoria Sênior - Ensino Médio', 5);

SELECT '✅ Migration 007 executada com sucesso!' as Mensagem;
SELECT CONCAT('📍 Filiais: ', COUNT(*)) as Total FROM tb_filial;
SELECT CONCAT('📚 Séries: ', COUNT(*)) as Total FROM tb_serie;
SELECT CONCAT('🏆 Ramos: ', COUNT(*)) as Total FROM tb_ramo;

