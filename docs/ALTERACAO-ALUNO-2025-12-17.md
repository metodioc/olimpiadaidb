# Alteração da Sincronização de Alunos

## 📋 Resumo das Alterações

### 1. Query TOTVS Alterada
- **Antes:** `APPIDB.0007` (com parâmetros CODPERLET e DTBASE_D)
- **Agora:** `OLIMPIADAS005` (sem parâmetros)

### 2. Estrutura da tb_aluno Modificada

#### Campos REMOVIDOS:
- ❌ `idPessoa` (INT FK)
- ❌ `idTurma` (INT FK)

#### Campos ADICIONADOS:
- ✅ `codPessoa` (VARCHAR 20) - Relaciona com tb_pessoa.codPessoa
- ✅ `codTurma` (VARCHAR 20) - Relaciona com tb_turma.codTurma
- ✅ `codFilial` (VARCHAR 10) - Relaciona com tb_filial.codFilial
- ✅ `codSerie` (VARCHAR 10) - Relaciona com tb_serie.codSerie
- ✅ `anoLetivo` (INT) - Relaciona com tb_ano_letivo.anoLetivo

#### Campos MANTIDOS:
- ✓ `ra` (VARCHAR)
- ✓ `situacao` (VARCHAR)
- ✓ `tipo` (VARCHAR)
- ✓ `sistema` (VARCHAR)
- ✓ `idGrupoEscola` (INT)

### 3. Arquivos Modificados

#### `src/services/totvs.service.js`
```javascript
// Linha 39: Query alterada
async getAlunos(filters = {}) {
  const response = await axios.get(`${this.baseURL}/OLIMPIADAS005/0/S`, {
    headers: this.getAuthHeaders()
  });
  // SEM parâmetros
}

// Linhas 191-207: Mapeamento simplificado
mapTotvsToLocal(totvsAluno) {
  return {
    ra: totvsAluno.RA,
    situacao: totvsAluno.STATUS || 'Ativo',
    tipo: totvsAluno.TIPO || 'Regular',
    sistema: 'TOTVS',
    idGrupoEscola: null,
    codPessoa: totvsAluno.CODPESSOA,
    codTurma: totvsAluno.CODTURMA,
    codFilial: totvsAluno.CODFILIAL,
    codSerie: totvsAluno.CODSERIE,
    anoLetivo: totvsAluno.ANOLETIVO
  };
}
```

#### `src/services/sincronizacao.service.js`
```javascript
// Verificação de aluno existente (linhas 36-43)
SELECT a.idAluno, a.situacao, a.tipo, a.sistema, a.idGrupoEscola, 
       a.codPessoa, a.codTurma, a.codFilial, a.codSerie, a.anoLetivo
FROM tb_aluno a
WHERE a.ra = ? AND a.anoLetivo = ?

// INSERT simplificado (linhas 74-85)
INSERT INTO tb_aluno 
(ra, situacao, tipo, sistema, idGrupoEscola, codPessoa, codTurma, codFilial, codSerie, anoLetivo)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

// UPDATE simplificado (linhas 57-67)
UPDATE tb_aluno 
SET situacao = ?, tipo = ?, sistema = ?, idGrupoEscola = ?, 
    codPessoa = ?, codTurma = ?, codFilial = ?, codSerie = ?
WHERE ra = ? AND idAluno = ?
```

### 4. Migration SQL Criada

Arquivo: `database/migrations/006_alterar_tb_aluno.sql`

**O que faz:**
1. ✅ Limpa todos os dados existentes (TRUNCATE)
2. ✅ Remove constraints de FK antigas
3. ✅ Remove colunas idPessoa e idTurma
4. ✅ Adiciona novas colunas (codPessoa, codTurma, codFilial, codSerie, anoLetivo)
5. ✅ Cria índices para melhor performance
6. ✅ Mostra estrutura final da tabela

### 5. Script de Teste Criado

Arquivo: `tests/test-sincronizacao-aluno-nova.js`

**Como usar:**
```bash
node tests/test-sincronizacao-aluno-nova.js
```

## 🚀 Como Aplicar as Alterações

### Passo 1: Executar a Migration
```bash
mysql -u root -p olimpiadaidb < database/migrations/006_alterar_tb_aluno.sql
```

### Passo 2: Testar a Sincronização
```bash
node tests/test-sincronizacao-aluno-nova.js
```

## ⚠️ Observações Importantes

1. **DADOS SERÃO APAGADOS**: A migration executa TRUNCATE na tb_aluno
2. **Relacionamentos**: Agora usa códigos (VARCHAR) em vez de IDs (INT)
3. **TOTVS Query**: Certifique-se que OLIMPIADAS005 retorna os campos:
   - RA
   - STATUS ou SITUACAO
   - TIPO
   - CODPESSOA
   - CODTURMA
   - CODFILIAL
   - CODSERIE
   - ANOLETIVO

4. **Próximos Passos**: Você mencionou que precisará alterar tb_turma também

## 📊 Campos Esperados da Query OLIMPIADAS005

```json
{
  "RA": "12345",
  "STATUS": "Ativo",
  "TIPO": "Regular",
  "CODPESSOA": "P001",
  "CODTURMA": "T001",
  "CODFILIAL": "1",
  "CODSERIE": "S001",
  "ANOLETIVO": 2025
}
```

## ✅ Checklist

- [x] Query alterada para OLIMPIADAS005
- [x] Parâmetros removidos
- [x] Estrutura tb_aluno modificada
- [x] Serviço de sincronização atualizado
- [x] Migration SQL criada
- [x] Script de teste criado
- [ ] Migration executada no banco
- [ ] Teste de sincronização realizado
- [ ] Alterações em tb_turma (próximo passo)
