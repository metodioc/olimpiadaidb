# 📋 Instruções para Testar o Sistema OlimpiadaIDB

## 🎯 Passo a Passo

### **PASSO 1: Criar Usuário Administrador**

1. Abra o arquivo `tests.http`
2. Vá até o **Teste 3 - REGISTRAR NOVO USUÁRIO**
3. Clique em **"Send Request"** no primeiro teste (Criar usuário ADMINISTRADOR)
4. Se retornar erro "Email já cadastrado", pule para o Passo 2

**Resposta esperada:**
```json
{
  "message": "Usuário cadastrado com sucesso",
  "usuario": {
    "id": 3,
    "nome": "Administrador Sistema",
    "email": "admin@escola.com"
  }
}
```

---

### **PASSO 2: Fazer Login com o Administrador**

1. Vá até o **Teste 2 - AUTENTICAÇÃO - LOGIN**
2. Clique em **"Send Request"** no primeiro teste (Login com administrador)
3. **COPIE O TOKEN** da resposta

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 3,
    "nome": "Administrador Sistema",
    "email": "admin@escola.com",
    "perfil": "Administrador",
    "nivel_acesso": 1
  }
}
```

**⚠️ IMPORTANTE:** Verifique se `nivel_acesso: 1` (Administrador tem nível 1)

---

### **PASSO 3: Atualizar o Token no arquivo**

1. No topo do arquivo `tests.http`, encontre a linha:
   ```
   @token = SEU_TOKEN_AQUI
   ```
2. **SUBSTITUA** `SEU_TOKEN_AQUI` pelo token que você copiou
3. Salve o arquivo (Ctrl+S)

**Exemplo:**
```
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjozLCJlbWFpbCI6ImFkbWluQGVzY29sYS5jb20iLCJub21lIjoiQWRtaW5pc3RyYWRvciBTaXN0ZW1hIiwicGVyZmlsIjoiQWRtaW5pc3RyYWRvciIsIm5pdmVsX2FjZXNzbyI6MSwicGVybWlzc2lvbnMiOltdfQ...
```

---

### **PASSO 4: Testar Criação de Olimpíada**

1. Vá até o **Teste 6 - CRIAR OLIMPÍADA**
2. Clique em **"Send Request"**
3. Deve retornar **201 Created**

**Resposta esperada:**
```json
{
  "message": "Olimpíada criada com sucesso",
  "olimpiada": {
    "id_olimpiada": 2,
    "nome_olimpiada": "Olimpíada Brasileira de Matemática",
    "abreviacao_olimpiada": "OBM",
    "ano": 2025,
    ...
  }
}
```

---

### **PASSO 5: Testar Outros Endpoints**

Agora você pode testar:

- ✅ **Teste 7**: Listar todas olimpíadas
- ✅ **Teste 14**: Listar inscrições
- ✅ **Teste 15**: Criar inscrição
- ✅ **Teste 23**: Listar resultados
- ✅ **Teste 24**: Criar resultado

---

## 🔴 Solução de Problemas

### Erro: "Acesso negado. Permissão insuficiente" (403)
**Causa:** Token antigo ou de usuário sem permissão  
**Solução:** Refazer PASSOS 2 e 3 (fazer login novamente e atualizar o token)

### Erro: "Token inválido ou expirado" (401)
**Causa:** Token expirou (validade de 8 horas)  
**Solução:** Refazer PASSOS 2 e 3

### Erro: "Email já cadastrado" ao criar admin
**Causa:** Administrador já foi criado antes  
**Solução:** Pular o PASSO 1 e ir direto para o PASSO 2 (login)

### Erro: "Dados inválidos" ao criar olimpíada (400)
**Causa:** Campos obrigatórios faltando ou formato inválido  
**Solução:** Verificar se o JSON está correto, datas no formato ISO (YYYY-MM-DD)

---

## 📧 Credenciais Padrão

### Administrador
- **Email:** admin@escola.com
- **Senha:** Admin@123
- **Nível:** 1 (acesso total)

### Professor
- **Email:** joao.silva@escola.com
- **Senha:** Senha123
- **Nível:** 2 (pode criar olimpíadas e inscrições)

---

## 🚀 Próximos Testes

Após conseguir criar uma olimpíada, teste o fluxo completo:

1. **Criar Olimpíada** (Teste 6)
2. **Criar Inscrições** (Teste 15-18)
3. **Lançar Resultados** (Teste 24-25)
4. **Calcular Rankings** (Teste 29)
5. **Ver Rankings** (Teste 31-33)
6. **Ver Medalhistas** (Teste 34)
