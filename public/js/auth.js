/**
 * Funções de autenticação e helpers para API
 * OlimpiadaIDB - Material Design 3
 */

const API_BASE_URL = '/api';

/**
 * Verifica se o usuário está autenticado
 */
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../index.html';
    return false;
  }
  return true;
}

/**
 * Obtém o token de autenticação
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Obtém dados do usuário logado
 */
function getUser() {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      console.warn('Usuário não encontrado no localStorage');
      return null;
    }
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    return null;
  }
}

/**
 * Faz requisição autenticada para API
 * @param {string} endpoint - Endpoint da API (sem /api)
 * @param {object} options - Opções do fetch
 */
async function fetchAuth(endpoint, options = {}) {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
  
  // Se não autorizado, redirecionar para login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
}

/**
 * Mostra notificação (snackbar)
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 */
function showNotification(message, type = 'info') {
  // Remover snackbar anterior se existir
  const existing = document.querySelector('.md-snackbar');
  if (existing) {
    existing.remove();
  }

  // Criar snackbar
  const snackbar = document.createElement('div');
  snackbar.className = 'md-snackbar';
  
  // Ícone baseado no tipo
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  };

  snackbar.innerHTML = `
    <span class="material-icons" style="color: var(--md-${type});">${icons[type]}</span>
    <span class="md-snackbar-message">${message}</span>
  `;

  document.body.appendChild(snackbar);

  // Remover após 4 segundos
  setTimeout(() => {
    snackbar.style.opacity = '0';
    setTimeout(() => snackbar.remove(), 300);
  }, 4000);
}

/**
 * Confirma ação com dialog
 * @param {string} title - Título do dialog
 * @param {string} message - Mensagem
 * @param {string} confirmText - Texto do botão confirmar
 * @param {string} cancelText - Texto do botão cancelar
 */
function confirmDialog(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar') {
  return new Promise((resolve) => {
    // Criar backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'md-dialog-backdrop';

    // Criar dialog
    const dialog = document.createElement('div');
    dialog.className = 'md-dialog';
    dialog.innerHTML = `
      <div class="md-dialog-header">
        <h2 class="md-dialog-title">${title}</h2>
      </div>
      <div class="md-dialog-content">
        <p class="md-body-medium">${message}</p>
      </div>
      <div class="md-dialog-actions">
        <button class="md-button md-button-text" id="dialogCancel">${cancelText}</button>
        <button class="md-button md-button-filled" id="dialogConfirm">${confirmText}</button>
      </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // Event listeners
    document.getElementById('dialogCancel').addEventListener('click', () => {
      backdrop.remove();
      resolve(false);
    });

    document.getElementById('dialogConfirm').addEventListener('click', () => {
      backdrop.remove();
      resolve(true);
    });

    // Fechar ao clicar fora
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.remove();
        resolve(false);
      }
    });
  });
}

/**
 * Formata data para exibição
 * @param {string} dateString - Data em formato ISO
 * @param {boolean} includeTime - Incluir horário
 */
function formatDate(dateString, includeTime = false) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Formata número com separadores de milhar
 * @param {number} value - Valor a formatar
 */
function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata moeda brasileira
 * @param {number} value - Valor a formatar
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Debounce function
 * @param {function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Exporta dados para CSV
 * @param {array} data - Array de objetos
 * @param {string} filename - Nome do arquivo
 */
function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    showNotification('Nenhum dado para exportar', 'warning');
    return;
  }

  // Obter headers
  const headers = Object.keys(data[0]);
  
  // Criar CSV
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Escapar vírgulas e aspas
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    }).join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showNotification('Exportação concluída!', 'success');
}

/**
 * Valida email
 * @param {string} email - Email a validar
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a validar
 */
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Mascara de CPF
 * @param {string} value - Valor a formatar
 */
function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

/**
 * Mascara de telefone
 * @param {string} value - Valor a formatar
 */
function maskPhone(value) {
  value = value.replace(/\D/g, '');
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}

/**
 * Remove máscara de string
 * @param {string} value - Valor com máscara
 */
function removeMask(value) {
  return value.replace(/\D/g, '');
}

/**
 * Carrega e exibe o nome do usuário no topbar
 */
function loadUserName() {
  const user = getUser();
  const userNameElement = document.getElementById('userName');
  
  if (userNameElement && user) {
    userNameElement.textContent = user.nome || user.email || 'Usuário';
  }
}

/**
 * Inicializa elementos comuns da página
 * Deve ser chamado no DOMContentLoaded de cada página
 */
function initializePage() {
  // Verificar autenticação
  if (!checkAuth()) return;
  
  // Carregar nome do usuário
  loadUserName();
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
