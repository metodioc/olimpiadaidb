# Guia de Consultas SQL - OlimpiadaIDB

Este documento contém consultas SQL úteis para o sistema OlimpiadaIDB.

---

## 📊 RANKINGS

### 1. Ranking Geral de uma Olimpíada
```sql
SELECT 
    a.ra,
    p.nome AS aluno_nome,
    s.serie,
    t.turma,
    f.filial,
    r.pontuacao,
    r.classificacao,
    tm.tipoMedalha,
    tm.corHex
FROM tb_olimpiada_resultado r
INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
INNER JOIN tb_turma t ON a.idTurma = t.idTurma
INNER JOIN tb_serie s ON t.idSerie = s.idSerie
INNER JOIN tb_filial f ON s.idFilial = f.idFilial
LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE i.idOlimpiada = ? -- Substituir ? pelo ID da olimpíada
ORDER BY r.classificacao ASC;
```

### 2. Ranking por Série
```sql
SELECT 
    s.serie,
    p.nome AS aluno_nome,
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
WHERE i.idOlimpiada = ? AND s.idSerie = ?
ORDER BY r.pontuacao DESC;
```

### 3. Ranking por Filial
```sql
SELECT 
    f.filial,
    p.nome AS aluno_nome,
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
INNER JOIN tb_filial f ON s.idFilial = f.idFilial
LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE i.idOlimpiada = ? AND f.idFilial = ?
ORDER BY r.pontuacao DESC;
```

### 4. Top 10 Medalhistas de Todas as Olimpíadas
```sql
SELECT 
    p.nome,
    COUNT(r.idTipoMedalha) AS totalMedalhas,
    SUM(CASE WHEN tm.ordem = 1 THEN 1 ELSE 0 END) AS ouro,
    SUM(CASE WHEN tm.ordem = 2 THEN 1 ELSE 0 END) AS prata,
    SUM(CASE WHEN tm.ordem = 3 THEN 1 ELSE 0 END) AS bronze
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

### 5. Ranking de Medalhas por Filial
```sql
SELECT 
    f.filial,
    COUNT(r.idTipoMedalha) AS totalMedalhas,
    SUM(CASE WHEN tm.ordem = 1 THEN 1 ELSE 0 END) AS ouro,
    SUM(CASE WHEN tm.ordem = 2 THEN 1 ELSE 0 END) AS prata,
    SUM(CASE WHEN tm.ordem = 3 THEN 1 ELSE 0 END) AS bronze
FROM tb_olimpiada_resultado r
INNER JOIN tb_olimpiada_inscricao i ON r.idOlimpiadaInscricao = i.idOlimpiadaInscricao
INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
INNER JOIN tb_turma t ON a.idTurma = t.idTurma
INNER JOIN tb_serie s ON t.idSerie = s.idSerie
INNER JOIN tb_filial f ON s.idFilial = f.idFilial
INNER JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE tm.ordem <= 3
GROUP BY f.idFilial, f.filial
ORDER BY ouro DESC, prata DESC, bronze DESC;
```

---

## 🏆 OLIMPÍADAS

### 6. Listar Olimpíadas com Filtros
```sql
SELECT 
    o.idOlimpiada,
    o.nomeOlimpiada,
    o.abreviacaoOlimpiada,
    o.ano,
    o.status,
    o.dataAplicacao,
    u.nome_completo AS responsavel,
    COUNT(DISTINCT i.idAluno) AS totalInscritos
FROM tb_olimpiada o
INNER JOIN tb_usuario u ON o.idUsuarioResponsavel = u.id_usuario
LEFT JOIN tb_olimpiada_inscricao i ON o.idOlimpiada = i.idOlimpiada
WHERE o.ano = 2025 -- Filtro opcional
  AND o.status = 'inscricoes_abertas' -- Filtro opcional
GROUP BY o.idOlimpiada
ORDER BY o.dataAplicacao DESC;
```

### 7. Detalhes Completos de uma Olimpíada
```sql
SELECT 
    o.*,
    u.nome_completo AS responsavel_nome,
    u.email AS responsavel_email,
    COUNT(DISTINCT i.idAluno) AS totalInscritos,
    COUNT(DISTINCT r.idOlimpiadaResultado) AS totalResultados,
    COUNT(DISTINCT CASE WHEN r.idTipoMedalha IS NOT NULL THEN r.idOlimpiadaResultado END) AS totalMedalhas
