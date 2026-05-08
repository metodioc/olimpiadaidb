const fs = require('fs');
const path = require('path');

// Pages to migrate with their titles
const pages = [
  { file: 'olimpiadas.html', title: 'Olimpíadas' },
  { file: 'inscricoes.html', title: 'Inscrições' },
  { file: 'alunos.html', title: 'Alunos' },
  { file: 'turmas.html', title: 'Turmas' },
  { file: 'series.html', title: 'Séries' },
  { file: 'filiais.html', title: 'Filiais' },
  { file: 'usuarios.html', title: 'Usuários' },
  { file: 'locais-aplicacao.html', title: 'Locais de Aplicação' },
  { file: 'tipos-pagamento.html', title: 'Tipos de Pagamento' },
  { file: 'tipos-correcao.html', title: 'Tipos de Correção' },
  { file: 'anos-letivos.html', title: 'Anos Letivos' },
  { file: 'medalhistas.html', title: 'Medalhistas' },
  { file: 'olimpiada-form.html', title: 'Formulário de Olimpíada' },
  { file: 'usuario-form.html', title: 'Formulário de Usuário' },
  { file: 'turma-form.html', title: 'Formulário de Turma' },
  { file: 'serie-form.html', title: 'Formulário de Série' },
  { file: 'filial-form.html', title: 'Formulário de Filial' },
  { file: 'tipo-correcao-form.html', title: 'Formulário de Tipo de Correção' }
];

const pagesDir = path.join(__dirname, '..', 'public', 'pages');

// Regex to find topbar HTML block
const topbarRegex = /<header class="topbar">[\s\S]*?<\/header>/;

// Function to migrate a page
function migratePage(pageInfo) {
  const filePath = path.join(pagesDir, pageInfo.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${pageInfo.file}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already migrated
  if (content.includes('topbar.js')) {
    console.log(`⏭️  Already migrated: ${pageInfo.file}`);
    return false;
  }
  
  // Remove topbar HTML
  if (topbarRegex.test(content)) {
    content = content.replace(topbarRegex, '<!-- Topbar will be injected by topbar.js -->');
    console.log(`✅ Removed topbar HTML from ${pageInfo.file}`);
  } else {
    console.log(`⚠️  No topbar found in ${pageInfo.file}`);
  }
  
  // Add topbar.js script before app.js
  if (!content.includes('topbar.js')) {
    content = content.replace(
      /<script src="\.\.\/js\/app\.js"><\/script>/,
      '<script src="../js/topbar.js"></script>\n  <script src="../js/app.js"></script>'
    );
    console.log(`✅ Added topbar.js script to ${pageInfo.file}`);
  }
  
  // Find the script section and add initTopbar
  const scriptMatch = content.match(/<script>\s*checkAuth\(\);/);
  if (scriptMatch) {
    content = content.replace(
      /(<script>\s*checkAuth\(\);)/,
      `$1\n    initTopbar('${pageInfo.title}');`
    );
    console.log(`✅ Added initTopbar('${pageInfo.title}') to ${pageInfo.file}`);
  } else {
    console.log(`⚠️  Could not find script section in ${pageInfo.file}`);
  }
  
  // Remove duplicate user info update code (if exists)
  const userUpdateRegex = /\/\/ Atualizar info do usuário[\s\S]*?userRoleElement\.textContent = .*?;/;
  if (userUpdateRegex.test(content)) {
    content = content.replace(userUpdateRegex, '');
    console.log(`✅ Removed duplicate user update code from ${pageInfo.file}`);
  }
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Successfully migrated ${pageInfo.file}\n`);
  return true;
}

// Migrate all pages
console.log('Starting topbar migration...\n');
let migrated = 0;
let skipped = 0;
let errors = 0;

pages.forEach(page => {
  try {
    const result = migratePage(page);
    if (result) {
      migrated++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.error(`❌ Error migrating ${page.file}:`, error.message);
    errors++;
  }
});

console.log('\n=== Migration Summary ===');
console.log(`✅ Migrated: ${migrated} pages`);
console.log(`⏭️  Skipped: ${skipped} pages`);
console.log(`❌ Errors: ${errors} pages`);
console.log('=========================\n');
