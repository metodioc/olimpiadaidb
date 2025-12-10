-- Criar tabela de tipos de pagamento
CREATE TABLE IF NOT EXISTS tb_tipo_pagamento (
  idTipoPagamento INT PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(100) NOT NULL,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir tipos padrão
INSERT INTO tb_tipo_pagamento (descricao, status) VALUES
('Gratuita', 'ativo'),
('Paga pela Escola', 'ativo'),
('Paga pelo Aluno', 'ativo');

-- Adicionar coluna idTipoPagamento na tb_olimpiada
ALTER TABLE tb_olimpiada 
ADD COLUMN idTipoPagamento INT NULL AFTER tipoCusto;

-- Adicionar FK
ALTER TABLE tb_olimpiada
ADD CONSTRAINT fk_olimpiada_tipo_pagamento
FOREIGN KEY (idTipoPagamento) REFERENCES tb_tipo_pagamento(idTipoPagamento)
ON DELETE SET NULL;

-- Verificar estrutura
SELECT * FROM tb_tipo_pagamento;
DESCRIBE tb_olimpiada;