FROM tb_olimpiada o
INNER JOIN tb_usuario u ON o.idUsuarioResponsavel = u.id_usuario
LEFT JOIN tb_olimpiada_inscricao i ON o.idOlimpiada = i.idOlimpiada
LEFT JOIN tb_olimpiada_resultado r ON i.idOlimpiadaInscricao = r.idOlimpiadaInscricao
WHERE o.idOlimpiada = ?
GROUP BY o.idOlimpiada;
```

### 8. Disciplinas de uma Olimpíada
```sql
SELECT 
    d.nomeDisciplina,
    d.abreviacaoDisciplina,
    od.principal,
    a.nomeArea
FROM tb_olimpiada_disciplina od
INNER JOIN tb_disciplina d ON od.idDisciplina = d.idDisciplina
INNER JOIN tb_area_conhecimento a ON d.idAreaConhecimento = a.idAreaConhecimento
WHERE od.idOlimpiada = ?
ORDER BY od.principal DESC, d.nomeDisciplina;
```

### 9. Filiais Participantes de uma Olimpíada
```sql
SELECT 
    f.filial,
    f.abFilial,
    COUNT(DISTINCT a.idAluno) AS totalAlunosInscritos
FROM tb_olimpiada_filial of
INNER JOIN tb_filial f ON of.idFilial = f.idFilial
LEFT JOIN tb_serie s ON f.idFilial = s.idFilial
LEFT JOIN tb_turma t ON s.idSerie = t.idSerie
LEFT JOIN tb_aluno a ON t.idTurma = a.idTurma
LEFT JOIN tb_olimpiada_inscricao i ON a.idAluno = i.idAluno AND i.idOlimpiada = of.idOlimpiada
WHERE of.idOlimpiada = ?
GROUP BY f.idFilial
ORDER BY f.filial;
```

---

## 📝 INSCRIÇÕES

### 10. Listar Inscritos em uma Olimpíada
```sql
SELECT 
    a.ra,
    p.nome AS aluno_nome,
    p.email,
    s.serie,
    t.turma,
    f.filial,
    i.dataInscricao,
    i.statusInscricao
FROM tb_olimpiada_inscricao i
INNER JOIN tb_aluno a ON i.idAluno = a.idAluno
INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
INNER JOIN tb_turma t ON a.idTurma = t.idTurma
INNER JOIN tb_serie s ON t.idSerie = s.idSerie
INNER JOIN tb_filial f ON s.idFilial = f.idFilial
WHERE i.idOlimpiada = ?
ORDER BY p.nome;
```

### 11. Inscrições de um Aluno Específico
```sql
SELECT 
    o.nomeOlimpiada,
    o.ano,
    o.dataAplicacao,
    i.statusInscricao,
    i.dataInscricao,
    r.pontuacao,
    r.classificacao,
    tm.tipoMedalha
FROM tb_olimpiada_inscricao i
INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
LEFT JOIN tb_olimpiada_resultado r ON i.idOlimpiadaInscricao = r.idOlimpiadaInscricao
LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE i.idAluno = ?
ORDER BY o.ano DESC, o.dataAplicacao DESC;
```

### 12. Alunos de uma Turma para Inscrição em Lote
```sql
SELECT 
    a.idAluno,
    a.ra,
    p.nome,
    p.email
FROM tb_aluno a
INNER JOIN tb_pessoa p ON a.idPessoa = p.idPessoa
WHERE a.idTurma = ?
  AND a.situacao = 'ativo'
  AND a.idAluno NOT IN (
    SELECT idAluno 
    FROM tb_olimpiada_inscricao 
    WHERE idOlimpiada = ?
  )
ORDER BY p.nome;
```

---

## 📈 ESTATÍSTICAS

### 13. Total de Participações por Ano
```sql
SELECT 
    o.ano,
    COUNT(DISTINCT i.idAluno) AS totalAlunos,
    COUNT(DISTINCT o.idOlimpiada) AS totalOlimpiadas,
    COUNT(DISTINCT CASE WHEN r.idTipoMedalha IS NOT NULL THEN i.idAluno END) AS totalMedalhistas
