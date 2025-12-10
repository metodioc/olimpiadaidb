-- Criar usuário administrador para testes
-- Email: admin@escola.com
-- Senha: Admin@123

INSERT INTO tb_usuario (
    id_perfil,
    nome_completo,
    email,
    senha,
    cpf,
    telefone,
    ativo
) VALUES (
    (SELECT id_perfil FROM tb_perfil WHERE nome_perfil = 'Administrador'),
    'Administrador Sistema',
    'admin@escola.com',
    '$2b$10$Zj8DEVjvC.PfZWMMsN3sUOj.d9h7kIb3irDIEan7hFIFlv2RdetIq',
    '12345678900',
    '11999999999',
    1
);

SELECT 'Usuário administrador criado com sucesso!' as Mensagem;
SELECT 
    u.id_usuario,
    u.nome_completo,
    u.email,
    p.nome_perfil,
    'Senha: Admin@123' as senha
FROM tb_usuario u
INNER JOIN tb_perfil p ON u.id_perfil = p.id_perfil
WHERE u.email = 'admin@escola.com';
