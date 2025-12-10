# Diagrama de Relacionamento - OlimpiadaIDB

## Estrutura Geral do Banco de Dados

O banco de dados está organizado em 5 módulos principais:

### 1️⃣ MÓDULO DE CONTROLE DE ACESSO

```
tb_perfil
├── id_perfil (PK)
├── nome_perfil
├── descricao
├── nivel_acesso (1=Admin, 2=Professor, 3=Aluno, 4=Responsável)
└── ativo

tb_usuario
├── id_usuario (PK)
├── id_perfil (FK → tb_perfil)
├── nome_completo
├── email
├── senha (hash bcrypt)
├── cpf
└── telefone

tb_permissao
├── id_permissao (PK)
├── nome_permissao
├── modulo
└── acao

tb_perfil_permissao
├── id_perfil_permissao (PK)
├── id_perfil (FK → tb_perfil)
└── id_permissao (FK → tb_permissao)

tb_log_acesso
├── id_log (PK)
├── id_usuario (FK → tb_usuario)
├── data_hora_acesso
├── ip_acesso
└── acao
```

---

### 2️⃣ MÓDULO DE ESTRUTURA ESCOLAR

```
tb_ano_letivo
├── idAnoLetivo (PK)
├── anoLetivo
└── status (ativo/inativo)

tb_filial
├── idFilial (PK)
├── codFilial
├── filial
└── abFilial

tb_grupo_escola
├── idGrupoEscola (PK)
├── grupoEscola
└── abGrupoEscola

tb_serie
├── idSerie (PK)
├── codSerie
├── serie
├── abSerie
└── idFilial (FK → tb_filial)

tb_turma
├── idTurma (PK)
├── codTurma
├── turma
├── turno
├── idSerie (FK → tb_serie)
└── idAnoLetivo (FK → tb_ano_letivo)

tb_pessoa
├── idPessoa (PK)
├── codPessoa
├── nome
├── email
├── dtnasc
└── imgUrl

tb_aluno
├── idAluno (PK)
├── ra
├── situacao
├── tipo
├── sistema
├── idGrupoEscola (FK → tb_grupo_escola)
├── idPessoa (FK → tb_pessoa)
└── idTurma (FK → tb_turma)
```

---

### 3️⃣ MÓDULO DE OLIMPÍADAS

```
tb_olimpiada
├── idOlimpiada (PK)
├── nomeOlimpiada
├── abreviacaoOlimpiada
├── ano
├── idUsuarioResponsavel (FK → tb_usuario)
├── tipoAplicacao (online/escola/outro_local)
├── tipoCusto (pago_escola/gratuito/pago_aluno)
├── tipoCorrecao (portal/escola/professor)
├── dataLimiteInscricao
├── dataAplicacao
├── dataCorrecao
└── status

tb_olimpiada_filial (Relacionamento N:N)
├── idOlimpiadaFilial (PK)
├── idOlimpiada (FK → tb_olimpiada)
└── idFilial (FK → tb_filial)

tb_olimpiada_inscricao
├── idOlimpiadaInscricao (PK)
├── idOlimpiada (FK → tb_olimpiada)
├── idAluno (FK → tb_aluno)
├── dataInscricao
└── statusInscricao

tb_tipo_medalha
├── idTipoMedalha (PK)
├── tipoMedalha (Ouro/Prata/Bronze/etc)
├── descricao
├── ordem
└── corHex

tb_olimpiada_resultado
├── idOlimpiadaResultado (PK)
├── idOlimpiadaInscricao (FK → tb_olimpiada_inscricao)
├── idTipoMedalha (FK → tb_tipo_medalha)
├── pontuacao
├── classificacao
└── observacoes
```

---

### 4️⃣ MÓDULO DE DISCIPLINAS

```
tb_area_conhecimento
├── idAreaConhecimento (PK)
├── nomeArea
└── descricao

tb_disciplina
├── idDisciplina (PK)
├── nomeDisciplina
├── abreviacaoDisciplina
├── idAreaConhecimento (FK → tb_area_conhecimento)
└── descricao

tb_olimpiada_disciplina (Relacionamento N:N)
├── idOlimpiadaDisciplina (PK)
├── idOlimpiada (FK → tb_olimpiada)
├── idDisciplina (FK → tb_disciplina)
└── principal (boolean)
```

---

### 5️⃣ MÓDULO DE DADOS PESSOAIS

```
tb_pessoa_fone
├── idPessoaFone (PK)
├── idPessoa (FK → tb_pessoa)
├── seq
├── info
└── fone

tb_pessoa_image
├── idPessoaImage (PK)
├── idPessoa (FK → tb_pessoa)
└── url
```

---

## Fluxo de Relacionamentos Principais

### Criação de uma Olimpíada
```
1. tb_usuario (responsável) → cria → tb_olimpiada
2. tb_olimpiada → vincula → tb_olimpiada_filial → tb_filial
3. tb_olimpiada → vincula → tb_olimpiada_disciplina → tb_disciplina
```

### Inscrição de Alunos
```
1. tb_aluno → inscreve-se → tb_olimpiada_inscricao → tb_olimpiada
2. Pode ser feito:
   - Individualmente
   - Por turma inteira
   - Por série inteira
   - Por filial inteira
```

### Registro de Resultados
```
1. tb_olimpiada_inscricao → gera → tb_olimpiada_resultado
2. tb_olimpiada_resultado → pode ter → tb_tipo_medalha
3. Rankings são gerados via queries dinâmicas
```

---

## Índices e Otimizações

### Principais Índices Criados:
- Todos os campos de chave estrangeira (FK)
- Email em `tb_usuario` e `tb_pessoa`
- RA em `tb_aluno`
- Status em `tb_olimpiada`
- Classificação em `tb_olimpiada_resultado`
- Compostos: (idTurma, idPessoa) em `tb_aluno`
- Compostos: (idSerie, idAnoLetivo) em `tb_turma`

---

## Constraints e Regras

### Unique Keys:
- Email em usuários
- CPF em usuários
- RA em alunos
- Combinação (olimpiada, aluno) em inscrições
- Combinação (olimpiada, filial) em vinculações

### Foreign Keys com CASCADE:
- Exclusão de perfil → remove vinculações de permissões
- Exclusão de olimpíada → remove inscrições e resultados
- Exclusão de pessoa → remove fones e imagens

---

## Total de Tabelas: 23

- Controle de Acesso: 5
- Estrutura Escolar: 7
- Dados Pessoais: 2
- Olimpíadas: 5
- Disciplinas: 3
- Total de Relacionamentos N:N: 3
