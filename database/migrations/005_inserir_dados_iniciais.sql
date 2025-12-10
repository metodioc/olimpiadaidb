-- =====================================================
-- MIGRATION 005: DADOS INICIAIS (SEEDS)
-- Data: 2025-12-01
-- Descrição: Insere dados iniciais no sistema:
--            perfis, permissões, tipos de medalha,
--            áreas de conhecimento e disciplinas
-- =====================================================

-- ===================
-- PERFIS DE USUÁRIO
-- ===================
INSERT INTO `tb_perfil` (`nome_perfil`, `descricao`, `nivel_acesso`) VALUES
('Administrador', 'Acesso total ao sistema', 1),
('Professor', 'Acesso a cadastros de olimpíadas e gerenciamento', 2),
('Aluno', 'Visualização de resultados e informações', 3),
('Responsável', 'Visualização de resultados dos alunos vinculados', 4);

-- ===================
-- PERMISSÕES
-- ===================
INSERT INTO `tb_permissao` (`nome_permissao`, `descricao`, `modulo`, `acao`) VALUES
-- Módulo Usuários
('usuarios.visualizar', 'Visualizar usuários', 'usuarios', 'visualizar'),
('usuarios.criar', 'Criar novos usuários', 'usuarios', 'criar'),
('usuarios.editar', 'Editar usuários', 'usuarios', 'editar'),
('usuarios.excluir', 'Excluir usuários', 'usuarios', 'excluir'),

-- Módulo Olimpíadas
('olimpiadas.visualizar', 'Visualizar olimpíadas', 'olimpiadas', 'visualizar'),
('olimpiadas.criar', 'Criar olimpíadas', 'olimpiadas', 'criar'),
('olimpiadas.editar', 'Editar olimpíadas', 'olimpiadas', 'editar'),
('olimpiadas.excluir', 'Excluir olimpíadas', 'olimpiadas', 'excluir'),

-- Módulo Inscrições
('inscricoes.visualizar', 'Visualizar inscrições', 'inscricoes', 'visualizar'),
('inscricoes.criar', 'Criar inscrições', 'inscricoes', 'criar'),
('inscricoes.editar', 'Editar inscrições', 'inscricoes', 'editar'),
('inscricoes.excluir', 'Excluir inscrições', 'inscricoes', 'excluir'),

-- Módulo Resultados
('resultados.visualizar', 'Visualizar resultados', 'resultados', 'visualizar'),
('resultados.lancar', 'Lançar resultados', 'resultados', 'criar'),
('resultados.editar', 'Editar resultados', 'resultados', 'editar'),

-- Módulo Alunos
('alunos.visualizar', 'Visualizar alunos', 'alunos', 'visualizar'),
('alunos.criar', 'Criar alunos', 'alunos', 'criar'),
('alunos.editar', 'Editar alunos', 'alunos', 'editar'),
('alunos.excluir', 'Excluir alunos', 'alunos', 'excluir'),

-- Módulo Relatórios
('relatorios.visualizar', 'Visualizar relatórios', 'relatorios', 'visualizar'),
('relatorios.exportar', 'Exportar relatórios', 'relatorios', 'exportar');

-- ===================
-- VINCULAR PERMISSÕES AO PERFIL ADMINISTRADOR (id_perfil = 1)
-- ===================
INSERT INTO `tb_perfil_permissao` (`id_perfil`, `id_permissao`)
SELECT 1, `id_permissao` FROM `tb_permissao`;

-- ===================
-- VINCULAR PERMISSÕES AO PERFIL PROFESSOR (id_perfil = 2)
-- ===================
INSERT INTO `tb_perfil_permissao` (`id_perfil`, `id_permissao`)
SELECT 2, `id_permissao` FROM `tb_permissao` 
WHERE `nome_permissao` IN (
    'olimpiadas.visualizar', 'olimpiadas.criar', 'olimpiadas.editar',
    'inscricoes.visualizar', 'inscricoes.criar', 'inscricoes.editar',
    'resultados.visualizar', 'resultados.lancar', 'resultados.editar',
    'alunos.visualizar',
    'relatorios.visualizar', 'relatorios.exportar'
);

