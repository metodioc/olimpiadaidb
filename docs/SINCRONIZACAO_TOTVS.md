# 🔄 Sincronização com TOTVS Educacional

Sistema de integração para importar alunos do TOTVS Educacional para o sistema de Olimpíadas IDB.

## 📋 Pré-requisitos

1. Credenciais de acesso à API do TOTVS Educacional
2. URL da API do TOTVS
3. Axios instalado (`npm install axios` - já incluído)

## ⚙️ Configuração

### 1. Configurar variáveis de ambiente

Edite o arquivo `.env` e adicione:

```env
# INTEGRAÇÃO TOTVS EDUCACIONAL
TOTVS_API_URL=https://api.totvs.com.br/educacional
TOTVS_USERNAME=seu_usuario_totvs
TOTVS_PASSWORD=sua_senha_totvs
TOTVS_AUTO_SYNC=false
TOTVS_SYNC_INTERVAL=24
```

### 2. Instalar dependência (se necessário)

```bash
npm install axios
```

## 🚀 Como Usar

### Opção 1: Interface Web (Recomendado)

1. Acesse o sistema como **Administrador**
2. Menu lateral → **Sincronização TOTVS**
3. Escolha as opções:
   - **Sincronização Completa**: Importa todos os alunos
   - **Sincronização Incremental**: Importa apenas alterações recentes
4. Selecione filial e ano letivo (opcional para filtrar)
5. Clique em **Sincronizar**

### Opção 2: API REST

#### Verificar conexão com TOTVS

```bash
GET /api/sincronizacao/verificar-conexao
Authorization: Bearer {token}
```

Resposta:
```json
{
  "success": true,
  "message": "Conexão com TOTVS estabelecida",
  "conectado": true
}
```

#### Sincronização completa

```bash
POST /api/sincronizacao/sincronizar
Authorization: Bearer {token}
Content-Type: application/json

{
  "idFilial": 1,        // opcional
  "idAnoLetivo": 2025   // opcional
}
```

Resposta:
```json
{
  "success": true,
  "message": "Sincronização concluída",
  "data": {
    "total": 3250,
    "inseridos": 120,
    "atualizados": 3130,
    "erros": [],
    "detalhes": [...]
  }
}
```

#### Sincronização incremental

```bash
POST /api/sincronizacao/sincronizar/incremental
Authorization: Bearer {token}
Content-Type: application/json

{
  "dataUltimaSync": "2025-12-10T00:00:00Z"  // opcional
}
```

## 📊 Mapeamento de Dados

### Estrutura do TOTVS → Sistema Local

```javascript
{
  // Aluno
  ra: totvsAluno.ra || totvsAluno.matricula,
  situacao: totvsAluno.situacao || 'Matriculado',
  tipo: totvsAluno.tipo || 'regular',
  sistema: 'TOTVS',
  
  // Pessoa
  pessoa: {
    codPessoa: totvsAluno.codPessoa || totvsAluno.ra,
    nome: totvsAluno.nome,
    email: totvsAluno.email,
    dtnasc: totvsAluno.dataNascimento,
    imgUrl: totvsAluno.foto
  },
  
  // Referências
  codigoTurma: totvsAluno.codigoTurma,
  codigoFilial: totvsAluno.codigoFilial,
  anoLetivo: totvsAluno.anoLetivo
}
```

## 🔧 Adaptação para sua API TOTVS

O serviço foi criado de forma genérica. **Você precisa adaptar**:

### 1. Endpoints da API

Edite `src/services/totvs.service.js`:

```javascript
// Autenticação
async authenticate() {
  const response = await axios.post(`${this.baseURL}/auth/login`, {
    username: this.username,
    password: this.password
  });
  // Ajuste conforme sua API retorna o token
}

// Buscar alunos
async getAlunos(filters) {
  const response = await axios.get(`${this.baseURL}/alunos`, {
    headers: { 'Authorization': `Bearer ${this.token}` },
    params: filters
  });
  // Ajuste conforme sua API retorna os dados
}
```

### 2. Mapeamento de Campos

Edite `mapTotvsToLocal()` conforme os campos da sua API:

```javascript
mapTotvsToLocal(totvsAluno) {
  return {
    // Ajuste os campos conforme o retorno da sua API
    ra: totvsAluno.CAMPO_RA_NO_TOTVS,
    situacao: totvsAluno.CAMPO_SITUACAO,
    // ... outros campos
  };
}
```

## 🔄 Processo de Sincronização

1. **Autenticação**: Sistema autentica no TOTVS
2. **Busca**: Obtém lista de alunos do TOTVS
3. **Mapeamento**: Converte dados para formato local
4. **Processamento**:
   - Cria/atualiza registro de pessoa (tb_pessoa)
   - Busca idTurma pelo código da turma
   - Verifica se aluno já existe (por RA)
   - **Se existe**: Atualiza dados
   - **Se não existe**: Insere novo aluno
5. **Resultado**: Retorna estatísticas da sincronização

## ⚠️ Observações Importantes

### Pré-requisitos no Banco de Dados

Antes de sincronizar alunos, certifique-se que existem:

1. ✅ **Filiais** cadastradas (tb_filial)
2. ✅ **Anos Letivos** cadastrados (tb_ano_letivo)
3. ✅ **Séries** cadastradas (tb_serie)
4. ✅ **Turmas** cadastradas (tb_turma)

O sistema busca a turma pelo `codTurma` e `anoLetivo`. Se a turma não existir, o aluno **não será importado**.

### Campos Obrigatórios

- **RA**: Identificador único do aluno
- **Nome**: Nome completo
- **Código da Turma**: Para vincular o aluno
- **Ano Letivo**: Para identificar a turma correta

### Situações de Aluno

O sistema respeita as situações do TOTVS:
- `Matriculado`: Aluno ativo
- `Cancelado`: Matrícula cancelada
- `Transferido`: Aluno transferido

## 📝 Logs e Monitoramento

Durante a sincronização, o sistema gera logs no console:

```
🔄 Iniciando sincronização com TOTVS Educacional...
📥 3250 alunos encontrados no TOTVS
✅ Sincronização concluída:
   📝 120 inseridos
   🔄 3130 atualizados
   ❌ 0 erros
```

## 🐛 Troubleshooting

### Erro: "Falha na autenticação com TOTVS"
- Verifique TOTVS_USERNAME e TOTVS_PASSWORD no .env
- Confirme se a URL da API está correta

### Erro: "Turma não encontrada"
- Sincronize turmas antes dos alunos
- Verifique se o código da turma no TOTVS corresponde ao `codTurma` no banco

### Alunos não aparecem nas inscrições
- Verifique se a situação é "Matriculado"
- Confirme se o ano letivo da turma está "ativo"

## 🔐 Segurança

- ✅ Apenas **Administradores** podem executar sincronização
- ✅ Credenciais TOTVS armazenadas em variáveis de ambiente
- ✅ Token de autenticação com renovação automática
- ✅ Transações de banco para garantir integridade

## 📞 Suporte

Para dúvidas sobre:
- **API do TOTVS**: Contate o suporte TOTVS
- **Sistema de Olimpíadas**: Abra uma issue no GitHub

---

**Próximos Passos**:
1. Configure as credenciais no `.env`
2. Adapte o mapeamento de campos
3. Teste a conexão
4. Execute a primeira sincronização completa
5. Configure sincronizações incrementais periódicas
