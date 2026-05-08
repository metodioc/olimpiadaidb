/**
 * Script de teste para login com usuário específico
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5101/api';

async function testLoginMetodioc() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║         TESTE DE LOGIN - metodioc@gmail.com             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    console.log('🔐 Tentando login...');
    console.log('   Email: metodioc@gmail.com');
    console.log('   Senha: IDBc@mq1\n');

    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'metodioc@gmail.com',
      senha: 'IDBc@mq1'
    });

    console.log('✅ Login bem-sucedido!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📦 RESPOSTA COMPLETA DO SERVIDOR:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📝 DADOS QUE SERÃO SALVOS NO LOCALSTORAGE:');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const userData = response.data.usuario || response.data.user;
    console.log('Chave do objeto:', response.data.usuario ? 'usuario' : 'user');
    console.log('\nDados do usuário:');
    console.log(JSON.stringify(userData, null, 2));

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🔍 VERIFICAÇÃO DOS CAMPOS:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✓ Token presente:', response.data.token ? 'SIM' : 'NÃO');
    console.log('✓ Campo nome:', userData?.nome || 'NÃO ENCONTRADO');
    console.log('✓ Campo email:', userData?.email || 'NÃO ENCONTRADO');
    console.log('✓ Campo nivel_acesso:', userData?.nivel_acesso || 'NÃO ENCONTRADO');
    console.log('✓ Campo perfil:', userData?.perfil || 'NÃO ENCONTRADO');

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('💾 SIMULAÇÃO DO LOCALSTORAGE:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('localStorage.setItem("token", "' + response.data.token.substring(0, 50) + '...")');
    console.log('localStorage.setItem("user", \'' + JSON.stringify(userData) + '\')');

    console.log('\n✅ Teste concluído com sucesso!\n');

  } catch (error) {
    console.error('\n❌ ERRO NO LOGIN!\n');
    if (error.response) {
      console.error('Status HTTP:', error.response.status);
      console.error('Mensagem:', error.response.data);
    } else if (error.request) {
      console.error('Servidor não respondeu');
      console.error('Verifique se o servidor está rodando em:', API_URL);
    } else {
      console.error('Erro:', error.message);
    }
    process.exit(1);
  }
}

testLoginMetodioc();
