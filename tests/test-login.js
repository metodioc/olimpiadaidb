/**
 * Script para testar login e verificar estrutura de dados
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5101/api';

async function testLogin() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║              TESTE DE LOGIN - OlimpiadaIDB              ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    // Tentar login com usuário padrão
    console.log('🔐 Tentando login com admin@olimpiadaidb.com...\n');

    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@olimpiadaidb.com',
      senha: 'admin123'
    });

    console.log('✅ Login bem-sucedido!\n');
    console.log('📦 Estrutura da resposta:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n📝 Dados do usuário que serão salvos no localStorage:');
    console.log(JSON.stringify(response.data.user || response.data.usuario, null, 2));

    console.log('\n🔑 Token gerado:', response.data.token ? 'Sim' : 'Não');

  } catch (error) {
    console.error('\n❌ Erro no login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testLogin();
