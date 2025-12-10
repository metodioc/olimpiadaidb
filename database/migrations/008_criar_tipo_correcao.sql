-- Criar tabela de tipos de correção
CREATE TABLE IF NOT EXISTS tb_tipo_correcao (
  idTipoCorrecao INT AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(50) NOT NULL UNIQUE,
  ativo ENUM('S', 'N') DEFAULT 'S',
  observacao TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir tipos de correção padrão
INSERT INTO tb_tipo_correcao (descricao, observacao) VALUES
('Automática', 'Correção realizada automaticamente pelo sistema'),
('Manual', 'Correção realizada manualmente por avaliadores'),
('Mista', 'Combinação de correção automática e manual'),
('Dissertativa', 'Correção manual de questões dissertativas'),
('Objetiva', 'Correção automática de questões objetivas');
