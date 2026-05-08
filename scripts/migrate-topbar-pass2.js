const fs = require('fs');
const path = require('path');

// Pages that still need topbar.js import
const pages = [
  'filiais.html',
  'medalhistas.html',
  'olimpiada-form.html',
  'turma-form.html',
  'serie-form.html',
  'filial-form.html',
  'tipo-correcao-form.html',
  'tipos-correcao.html'
];

const pagesDir = path.join(__dirname, '..', 'public', 'pages');

pages.forEach(pageFile => {
  const filePath = path.join(pagesDir, pageFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${pageFile}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has topbar.js
  if (content.includes('topbar.js')) {
    console.log(`⏭️  Already has topbar.js: ${pageFile}`);
    return;
  }
  
  // Add topbar.js before app.js
  content = content.replace(
    /<script src="\.\.\/js\/app\.js"><\/script>/,
    '<script src="../js/topbar.js"></script>\n  <script src="../js/app.js"></script>'
  );
  
  // Find checkAuth() and add initTopbar after it
  const titleMatch = pageFile.match(/^([a-z-]+)/);
  const pageName = pageFile.replace('.html', '').replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Try different patterns for checkAuth
  if (content.includes('const token = checkAuth();')) {
    content = content.replace(
      /(const token = checkAuth\(\);)/,
      `checkAuth();\n    initTopbar('${pageName}');`
    );
  } else if (content.includes('checkAuth();')) {
    content = content.replace(
      /(^\s*checkAuth\(\);)/m,
      `checkAuth();\n    initTopbar('${pageName}');`
    );
  }
  
  // Remove duplicate user info code if present
  content = content.replace(/\s*const user = getUser\(\);\s*if \(user\) \{[^}]*userName[^}]*\}/s, '');
  content = content.replace(/\s*if \(user\) \{[^}]*userAvatar[^}]*userRole[^}]*\}/s, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${pageFile}`);
});

console.log('\n✅ Second pass migration complete!');