-- ===================
-- VINCULAR PERMISSÕES AO PERFIL ALUNO (id_perfil = 3)
-- ===================
INSERT INTO `tb_perfil_permissao` (`id_perfil`, `id_permissao`)
SELECT 3, `id_permissao` FROM `tb_permissao` 
WHERE `nome_permissao` IN (
    'olimpiadas.visualizar',
    'resultados.visualizar'
);

-- ===================
-- VINCULAR PERMISSÕES AO PERFIL RESPONSÁVEL (id_perfil = 4)
-- ===================
INSERT INTO `tb_perfil_permissao` (`id_perfil`, `id_permissao`)
SELECT 4, `id_permissao` FROM `tb_permissao` 
WHERE `nome_permissao` IN (
    'olimpiadas.visualizar',
    'resultados.visualizar',
    'relatorios.visualizar'
);

-- ===================
-- TIPOS DE MEDALHA
-- ===================
INSERT INTO `tb_tipo_medalha` (`tipoMedalha`, `descricao`, `ordem`, `corHex`) VALUES
('Ouro', 'Medalha de Ouro - 1º Lugar', 1, '#FFD700'),
('Prata', 'Medalha de Prata - 2º Lugar', 2, '#C0C0C0'),
('Bronze', 'Medalha de Bronze - 3º Lugar', 3, '#CD7F32'),
('Menção Honrosa', 'Menção Honrosa', 4, '#4169E1'),
('Participação', 'Certificado de Participação', 5, '#32CD32');

-- ===================
-- ÁREAS DE CONHECIMENTO
-- ===================
INSERT INTO `tb_area_conhecimento` (`nomeArea`, `descricao`) VALUES
('Ciências Exatas', 'Matemática, Física, Química'),
('Ciências Humanas', 'História, Geografia, Filosofia, Sociologia'),
('Linguagens', 'Português, Inglês, Espanhol, Arte'),
('Ciências da Natureza', 'Biologia, Ciências'),
('Tecnologia', 'Informática, Robótica, Programação'),
('Multidisciplinar', 'Envolve várias áreas do conhecimento');

-- ===================
-- DISCIPLINAS
-- ===================
INSERT INTO `tb_disciplina` (`nomeDisciplina`, `abreviacaoDisciplina`, `idAreaConhecimento`) VALUES
-- Ciências Exatas (idAreaConhecimento = 1)
('Matemática', 'MAT', 1),
('Física', 'FIS', 1),
('Química', 'QUI', 1),

-- Ciências Humanas (idAreaConhecimento = 2)
('História', 'HIS', 2),
('Geografia', 'GEO', 2),
('Filosofia', 'FIL', 2),
('Sociologia', 'SOC', 2),

-- Linguagens (idAreaConhecimento = 3)
('Língua Portuguesa', 'PORT', 3),
('Língua Inglesa', 'ING', 3),
('Língua Espanhola', 'ESP', 3),
('Arte', 'ART', 3),
('Educação Física', 'EDF', 3),

-- Ciências da Natureza (idAreaConhecimento = 4)
('Biologia', 'BIO', 4),
('Ciências', 'CIE', 4),

-- Tecnologia (idAreaConhecimento = 5)
('Informática', 'INF', 5),
('Robótica', 'ROB', 5),
('Programação', 'PROG', 5),

-- Multidisciplinar (idAreaConhecimento = 6)
('Conhecimentos Gerais', 'CG', 6),
('Astronomia', 'AST', 6);

-- ===================
-- USUÁRIO ADMIN PADRÃO
-- ===================
-- Senha: admin123 (hash bcrypt - ALTERE ISSO EM PRODUÇÃO!)
-- Para gerar novo hash: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('sua_senha', 10).then(hash => console.log(hash));"
INSERT INTO `tb_usuario` (`id_perfil`, `nome_completo`, `email`, `senha`, `cpf`, `ativo`) VALUES
(1, 'Administrador do Sistema', 'admin@olimpiadaidb.com', '$2b$10$Y5Bflpu7INVc/u78HgAvh.LI1PICcUek9bhdsNLrF6be2ymYzxp9m', NULL, TRUE);

-- NOTA: A senha acima permite login com admin123. Em produção, você deve:
-- 1. Gerar um hash novo e forte
-- 2. Alterar a senha no primeiro acesso
-- 3. Implementar política de senhas fortes
