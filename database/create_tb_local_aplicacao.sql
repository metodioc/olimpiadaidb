-- Criar tabela de locais de aplicação
CREATE TABLE IF NOT EXISTS tb_local_aplicacao (
  idLocalAplicacao INT PRIMARY KEY AUTO_INCREMENT,
  nomeLocal VARCHAR(100) NOT NULL,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir alguns locais padrão
INSERT INTO tb_local_aplicacao (nomeLocal, status) VALUES
('Sede Principal', 'ativo'),
('Filial Norte', 'ativo'),
('Filial Sul', 'ativo'),
('Online', 'ativo');

-- Verificar inserção
SELECT * FROM tb_local_aplicacao;
