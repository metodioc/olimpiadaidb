require('dotenv').config();
const axios = require('axios');

// Teste de autenticação TOTVS
const username = process.env.TOTVS_USERNAME;
const password = process.env.TOTVS_PASSWORD;
const baseURL = process.env.TOTVS_API_URL;

console.log('🔐 Testando autenticação TOTVS...\n');
console.log('Username:', username);
console.log('Password:', password ? '***' + password.slice(-4) : 'NÃO DEFINIDA');
console.log('URL:', baseURL);
console.log('');

// Criar token Base64
const authToken = Buffer.from(`${username}:${password}`).toString('base64');
console.log('Token Base64:', authToken);
console.log('');

// Fazer requisição de teste
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

const parameters = `CODPERLET=${year};DTBASE_D=${year}-${month}-${day}T23:59:00`;

console.log('Parâmetros:', parameters);
console.log('');
console.log('Fazendo requisição...\n');

axios.get(`${baseURL}/APPIDB.0007/0/S`, {
  headers: {
    'Authorization': `Basic ${authToken}`,
    'Content-Type': 'application/json'
  },
  params: {
    parameters
  }
})
.then(response => {
  console.log('✅ SUCESSO!');
  console.log('Status:', response.status);
  console.log('Total de alunos:', response.data.length);
  console.log('Primeiro aluno:', response.data[0]);
})
.catch(error => {
  console.log('❌ ERRO!');
  console.log('Status:', error.response?.status);
  console.log('Mensagem:', error.response?.data?.message || error.message);
  console.log('Detalhes:', error.response?.data);
});
