-- =====================================================
-- MIGRATION 006: DADOS INICIAIS - FILIAIS E ESTRUTURA
-- Data: 2025-12-01
-- Descrição: Insere dados básicos de filiais, anos letivos,
--            séries e outros dados necessários para testes
-- =====================================================

-- ===================
-- ANOS LETIVOS
-- ===================
INSERT INTO `tb_ano_letivo` (`anoLetivo`, `status`) VALUES
(2024, 'inativo'),
(2025, 'ativo'),
(2026, 'ativo');

-- ===================
-- FILIAIS
-- ===================
INSERT INTO `tb_filial` (`codFilial`, `filial`, `abFilial`) VALUES
(1, 'Unidade Centro', 'CTR'),
(2, 'Unidade Norte', 'NRT'),
(3, 'Unidade Sul', 'SUL'),
(4, 'Unidade Leste', 'LST'),
(5, 'Unidade Oeste', 'OST');

-- ===================
-- GRUPOS ESCOLA
-- ===================
INSERT INTO `tb_grupo_escola` (`grupoEscola`, `abGrupoEscola`) VALUES
('Ensino Fundamental I', 'EF1'),
('Ensino Fundamental II', 'EF2'),
('Ensino Médio', 'EM');

-- ===================
-- SÉRIES
-- ===================
INSERT INTO `tb_serie` (`serie`, `abreviacao`) VALUES
('1º Ano EF', '1EF'),
('2º Ano EF', '2EF'),
('3º Ano EF', '3EF'),
('4º Ano EF', '4EF'),
('5º Ano EF', '5EF'),
('6º Ano EF', '6EF'),
('7º Ano EF', '7EF'),
('8º Ano EF', '8EF'),
('9º Ano EF', '9EF'),
('1º Ano EM', '1EM'),
('2º Ano EM', '2EM'),
('3º Ano EM', '3EM');

-- ===================
-- RAMOS (NÍVEIS DE COMPETIÇÃO)
-- ===================
INSERT INTO `tb_ramo` (`nomeRamo`, `descricao`, `ordem`) VALUES
('Nível 1', 'Alunos do 6º e 7º anos do Ensino Fundamental', 1),
('Nível 2', 'Alunos do 8º e 9º anos do Ensino Fundamental', 2),
('Nível 3', 'Alunos do Ensino Médio', 3),
('Júnior', 'Categoria Júnior - Ensino Fundamental I', 4),
('Sênior', 'Categoria Sênior - Ensino Médio', 5);

SELECT '✅ Dados iniciais de filiais e estrutura inseridos com sucesso!' as Mensagem;
