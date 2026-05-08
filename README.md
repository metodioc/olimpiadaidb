# 🏆 OlimpiadaIDB

Sistema completo para cadastro de olimpíadas escolares e controle de participação de alunos, desenvolvido com Node.js, Express e MySQL.

## 📋 Sobre o Projeto

O **OlimpiadaIDB** é um sistema de gestão escolar focado em olimpíadas acadêmicas, permitindo:

✅ Cadastro e gerenciamento de olimpíadas  
✅ Controle de inscrições de alunos  
✅ Registro de resultados e medalhas  
✅ Geração de rankings por série, turma e filial  
✅ Controle de acesso baseado em perfis (Admin, Professor, Aluno, Responsável)  
✅ Vinculação de disciplinas e áreas de conhecimento  
✅ Histórico completo de participações  

---

## 🚀 Tecnologias Utilizadas

- **Backend**: Node.js + Express.js
- **Banco de Dados**: MySQL 8.0+
- **Autenticação**: JWT (JSON Web Tokens)
- **Segurança**: Helmet, bcrypt, rate-limiting
- **Validação**: Express Validator
- **Logs**: Winston + Morgan

---

## 🎨 Design System

O sistema utiliza **Material Design 3 (MD3)** da Google como base para toda interface:

### Componentes Disponíveis

- **Botões**: Filled, Outlined, Text, Elevated, Toned
- **Cards**: Elevated, Filled, Outlined
- **Forms**: Text Fields (Outlined/Filled), Select, Checkbox, Radio, Switch
- **Navigation**: Navigation Drawer, Top App Bar, Breadcrumb, Tabs
- **Data Display**: Tables, Lists, Chips, Badges
- **Feedback**: Dialogs, Snackbars, Progress Indicators
- **Layout**: Grid System (12 colunas), Flexbox utilities

### Arquivos CSS

```
public/css/
├── material-theme.css       # Variáveis de tema (cores, tipografia, espaçamentos)
├── material-components.css  # Componentes MD3 (botões, cards, forms, etc)
└── material-layout.css      # Layout e navegação (drawer, app bar, grid)
```

### Paleta de Cores

- **Primary**: `#1976D2` (Azul)
- **Secondary**: `#535E71` (Cinza Azulado)
- **Tertiary**: `#6B5778` (Roxo)
- **Success**: `#4CAF50` (Verde)
- **Error**: `#BA1A1A` (Vermelho)
- **Warning**: `#FF9800` (Laranja)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18.0.0 ou superior
- [MySQL](https://www.mysql.com/) v8.0 ou superior
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) v9.0.0 ou superior

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/olimpiadaidb.git
cd olimpiadaidb
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco de dados MySQL:

```sql
CREATE DATABASE olimpiadaidb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=olimpiadaidb

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui

# Servidor
PORT=3000
NODE_ENV=development
```

### 5. Execute as migrations

Execute as migrations para criar as tabelas:

```bash
npm run migrate
```

Ou execute manualmente pelo MySQL:

```bash
# No diretório database/migrations
mysql -u root -p olimpiadaidb < 001_criar_tabelas_controle_acesso.sql
mysql -u root -p olimpiadaidb < 002_criar_tabelas_estrutura_escolar.sql
mysql -u root -p olimpiadaidb < 003_criar_tabelas_olimpiadas.sql
mysql -u root -p olimpiadaidb < 004_criar_tabelas_disciplinas.sql
mysql -u root -p olimpiadaidb < 005_inserir_dados_iniciais.sql
```

---

## ▶️ Executando o Projeto

### Modo Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

O servidor estará disponível em: `http://localhost:3000`

---

## 📚 Estrutura do Projeto

```
olimpiadaidb/
├── database/
│   ├── migrations/          # Scripts SQL de criação de tabelas
│   └── seeds/               # Dados iniciais (em desenvolvimento)
├── src/
│   ├── config/              # Configurações (database, etc)
│   ├── controllers/         # Controladores da API
│   ├── models/              # Models de dados
│   ├── routes/              # Rotas da API
│   ├── middleware/          # Middlewares (auth, validação)
│   ├── services/            # Lógica de negócio
│   ├── scripts/             # Scripts utilitários
│   └── server.js            # Arquivo principal do servidor
├── docs/                    # Documentação adicional
├── .env.example             # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts
└── README.md               # Este arquivo
```

---

## 🗄️ Estrutura do Banco de Dados

O sistema possui **23 tabelas** organizadas em 5 grupos:

### 1. Controle de Acesso (5 tabelas)
- `tb_perfil` - Perfis de usuário
- `tb_usuario` - Usuários do sistema
- `tb_permissao` - Permissões disponíveis
- `tb_perfil_permissao` - Vínculo perfil x permissão
- `tb_log_acesso` - Log de acessos

### 2. Estrutura Escolar (7 tabelas)
- `tb_ano_letivo` - Anos letivos
- `tb_filial` - Filiais/Unidades escolares
- `tb_grupo_escola` - Grupos de escolas
- `tb_serie` - Séries/Anos escolares
- `tb_turma` - Turmas
- `tb_pessoa` - Dados pessoais
- `tb_aluno` - Alunos

