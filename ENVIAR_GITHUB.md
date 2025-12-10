# 📤 Como Enviar para o GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `olimpiadaidb`
   - **Description**: `Sistema de Gestão de Olimpíadas Escolares - IDB`
   - **Visibility**: Public ou Private (sua escolha)
   - ⚠️ **NÃO** marque "Add a README file"
   - ⚠️ **NÃO** marque "Add .gitignore"
   - ⚠️ **NÃO** escolha licença ainda
3. Clique em **"Create repository"**

## Passo 2: Conectar e Enviar

Após criar o repositório, execute os comandos abaixo no terminal do VS Code:

### Opção 1: Se você usa HTTPS

```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu nome de usuário GitHub)
git remote add origin https://github.com/SEU_USUARIO/olimpiadaidb.git

# Renomear branch para main
git branch -M main

# Fazer push inicial
git push -u origin main
```

### Opção 2: Se você usa SSH

```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu nome de usuário GitHub)
git remote add origin git@github.com:SEU_USUARIO/olimpiadaidb.git

# Renomear branch para main
git branch -M main

# Fazer push inicial
git push -u origin main
```

## Passo 3: Verificar

Após executar os comandos, acesse:
`https://github.com/SEU_USUARIO/olimpiadaidb`

Você deve ver todos os arquivos do projeto!

## 🔄 Comandos Úteis para o Futuro

### Adicionar mudanças:
```bash
git add .
git commit -m "Descrição das alterações"
git push
```

### Ver status:
```bash
git status
```

### Ver histórico:
```bash
git log --oneline
```

### Atualizar do GitHub:
```bash
git pull
```

## ⚠️ Importante

- O arquivo `.env` **NÃO** será enviado (está no `.gitignore`)
- Isso é importante para segurança (senhas, tokens, etc)
- Use o `.env.example` como referência para outros desenvolvedores

## 🎉 Pronto!

Seu projeto agora está no GitHub e pronto para ser compartilhado!
