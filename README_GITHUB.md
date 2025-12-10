# Sistema de Gestão de Olimpíadas - IDB

Sistema completo para gestão de olimpíadas escolares com controle de inscrições, resultados e medalhas.

## 🚀 Funcionalidades

### ✅ Implementado

- **Autenticação e Autorização**
  - Sistema de login com JWT
  - Níveis de acesso (Administrador, Professor, Aluno, Responsável)
  - Middleware de proteção de rotas

- **Gestão de Olimpíadas**
  - CRUD completo de olimpíadas
  - Relacionamento com tipos de correção, pagamento e locais
  - Sistema de status (planejamento, inscrições abertas, em andamento, finalizada)
  - Vinculação com disciplinas e filiais

- **Sistema de Inscrições** 🆕
  - Inscrição individual de alunos
  - Inscrição em lote por turma completa
  - Inscrição em lote por série completa (filtrando por filial)
  - Verificação automática de duplicatas
  - Estatísticas em tempo real
  - Gerenciamento completo (adicionar/remover)

- **Gestão Escolar**
  - Cadastro de alunos, turmas, séries
  - Gestão de filiais
  - Anos letivos
  - Estrutura organizacional completa

- **Dashboard**
  - Estatísticas gerais
  - Olimpíadas em destaque
  - Visualização de inscrições e resultados

- **Interface Responsiva**
  - Design Material Design
  - Navegação intuitiva
  - Feedback visual em todas as operações

## 🛠️ Tecnologias

- **Backend**: Node.js + Express.js
- **Banco de Dados**: MySQL
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: express-validator
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Segurança**: bcrypt, CORS configurado

## 📋 Pré-requisitos

- Node.js 16+ 
- MySQL 8+
- npm ou yarn

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/metodioc/olimpiadaidb.git
cd olimpiadaidb
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
# Execute as migrations em ordem
mysql -u root -p < database/migrations/001_criar_tabelas_controle_acesso.sql
mysql -u root -p < database/migrations/002_criar_tabelas_estrutura_escolar.sql
mysql -u root -p < database/migrations/003_criar_tabelas_olimpiadas.sql
mysql -u root -p < database/migrations/004_criar_tabelas_disciplinas.sql
mysql -u root -p < database/migrations/005_inserir_dados_iniciais.sql
```

4. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas configurações
```

5. Crie o usuário administrador:
```bash
mysql -u root -p olimpiadaidb < create_admin.sql
```

6. Inicie o servidor:
```bash
npm run dev
```

O sistema estará disponível em: `http://localhost:5101`

## 👤 Acesso Padrão

- **Email**: admin@idb.edu.br
- **Senha**: admin123

⚠️ **Importante**: Altere a senha padrão após o primeiro acesso!

## 📁 Estrutura do Projeto

```
olimpiadaidb/
├── database/
│   ├── migrations/          # Scripts SQL de criação
│   └── alter_*.sql         # Scripts de alteração
├── docs/                   # Documentação
├── public/
│   ├── css/               # Estilos
│   ├── js/                # Scripts frontend
│   └── pages/             # Páginas HTML
├── src/
│   ├── config/            # Configurações
│   ├── controllers/       # Controladores
│   ├── models/            # Models
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares
│   └── server.js          # Servidor Express
└── package.json
```

## 🔐 Níveis de Acesso

1. **Administrador**: Acesso total ao sistema
2. **Professor**: Gerencia olimpíadas e inscrições
3. **Aluno**: Visualiza inscrições e resultados
4. **Responsável**: Visualiza dados dos alunos vinculados

## 📡 API Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado

### Olimpíadas
- `GET /api/olimpiadas` - Listar olimpíadas
- `POST /api/olimpiadas` - Criar olimpíada
- `PUT /api/olimpiadas/:id` - Atualizar olimpíada
- `GET /api/olimpiadas/:id` - Detalhes da olimpíada

### Inscrições
- `POST /api/inscricoes` - Inscrição individual
- `POST /api/inscricoes/lote` - Inscrição em lote (série/turma)
- `DELETE /api/inscricoes/:id` - Cancelar inscrição
- `DELETE /api/inscricoes/lote` - Remover múltiplas inscrições
- `GET /api/inscricoes?idOlimpiada=X` - Listar inscritos

### Alunos
- `GET /api/alunos` - Listar alunos (com filtros)
- `GET /api/alunos/:id` - Detalhes do aluno

## 🎯 Próximas Funcionalidades

- [ ] Sistema de resultados e pontuação
- [ ] Geração de certificados
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Sistema de notificações
- [ ] Painel para responsáveis
- [ ] Upload de gabaritos e provas

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@idb.edu.br

---

Desenvolvido com ❤️ para IDB