### 3. Dados Pessoais (2 tabelas)
- `tb_pessoa_fone` - Telefones
- `tb_pessoa_image` - Imagens/Fotos

### 4. Olimpíadas (5 tabelas)
- `tb_olimpiada` - Olimpíadas
- `tb_olimpiada_filial` - Vínculo olimpíada x filial
- `tb_olimpiada_inscricao` - Inscrições de alunos
- `tb_tipo_medalha` - Tipos de medalhas
- `tb_olimpiada_resultado` - Resultados e medalhas

### 5. Disciplinas (3 tabelas)
- `tb_area_conhecimento` - Áreas do conhecimento
- `tb_disciplina` - Disciplinas
- `tb_olimpiada_disciplina` - Vínculo olimpíada x disciplina

Consulte `database/migrations/README.md` para mais detalhes.

---

## 🔐 Autenticação e Perfis

### Perfis de Acesso

| Perfil | Nível | Permissões |
|--------|-------|------------|
| **Administrador** | 1 | Acesso total ao sistema |
| **Professor** | 2 | Gerenciar olimpíadas, inscrições e resultados |
| **Aluno** | 3 | Visualizar olimpíadas e seus resultados |
| **Responsável** | 4 | Visualizar resultados dos alunos vinculados |

### Usuário Padrão

Após executar as migrations, será criado um usuário administrador:

- **Email**: `admin@olimpiadaidb.com`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro acesso!

---

## 🛣️ Rotas da API (em desenvolvimento)

### Autenticação
```
POST   /api/auth/login       - Login de usuário
POST   /api/auth/register    - Cadastro de novo usuário
GET    /api/auth/me          - Dados do usuário logado
```

### Olimpíadas
```
GET    /api/olimpiadas           - Listar olimpíadas
GET    /api/olimpiadas/:id       - Detalhes de uma olimpíada
POST   /api/olimpiadas           - Criar olimpíada
PUT    /api/olimpiadas/:id       - Atualizar olimpíada
DELETE /api/olimpiadas/:id       - Excluir olimpíada
```

### Inscrições
```
GET    /api/inscricoes                      - Listar inscrições
POST   /api/inscricoes                      - Criar inscrição
POST   /api/inscricoes/em-lote              - Inscrição em lote
GET    /api/inscricoes/olimpiada/:id        - Inscrições de uma olimpíada
```

### Resultados
```
GET    /api/resultados/olimpiada/:id        - Resultados de uma olimpíada
POST   /api/resultados                      - Lançar resultado
PUT    /api/resultados/:id                  - Atualizar resultado
GET    /api/resultados/ranking/:id          - Ranking da olimpíada
```

---

## 📊 Exemplos de Consultas Úteis

### Ranking Geral de uma Olimpíada
```sql
SELECT 
    p.nome,
    s.serie,
    t.turma,
    r.pontuacao,
    r.classificacao,
    tm.tipoMedalha
FROM tb_olimpiada_resultado r
INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
INNER JOIN tb_turma t ON a.idTurma = t.idTurma
INNER JOIN tb_serie s ON t.idSerie = s.idSerie
LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE i.idOlimpiada = 1
ORDER BY r.classificacao;
```

### Top 10 Medalhistas de Todas as Olimpíadas
```sql
SELECT 
    p.nome,
    COUNT(r.idTipoMedalha) as totalMedalhas,
    SUM(CASE WHEN tm.ordem = 1 THEN 1 ELSE 0 END) as ouro,
    SUM(CASE WHEN tm.ordem = 2 THEN 1 ELSE 0 END) as prata,
    SUM(CASE WHEN tm.ordem = 3 THEN 1 ELSE 0 END) as bronze
FROM tb_olimpiada_resultado r
INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
INNER JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE tm.ordem <= 3
GROUP BY p.idPessoa, p.nome
ORDER BY ouro DESC, prata DESC, bronze DESC
LIMIT 10;
```

---

## 🧪 Testes (em desenvolvimento)

```bash
npm test
```

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor em modo produção |
| `npm run dev` | Inicia o servidor com auto-reload (nodemon) |
| `npm run migrate` | Executa as migrations do banco de dados |
| `npm test` | Executa os testes |
| `npm run lint` | Verifica o código com ESLint |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Equipe OlimpiadaIDB** - *Desenvolvimento inicial*

---

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: suporte@olimpiadaidb.com
- 📱 WhatsApp: (XX) XXXXX-XXXX

---

## 🎯 Roadmap

- [x] Estrutura básica do projeto
- [x] Banco de dados completo
- [x] Sistema de autenticação
- [ ] CRUD completo de olimpíadas
- [ ] Sistema de inscrições
- [ ] Lançamento de resultados
- [ ] Geração de rankings
- [ ] Relatórios em PDF
- [ ] Dashboard administrativo
- [ ] Interface web (React)
- [ ] Notificações por email
- [ ] Certificados automáticos

---

**Desenvolvido com ❤️ pela equipe OlimpiadaIDB**
