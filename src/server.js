require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ===================================
// MIDDLEWARES DE SEGURANÇA
// ===================================

// Helmet - Headers de segurança (configurado para permitir inline scripts)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://unpkg.com"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://unpkg.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://unpkg.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// CORS - Controle de acesso
const corsOptions = {
  origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : '*',
  credentials: true
};
app.use(cors(corsOptions));

// Rate Limiting - Proteção contra DDoS
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// ===================================
// MIDDLEWARES GERAIS
// ===================================

// Servir arquivos estáticos (Frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ===================================
// ROTAS
// ===================================

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'OlimpiadaIDB API está funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz - redirecionar para login
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Rotas de redirecionamento para páginas
app.get('/dashboard', (req, res) => {
  res.redirect('/pages/dashboard.html');
});

app.get('/dashboard.html', (req, res) => {
  res.redirect('/pages/dashboard.html');
});

app.get('/alunos', (req, res) => {
  res.redirect('/pages/alunos.html');
});

app.get('/alunos.html', (req, res) => {
  res.redirect('/pages/alunos.html');
});

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const olimpiadaRoutes = require('./routes/olimpiada.routes');
const inscricaoRoutes = require('./routes/inscricao.routes');
const resultadoRoutes = require('./routes/resultado.routes');
const filialRoutes = require('./routes/filial.routes');
const serieRoutes = require('./routes/serie.routes');
const turmaRoutes = require('./routes/turma.routes');
const alunoRoutes = require('./routes/aluno.routes');
const anoLetivoRoutes = require('./routes/anoLetivo.routes');
const tipoCorrecaoRoutes = require('./routes/tipoCorrecao.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const localAplicacaoRoutes = require('./routes/localAplicacao.routes');
const tipoPagamentoRoutes = require('./routes/tipoPagamento.routes');
const tipoOlimpiadaRoutes = require('./routes/tipoOlimpiada.routes');
const sincronizacaoRoutes = require('./routes/sincronizacao.routes');
const sincronizacaoPessoaRoutes = require('./routes/sincronizacaoPessoa.routes');
const sincronizacaoFilialRoutes = require('./routes/sincronizacaoFilial.routes');
const sincronizacaoSerieRoutes = require('./routes/sincronizacaoSerie.routes');
const sincronizacaoTurmaRoutes = require('./routes/sincronizacaoTurma.routes');
const sincronizacaoAnoLetivoRoutes = require('./routes/sincronizacaoAnoLetivo.routes');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/olimpiadas', olimpiadaRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api/resultados', resultadoRoutes);
app.use('/api/filiais', filialRoutes);
app.use('/api/series', serieRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/anos-letivos', anoLetivoRoutes);
app.use('/api/tipos-correcao', tipoCorrecaoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/locais-aplicacao', localAplicacaoRoutes);
app.use('/api/tipos-pagamento', tipoPagamentoRoutes);
app.use('/api/tipos-olimpiada', tipoOlimpiadaRoutes);
app.use('/api/sincronizacao', sincronizacaoRoutes);
app.use('/api/sincronizacao', sincronizacaoPessoaRoutes);
app.use('/api/sincronizacao', sincronizacaoFilialRoutes);
app.use('/api/sincronizacao', sincronizacaoSerieRoutes);
app.use('/api/sincronizacao/turmas', sincronizacaoTurmaRoutes);
app.use('/api/sincronizacao', sincronizacaoAnoLetivoRoutes);

// ===================================
// TRATAMENTO DE ERROS
// ===================================

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Handler de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ===================================
// INICIAR SERVIDOR
// ===================================

const startServer = async () => {
  try {
    // Testar conexão com o banco
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.warn('⚠️  Servidor iniciado sem conexão com o banco de dados');
    }
    
    // Iniciar cron job de sincronização TOTVS (não executar em testes)
    if (process.env.NODE_ENV !== 'test') {
      const SincronizacaoJob = require('./jobs/sincronizacao.job');
      SincronizacaoJob.iniciar();
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(`🚀 Servidor OlimpiadaIDB rodando!`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`💾 Banco: ${process.env.DB_NAME || 'olimpiadaidb'}`);
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Só iniciar servidor se não estiver em ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
