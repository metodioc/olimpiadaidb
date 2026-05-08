# Guia de Componentes - Material Design 3

## 📚 Índice

- [Introdução](#introdução)
- [Botões](#botões)
- [Cards](#cards)
- [Formulários](#formulários)
- [Layout](#layout)
- [Navegação](#navegação)
- [Feedback](#feedback)
- [Utilitários](#utilitários)

---

## Introdução

Este guia apresenta todos os componentes Material Design 3 disponíveis no sistema OlimpiadaIDB.

### Importação

Inclua os arquivos CSS em todas as páginas:

```html
<link rel="stylesheet" href="../css/material-theme.css">
<link rel="stylesheet" href="../css/material-components.css">
<link rel="stylesheet" href="../css/material-layout.css">
```

---

## Botões

### Filled Button (Principal)

```html
<button class="md-button md-button-filled">
  <span class="material-icons">add</span>
  Adicionar
</button>
```

### Outlined Button

```html
<button class="md-button md-button-outlined">
  <span class="material-icons">edit</span>
  Editar
</button>
```

### Text Button

```html
<button class="md-button md-button-text">
  Cancelar
</button>
```

### Tamanhos

```html
<!-- Pequeno -->
<button class="md-button md-button-filled md-button-small">Pequeno</button>

<!-- Padrão -->
<button class="md-button md-button-filled">Padrão</button>

<!-- Grande -->
<button class="md-button md-button-filled md-button-large">Grande</button>
```

### FAB (Floating Action Button)

```html
<button class="md-fab">
  <span class="material-icons">add</span>
</button>

<!-- FAB Estendido -->
<button class="md-fab md-fab-extended">
  <span class="material-icons">add</span>
  Novo
</button>
```

---

## Cards

### Card Elevated (Padrão)

```html
<div class="md-card md-card-elevated">
  <div class="md-card-header">
    <h2 class="md-card-title">Título do Card</h2>
    <p class="md-card-subtitle">Subtítulo opcional</p>
  </div>
  <div class="md-card-content">
    Conteúdo do card...
  </div>
  <div class="md-card-actions">
    <button class="md-button md-button-text">Cancelar</button>
    <button class="md-button md-button-filled">Salvar</button>
  </div>
</div>
```

### Card Filled

```html
<div class="md-card md-card-filled">
  <div class="md-card-content">
    Conteúdo...
  </div>
</div>
```

### Card Outlined

```html
<div class="md-card md-card-outlined">
  <div class="md-card-content">
    Conteúdo...
  </div>
</div>
```

---

## Formulários

### Text Field (Outlined)

```html
<div class="md-text-field">
  <input 
    type="text" 
    id="nome" 
    class="md-text-field-input" 
    placeholder=" "
    required
  >
  <label for="nome" class="md-text-field-label">Nome</label>
  <div class="md-text-field-supporting">Texto de ajuda</div>
</div>
```

### Text Field com Erro

```html
<div class="md-text-field md-text-field-error">
  <input 
    type="email" 
    id="email" 
    class="md-text-field-input" 
    placeholder=" "
  >
  <label for="email" class="md-text-field-label">Email</label>
  <div class="md-text-field-supporting">Email inválido</div>
</div>
```

### Select

```html
<select class="md-select">
  <option value="">Selecione...</option>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</select>
```

### Checkbox

```html
<label style="display: flex; align-items: center; gap: 8px;">
  <input type="checkbox" class="md-checkbox">
  <span class="md-label-large">Concordo com os termos</span>
</label>
```

### Radio Button

```html
<label style="display: flex; align-items: center; gap: 8px;">
  <input type="radio" name="opcao" class="md-radio">
  <span class="md-label-large">Opção 1</span>
</label>
```

### Switch

```html
<label class="md-switch">
  <input type="checkbox">
  <span class="md-switch-track">
    <span class="md-switch-thumb"></span>
  </span>
</label>
```

---

## Layout

### Grid System

```html
<!-- Grid de 2 colunas -->
<div class="md-grid md-grid-cols-2">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>

<!-- Grid de 4 colunas -->
<div class="md-grid md-grid-cols-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
  <div>Col 4</div>
</div>

<!-- Grid responsivo -->
<div class="md-grid md-grid-cols-3">
  <div>...</div>
  <div>...</div>
  <div>...</div>
</div>
```

### Container Principal

```html
<div class="md-layout">
  <aside class="md-navigation-drawer">
    <!-- Navegação lateral -->
  </aside>
  
  <div class="md-main-content">
    <header class="md-top-app-bar">
      <!-- Barra superior -->
    </header>
    
    <div class="md-content-wrapper">
      <!-- Conteúdo principal -->
    </div>
  </div>
</div>
```

---

## Navegação

### Navigation Drawer

```html
<aside class="md-navigation-drawer">
  <div class="md-drawer-header">
    <a href="/" class="md-drawer-logo">
      <div class="md-drawer-logo-icon">🏆</div>
      <span class="md-drawer-logo-text">App Name</span>
    </a>
  </div>
  
  <nav class="md-drawer-content">
    <div class="md-nav-section">
      <div class="md-nav-section-title">Menu</div>
      
      <a href="/" class="md-nav-item active">
        <span class="md-nav-icon">
          <span class="material-icons">dashboard</span>
        </span>
        <span class="md-nav-label">Dashboard</span>
      </a>
      
      <a href="/users" class="md-nav-item">
        <span class="md-nav-icon">
          <span class="material-icons">people</span>
        </span>
        <span class="md-nav-label">Usuários</span>
        <span class="md-nav-badge">
          <span class="md-badge">12</span>
        </span>
      </a>
    </div>
  </nav>
</aside>
```

### Top App Bar

```html
<header class="md-top-app-bar">
  <div class="md-top-app-bar-left">
    <h1 class="md-top-app-bar-title">Página</h1>
  </div>
  <div class="md-top-app-bar-right">
    <button class="md-icon-button">
      <span class="material-icons">notifications</span>
    </button>
    <button class="md-icon-button md-icon-button-tonal">
      <span class="material-icons">account_circle</span>
    </button>
  </div>
</header>
```

### Breadcrumb

```html
<nav class="md-breadcrumb">
  <a href="/" class="md-breadcrumb-item">Home</a>
  <span class="md-breadcrumb-separator">/</span>
  <a href="/users" class="md-breadcrumb-item">Usuários</a>
  <span class="md-breadcrumb-separator">/</span>
  <span class="md-breadcrumb-item active">Novo</span>
</nav>
```

### Tabs

```html
<div class="md-tabs">
  <button class="md-tab active">Tab 1</button>
  <button class="md-tab">Tab 2</button>
  <button class="md-tab">Tab 3</button>
</div>
```

---

## Feedback

### Dialog

```html
<div class="md-dialog-backdrop">
  <div class="md-dialog">
    <div class="md-dialog-header">
      <h2 class="md-dialog-title">Confirmar ação</h2>
    </div>
    <div class="md-dialog-content">
      <p class="md-body-medium">Tem certeza que deseja continuar?</p>
    </div>
    <div class="md-dialog-actions">
      <button class="md-button md-button-text">Cancelar</button>
      <button class="md-button md-button-filled">Confirmar</button>
    </div>
  </div>
</div>
```

### Snackbar (via JavaScript)

```javascript
showNotification('Operação realizada com sucesso!', 'success');
showNotification('Erro ao processar', 'error');
showNotification('Atenção necessária', 'warning');
showNotification('Informação importante', 'info');
```

### Progress Indicators

```html
<!-- Linear -->
<div class="md-progress-linear">
  <div class="md-progress-linear-bar" style="width: 60%;"></div>
</div>

<!-- Circular -->
<div class="md-progress-circular"></div>
```

---

## Data Display

### Tabela

```html
<div class="md-table">
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>João Silva</td>
        <td>joao@email.com</td>
        <td>
          <button class="md-icon-button">
            <span class="material-icons">edit</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Lista

```html
<div class="md-list">
  <div class="md-list-item">
    <div class="md-list-item-leading">
      <span class="material-icons">person</span>
    </div>
    <div class="md-list-item-content">
      <div class="md-list-item-title">Título</div>
      <div class="md-list-item-subtitle">Subtítulo</div>
    </div>
    <div class="md-list-item-trailing">
      <button class="md-icon-button">
        <span class="material-icons">chevron_right</span>
      </button>
    </div>
  </div>
</div>
```

### Chips

```html
<span class="md-chip md-chip-filled">Tag</span>
<span class="md-chip md-chip-outlined">Categoria</span>
<span class="md-chip md-chip-selected">Selecionado</span>
```

### Badges

```html
<div style="position: relative;">
  <button class="md-icon-button">
    <span class="material-icons">notifications</span>
  </button>
  <span class="md-badge" style="position: absolute; top: 0; right: 0;">5</span>
</div>
```

---

## Utilitários

### Classes de Tipografia

```html
<h1 class="md-display-large">Display Large</h1>
<h2 class="md-headline-medium">Headline Medium</h2>
<p class="md-body-large">Body Large</p>
<span class="md-label-small">Label Small</span>
```

### Classes de Espaçamento

```html
<!-- Padding -->
<div class="md-p-sm">Padding Small</div>
<div class="md-p-md">Padding Medium</div>
<div class="md-p-lg">Padding Large</div>

<!-- Margin -->
<div class="md-m-md">Margin Medium</div>
<div class="md-mb-lg">Margin Bottom Large</div>
<div class="md-mt-xl">Margin Top XL</div>
```

### Classes Flex

```html
<div class="md-flex md-items-center md-justify-between md-gap-md">
  <span>Item 1</span>
  <span>Item 2</span>
</div>
```

### Classes de Elevação

```html
<div class="md-elevation-1">Elevação 1</div>
<div class="md-elevation-3">Elevação 3</div>
<div class="md-elevation-5">Elevação 5</div>
```

### Classes de Cor

```html
<span class="md-primary-text">Texto Primário</span>
<span class="md-error-text">Texto de Erro</span>
<span class="md-success-text">Texto de Sucesso</span>
```

---

## Funções JavaScript (auth.js)

### Autenticação

```javascript
checkAuth();  // Verifica se está autenticado
getToken();   // Retorna o token
getUser();    // Retorna dados do usuário
```

### Requisições

```javascript
// GET
const data = await fetchAuth('/usuarios');

// POST
const result = await fetchAuth('/usuarios', {
  method: 'POST',
  body: JSON.stringify({ nome: 'João', email: 'joao@email.com' })
});

// PUT
await fetchAuth('/usuarios/1', {
  method: 'PUT',
  body: JSON.stringify({ nome: 'João Silva' })
});

// DELETE
await fetchAuth('/usuarios/1', { method: 'DELETE' });
```

### Notificações e Diálogos

```javascript
// Notificação
showNotification('Salvo com sucesso!', 'success');

// Dialog de confirmação
const confirmed = await confirmDialog(
  'Confirmar exclusão',
  'Tem certeza que deseja excluir este item?',
  'Excluir',
  'Cancelar'
);

if (confirmed) {
  // Usuário confirmou
}
```

### Formatação

```javascript
formatDate('2025-12-15');              // 15/12/2025
formatDate('2025-12-15', true);        // 15/12/2025 14:30
formatNumber(1234567);                 // 1.234.567
formatCurrency(1234.56);               // R$ 1.234,56
```

### Validação

```javascript
isValidEmail('teste@email.com');       // true
isValidCPF('123.456.789-00');         // true/false
```

### Máscaras

```javascript
maskCPF('12345678900');     // 123.456.789-00
maskPhone('11999887766');   // (11) 99988-7766
removeMask('(11) 99988-7766');  // 11999887766
```

### Exportação

```javascript
const dados = [
  { nome: 'João', idade: 25 },
  { nome: 'Maria', idade: 30 }
];

exportToCSV(dados, 'usuarios.csv');
```

---

## Exemplos Completos

### Formulário Completo

```html
<form class="md-card md-card-elevated">
  <div class="md-card-header">
    <h2 class="md-card-title">Novo Usuário</h2>
  </div>
  
  <div class="md-card-content">
    <div class="md-grid md-grid-cols-2">
      <div class="md-text-field">
        <input type="text" id="nome" class="md-text-field-input" placeholder=" " required>
        <label for="nome" class="md-text-field-label">Nome</label>
      </div>
      
      <div class="md-text-field">
        <input type="email" id="email" class="md-text-field-input" placeholder=" " required>
        <label for="email" class="md-text-field-label">Email</label>
      </div>
    </div>
    
    <div class="md-text-field">
      <select id="perfil" class="md-select">
        <option value="">Selecione...</option>
        <option value="1">Admin</option>
        <option value="2">Usuário</option>
      </select>
    </div>
  </div>
  
  <div class="md-card-actions">
    <button type="button" class="md-button md-button-text">Cancelar</button>
    <button type="submit" class="md-button md-button-filled">Salvar</button>
  </div>
</form>
```

### Card de Estatística

```html
<div class="md-card md-card-elevated">
  <div class="md-card-content">
    <div class="md-flex md-items-center md-gap-md">
      <div style="width: 48px; height: 48px; background-color: var(--md-primary-container); color: var(--md-on-primary-container); border-radius: var(--md-shape-corner-medium); display: flex; align-items: center; justify-content: center;">
        <span class="material-icons">people</span>
      </div>
      <div>
        <div class="md-body-small" style="color: var(--md-on-surface-variant);">Usuários</div>
        <div class="md-headline-small">1,234</div>
      </div>
    </div>
  </div>
</div>
```

---

Para mais informações sobre Material Design 3, consulte a [documentação oficial](https://m3.material.io/).
