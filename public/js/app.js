// Configuração da API
const API_URL = 'http://localhost:5101/api';

// Verificar autenticação
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../index.html';
    return null;
  }
  return token;
}

// Obter dados do usuário
function getUser() {
  const userStr = localStorage.getItem('usuario');
  return userStr ? JSON.parse(userStr) : null;
}

// Fazer logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/index.html';
}

// Requisição autenticada
async function fetchAuth(endpoint, options = {}) {
  const token = checkAuth();
  if (!token) return;

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

  try {
    const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
    
    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro do servidor:', error);
      if (error.details && Array.isArray(error.details)) {
        console.error('Detalhes dos erros:', error.details);
        error.details.forEach((detail, index) => {
          console.error(`Erro ${index + 1}:`, detail);
        });
      }
      throw new Error(error.message || error.error || JSON.stringify(error.details) || 'Erro na requisição');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Formatar data brasileira
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Formatar data e hora brasileira
function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}

// Mostrar notificação
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;
  
  const container = document.getElementById('notificationContainer') || createNotificationContainer();
  container.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notificationContainer';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
  document.body.appendChild(container);
  return container;
}

// Adicionar estilos de notificação
const style = document.createElement('style');
style.textContent = `
  .notification {
    min-width: 300px;
    padding: 16px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
  }
  
  .notification-success {
    background: #4CAF50;
    color: white;
  }
  
  .notification-error {
    background: #F44336;
    color: white;
  }
  
  .notification-warning {
    background: #FF9800;
    color: white;
  }
  
  .notification-info {
    background: #2196F3;
    color: white;
  }
  
  .notification button {
    background: none;
    border: none;
    color: inherit;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    line-height: 1;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Confirmar ação
function confirmAction(message) {
  return confirm(message);
}

// Debounce para search
function debounce(func, wait) {
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

// Formatar número
function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num);
}

// Validar CPF
function validarCPF(cpf) {
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

// Mascaras
function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

function maskCEP(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}
