const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');

/**
 * Script para executar migrations do banco de dados
 */
const runMigrations = async () => {
  const migrationsPath = path.join(__dirname, '../../database/migrations');
  
  try {
    console.log('🚀 Iniciando execução das migrations...\n');
    
    // Listar arquivos SQL na pasta migrations
    const files = await fs.readdir(migrationsPath);
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordena alfabeticamente (001, 002, 003...)
    
    if (sqlFiles.length === 0) {
      console.log('⚠️  Nenhum arquivo de migration encontrado.');
      return;
    }
    
    console.log(`📁 Encontrados ${sqlFiles.length} arquivo(s) de migration:\n`);
    
    // Executar cada migration
    for (const file of sqlFiles) {
      if (file === 'README.md') continue;
      
      const filePath = path.join(migrationsPath, file);
      
      try {
        console.log(`⏳ Executando: ${file}...`);
        
        // Ler conteúdo do arquivo
        const sql = await fs.readFile(filePath, 'utf8');
        
        // Dividir em statements individuais (separados por ;)
        const statements = sql
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        // Executar cada statement
        for (const statement of statements) {
          if (statement) {
            await pool.query(statement);
          }
        }
        
        console.log(`✅ Concluído: ${file}\n`);
        
      } catch (error) {
        console.error(`❌ Erro ao executar ${file}:`);
        console.error(error.message);
        throw error;
      }
    }
    
    console.log('=' .repeat(50));
    console.log('🎉 Todas as migrations foram executadas com sucesso!');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('\n❌ Erro durante execução das migrations:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
