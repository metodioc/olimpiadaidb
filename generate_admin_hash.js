const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Senha:', password);
  console.log('Hash:', hash);
  
  // Gerar INSERT SQL
  console.log('\n--- SQL INSERT ---');
  console.log(`
INSERT INTO tb_usuario (
    id_perfil,
    nome_completo,
    email,
    senha_hash,
    cpf,
    data_nascimento,
    telefone,
    ativo
) VALUES (
    (SELECT id_perfil FROM tb_perfil WHERE nome_perfil = 'administrador'),
    'Administrador Sistema',
    'admin@escola.com',
    '${hash}',
    '12345678900',
    '1980-01-01',
    '11999999999',
    1
);
  `);
}

generateHash();
