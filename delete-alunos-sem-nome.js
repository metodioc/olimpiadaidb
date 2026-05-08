require('dotenv').config();
const { pool } = require('./src/config/database');
async function del() {
  const [result] = await pool.query(
    "DELETE FROM tb_aluno WHERE ra IN ('2025-4179','2026-4195','2026-4222')"
  );
  console.log('Deletados:', result.affectedRows, 'registros');
  pool.end();
}
del().catch(console.error);
