const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'user_olimpiada',
    password: 'IDBc@mq1',
    database: 'olimpiadaidb',
    multipleStatements: true
  });

  try {
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '008_criar_tipo_correcao.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executando migração 008_criar_tipo_correcao.sql...');
    await connection.query(sql);
    console.log('✅ Migração executada com sucesso!');
    
    // Verificar registros inseridos
    const [rows] = await connection.query('SELECT * FROM tb_tipo_correcao');
    console.log(`\n📋 Total de tipos de correção cadastrados: ${rows.length}`);
    console.log('\nTipos cadastrados:');
    rows.forEach(tipo => {
      console.log(`  - ${tipo.descricao} (${tipo.ativo === 'S' ? 'Ativo' : 'Inativo'})`);
    });
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
