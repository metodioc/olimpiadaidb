/**
 * Componente Topbar Compartilhado
 * Carrega e gerencia o topbar em todas as páginas
 */

// ─── Ano Letivo Global ────────────────────────────────────────────────────────

/**
 * Retorna o ano letivo atualmente selecionado (persiste no localStorage).
 * Padrão: ano corrente.
 */
function getAnoLetivoSelecionado() {
  return parseInt(localStorage.getItem('anoLetivoSelecionado') || new Date().getFullYear());
}

/**
 * Define o ano letivo global e dispara o evento 'anoLetivoChanged'
 * para que cada página possa reagir.
 */
function setAnoLetivoSelecionado(ano) {
  localStorage.setItem('anoLetivoSelecionado', ano);
  // Atualizar visual do select no topbar (se existir)
  const sel = document.getElementById('anoLetivoSelect');
  if (sel) sel.value = ano;
  // Disparar evento global
  window.dispatchEvent(new CustomEvent('anoLetivoChanged', { detail: { anoLetivo: parseInt(ano) } }));
}

// ─── HTML do Topbar ───────────────────────────────────────────────────────────

function loadTopbar() {
  const topbarHTML = `
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="page-title" id="pageTitle">Dashboard</h1>
      </div>
      <div class="topbar-right">
        <div class="ano-letivo-selector" style="display:flex;align-items:center;gap:8px;margin-right:16px;">
          <label for="anoLetivoSelect" style="font-size:13px;color:var(--text-secondary,#666);white-space:nowrap;">📅 Ano Letivo:</label>
          <select id="anoLetivoSelect" class="form-select" style="width:90px;font-size:13px;padding:4px 8px;"
            onchange="setAnoLetivoSelecionado(this.value)">
            <option value="">...</option>
          </select>
        </div>
        <div class="user-menu">
          <div class="user-avatar" id="userAvatar">M</div>
          <div class="user-info">
            <div class="user-name" id="userName">Carregando...</div>
            <div class="user-role" id="userRole">Usuário</div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="logout()">Sair</button>
      </div>
    </header>
  `;
  return topbarHTML;
}

// ─── Atualizar usuário ────────────────────────────────────────────────────────
function updateTopbarUserInfo() {
  try {
    const user = getUser();
    
    if (!user) {
      console.warn('Usuário não encontrado no localStorage');
      const userNameElement = document.getElementById('userName');
      if (userNameElement) {
        userNameElement.textContent = 'Erro: Faça login';
        userNameElement.style.color = 'red';
      }
      return;
    }

    // Atualizar nome do usuário
    const displayName = user.nome || user.email || 'Usuário';
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = displayName;
    }

    // Atualizar avatar
    const userAvatarElement = document.getElementById('userAvatar');
    if (userAvatarElement) {
      userAvatarElement.textContent = displayName.charAt(0).toUpperCase();
    }

    // Atualizar perfil/role
    const nivelMap = {
      1: 'Administrador',
      2: 'Professor',
      3: 'Aluno',
      4: 'Responsável'
    };
    
    const userRoleElement = document.getElementById('userRole');
    if (userRoleElement) {
      userRoleElement.textContent = nivelMap[user.nivel_acesso] || 'Usuário';
    }

    console.log('Topbar atualizado com sucesso:', {
      nome: displayName,
      perfil: nivelMap[user.nivel_acesso]
    });

  } catch (error) {
    console.error('Erro ao atualizar topbar:', error);
  }
}

// ─── Título da página ─────────────────────────────────────────────────────────
function setPageTitle(title) {
  const pageTitleElement = document.getElementById('pageTitle');
  if (pageTitleElement) {
    pageTitleElement.textContent = title;
  }
  // Também atualiza o título do documento
  document.title = title + ' - Olimpíada IDB';
}

// ─── Carregar anos letivos no select ─────────────────────────────────────────
async function loadAnosLetivosTopbar() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('/api/anos-letivos', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return;

    const json = await response.json();
    const anos = (json.data || []).sort((a, b) => b.anoLetivo - a.anoLetivo);

    const sel = document.getElementById('anoLetivoSelect');
    if (!sel) return;

    const atual = getAnoLetivoSelecionado();

    // Se o ano salvo não existir na lista, usar o ano ativo ou o mais recente
    const anoAtivo = anos.find(a => a.status === 'ativo')?.anoLetivo
      || anos[0]?.anoLetivo
      || new Date().getFullYear();

    const anoEscolhido = anos.find(a => a.anoLetivo === atual) ? atual : anoAtivo;

    sel.innerHTML = anos.map(a =>
      `<option value="${a.anoLetivo}" ${a.anoLetivo === anoEscolhido ? 'selected' : ''}>${a.anoLetivo}</option>`
    ).join('');

    // Persistir escolha inicial
    localStorage.setItem('anoLetivoSelecionado', anoEscolhido);

  } catch (e) {
    console.warn('Não foi possível carregar anos letivos no topbar:', e.message);
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initTopbar(pageTitle) {
  // Encontrar elemento onde o topbar deve ser inserido
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    // Verificar se já não existe um topbar
    const existingTopbar = mainContent.querySelector('.topbar');
    if (!existingTopbar) {
      // Inserir topbar no início do main-content
      mainContent.insertAdjacentHTML('afterbegin', loadTopbar());
    }
    
    // Atualizar informações do usuário
    setTimeout(() => {
      updateTopbarUserInfo();
      if (pageTitle) {
        setPageTitle(pageTitle);
      }
      loadAnosLetivosTopbar();
    }, 100);
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
    });
  }
}
