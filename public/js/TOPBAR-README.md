# 🎯 Topbar Compartilhado

Componente reutilizável de topbar para todas as páginas do sistema.

## 📦 Como Usar

### 1. Incluir os scripts necessários

Adicione no final do `<body>` da sua página HTML:

```html
<script src="../js/app.js"></script>
<script src="../js/topbar.js"></script>
```

### 2. Remover o HTML do topbar

Remova o HTML do topbar da sua página (se existir), pois ele será injetado automaticamente.

### 3. Inicializar o topbar

Adicione no seu script da página:

```javascript
// Verificar autenticação
checkAuth();

// Inicializar topbar com título da página
initTopbar('Título da Página');

// Resto do código da página...
```

## ✨ Exemplo Completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Olimpíadas - Olimpíada IDB</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <div class="app-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Conteúdo da sidebar -->
    </aside>

    <!-- Main Content (topbar será inserido aqui automaticamente) -->
    <main class="main-content">
      <!-- Topbar será injetado aqui -->
      
      <!-- Content -->
      <div class="content">
        <h2>Conteúdo da página</h2>
      </div>
    </main>
  </div>

  <script src="../js/app.js"></script>
  <script src="../js/topbar.js"></script>
  <script>
    // Verificar autenticação
    checkAuth();
    
    // Inicializar topbar
    initTopbar('Olimpíadas');
    
    // Código específico da página...
  </script>
</body>
</html>
```

## 🔧 Funções Disponíveis

### `initTopbar(pageTitle)`
Inicializa o topbar e define o título da página.

```javascript
initTopbar('Dashboard');
```

### `setPageTitle(title)`
Atualiza apenas o título da página (sem reinicializar o topbar).

```javascript
setPageTitle('Nova Olimpíada');
```

### `updateTopbarUserInfo()`
Atualiza as informações do usuário no topbar (nome, avatar, perfil).

```javascript
updateTopbarUserInfo();
```

## 📋 Estrutura do Topbar

O topbar gerado automaticamente tem a seguinte estrutura:

```html
<header class="topbar">
  <div class="topbar-left">
    <h1 class="page-title" id="pageTitle">Título da Página</h1>
  </div>
  <div class="topbar-right">
    <div class="user-menu">
      <div class="user-avatar" id="userAvatar">M</div>
      <div class="user-info">
        <div class="user-name" id="userName">Nome do Usuário</div>
        <div class="user-role" id="userRole">Perfil</div>
      </div>
    </div>
    <button class="btn btn-secondary btn-sm" onclick="logout()">Sair</button>
  </div>
</header>
```

## 🎨 Customização

O topbar usa as classes CSS existentes do sistema. Para customizar o estilo, edite o arquivo `public/css/styles.css`:

```css
.topbar {
  /* Seus estilos aqui */
}

.user-name {
  /* Estilo do nome do usuário */
}

.user-avatar {
  /* Estilo do avatar */
}
```

## 🔄 Atualização Automática

O topbar atualiza automaticamente:
- ✅ Nome do usuário (do localStorage)
- ✅ Avatar (primeira letra do nome)
- ✅ Perfil do usuário (Administrador, Professor, etc)
- ✅ Título da página

## ⚠️ Requisitos

- O elemento `<main class="main-content">` deve existir na página
- Os scripts `app.js` e `topbar.js` devem ser carregados nesta ordem
- O usuário deve estar autenticado (token no localStorage)

## 📝 Exemplo de Migração

### Antes:
```html
<main class="main-content">
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="page-title">Olimpíadas</h1>
    </div>
    <div class="topbar-right">
      <!-- código do topbar -->
    </div>
  </header>
  <div class="content">
    <!-- conteúdo -->
  </div>
</main>

<script src="../js/app.js"></script>
<script>
  checkAuth();
  const user = getUser();
  if (user) {
    document.getElementById('userName').textContent = user.nome;
  }
</script>
```

### Depois:
```html
<main class="main-content">
  <!-- Topbar será injetado aqui -->
  <div class="content">
    <!-- conteúdo -->
  </div>
</main>

<script src="../js/app.js"></script>
<script src="../js/topbar.js"></script>
<script>
  checkAuth();
  initTopbar('Olimpíadas');
</script>
```

## 🐛 Troubleshooting

### O topbar não aparece
- Verifique se o elemento `.main-content` existe
- Verifique se os scripts estão na ordem correta
- Abra o console e verifique erros

### O nome do usuário não aparece
- Verifique se há token no localStorage
- Execute `getUser()` no console para verificar os dados
- Verifique se o campo `nome` ou `email` existe no objeto user

### O topbar aparece duplicado
- Remova o HTML estático do topbar da página
- O componente só deve ser injetado via JavaScript