FROM tb_olimpiada o
LEFT JOIN tb_olimpiada_inscricao i ON o.idOlimpiada = i.idOlimpiada
LEFT JOIN tb_olimpiada_resultado r ON i.idOlimpiadaInscricao = r.idOlimpiadaInscricao
GROUP BY o.ano
ORDER BY o.ano DESC;
```

### 14. Desempenho de um Aluno por Disciplina
```sql
SELECT 
    a.nomeArea,
    d.nomeDisciplina,
    COUNT(r.idOlimpiadaResultado) AS totalParticipacoes,
    AVG(r.pontuacao) AS mediaPontuacao,
    COUNT(CASE WHEN tm.ordem <= 3 THEN 1 END) AS totalMedalhas
FROM tb_olimpiada_inscricao i
INNER JOIN tb_olimpiada o ON i.idOlimpiada = o.idOlimpiada
INNER JOIN tb_olimpiada_disciplina od ON o.idOlimpiada = od.idOlimpiada
INNER JOIN tb_disciplina d ON od.idDisciplina = d.idDisciplina
INNER JOIN tb_area_conhecimento a ON d.idAreaConhecimento = a.idAreaConhecimento
LEFT JOIN tb_olimpiada_resultado r ON i.idOlimpiadaInscricao = r.idOlimpiadaInscricao
LEFT JOIN tb_tipo_medalha tm ON r.idTipoMedalha = tm.idTipoMedalha
WHERE i.idAluno = ?
GROUP BY a.idAreaConhecimento, d.idDisciplina
ORDER BY totalMedalhas DESC, mediaPontuacao DESC;
```

### 15. Olimpíadas com Maior Participação
```sql
SELECT 
    o.nomeOlimpiada,
    o.ano,
    COUNT(DISTINCT i.idAluno) AS totalInscritos,
    COUNT(DISTINCT CASE WHEN i.statusInscricao = 'presente' THEN i.idAluno END) AS totalPresentes,
    ROUND(
        COUNT(DISTINCT CASE WHEN i.statusInscricao = 'presente' THEN i.idAluno END) * 100.0 / 
        COUNT(DISTINCT i.idAluno), 2
    ) AS percentualPresenca
FROM tb_olimpiada o
LEFT JOIN tb_olimpiada_inscricao i ON o.idOlimpiada = i.idOlimpiada
GROUP BY o.idOlimpiada
HAVING totalInscritos > 0
ORDER BY totalInscritos DESC
LIMIT 10;
```

---

## 🔍 CONSULTAS ADMINISTRATIVAS

### 16. Usuários por Perfil
```sql
SELECT 
    p.nome_perfil,
    COUNT(u.id_usuario) AS totalUsuarios,
    COUNT(CASE WHEN u.ativo = TRUE THEN 1 END) AS usuariosAtivos
FROM tb_perfil p
LEFT JOIN tb_usuario u ON p.id_perfil = u.id_perfil
GROUP BY p.id_perfil
ORDER BY p.nivel_acesso;
```

### 17. Log de Acessos Recentes
```sql
SELECT 
    u.nome_completo,
    u.email,
    p.nome_perfil,
    l.data_hora_acesso,
    l.ip_acesso,
    l.acao
FROM tb_log_acesso l
INNER JOIN tb_usuario u ON l.id_usuario = u.id_usuario
INNER JOIN tb_perfil p ON u.id_perfil = p.id_perfil
ORDER BY l.data_hora_acesso DESC
LIMIT 50;
```

### 18. Olimpíadas Pendentes de Correção
```sql
SELECT 
    o.idOlimpiada,
    o.nomeOlimpiada,
    o.dataAplicacao,
    o.dataCorrecao,
    u.nome_completo AS responsavel,
    COUNT(i.idOlimpiadaInscricao) AS totalInscritos,
    COUNT(r.idOlimpiadaResultado) AS totalCorrigidos
FROM tb_olimpiada o
INNER JOIN tb_usuario u ON o.idUsuarioResponsavel = u.id_usuario
LEFT JOIN tb_olimpiada_inscricao i ON o.idOlimpiada = i.idOlimpiada
LEFT JOIN tb_olimpiada_resultado r ON i.idOlimpiadaInscricao = r.idOlimpiadaInscricao
WHERE o.status IN ('realizada', 'corrigida')
  AND o.dataAplicacao < CURDATE()
GROUP BY o.idOlimpiada
HAVING totalInscritos > totalCorrigidos
ORDER BY o.dataAplicacao;
```

---

**Nota**: Substitua o `?` pelos valores reais ao executar as consultas.
