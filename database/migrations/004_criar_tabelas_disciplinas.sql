-- =====================================================
-- MIGRATION 004: TABELAS DE DISCIPLINAS E ÁREAS
-- Data: 2025-12-01
-- Descrição: Cria tabelas para áreas de conhecimento,
--            disciplinas e vinculação com olimpíadas
-- =====================================================

-- tb_area_conhecimento
CREATE TABLE IF NOT EXISTS `tb_area_conhecimento` (
  `idAreaConhecimento` INT(11) NOT NULL AUTO_INCREMENT,
  `nomeArea` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(200) DEFAULT NULL,
  `ativo` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idAreaConhecimento`),
  UNIQUE KEY `uk_nomeArea` (`nomeArea`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tb_disciplina
CREATE TABLE IF NOT EXISTS `tb_disciplina` (
  `idDisciplina` INT(11) NOT NULL AUTO_INCREMENT,
  `nomeDisciplina` VARCHAR(100) NOT NULL,
  `abreviacaoDisciplina` VARCHAR(20) DEFAULT NULL,
  `idAreaConhecimento` INT(11) NOT NULL,
  `descricao` VARCHAR(200) DEFAULT NULL,
  `ativo` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idDisciplina`),
  UNIQUE KEY `uk_nomeDisciplina` (`nomeDisciplina`),
  KEY `idx_tb_disciplina_idAreaConhecimento` (`idAreaConhecimento`),
  FOREIGN KEY (`idAreaConhecimento`) REFERENCES `tb_area_conhecimento` (`idAreaConhecimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tb_olimpiada_disciplina
CREATE TABLE IF NOT EXISTS `tb_olimpiada_disciplina` (
  `idOlimpiadaDisciplina` INT(11) NOT NULL AUTO_INCREMENT,
  `idOlimpiada` INT(11) NOT NULL,
  `idDisciplina` INT(11) NOT NULL,
  `principal` BOOLEAN DEFAULT FALSE COMMENT 'Indica se é a disciplina principal da olimpíada',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`idOlimpiadaDisciplina`),
  UNIQUE KEY `uk_olimpiada_disciplina` (`idOlimpiada`, `idDisciplina`),
  KEY `idx_tb_olimpiada_disciplina_idOlimpiada` (`idOlimpiada`),
  KEY `idx_tb_olimpiada_disciplina_idDisciplina` (`idDisciplina`),
  FOREIGN KEY (`idOlimpiada`) REFERENCES `tb_olimpiada` (`idOlimpiada`) ON DELETE CASCADE,
  FOREIGN KEY (`idDisciplina`) REFERENCES `tb_disciplina` (`idDisciplina`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
