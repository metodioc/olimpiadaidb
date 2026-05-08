require('dotenv').config();
const { pool } = require('./src/config/database');
async function test() {
  const [rows] = await pool.query(`
    SELECT a.ra, 
      COALESCE(p.nome, IF(a.codPessoa IS NOT NULL, CONCAT('(Sem cadastro - codPessoa: ', a.codPessoa, ')'), '(Sem vinculo)')) as nome_pessoa,
      a.situacao
    FROM tb_aluno a
    LEFT JOIN (SELECT codPessoa, MAX(nome) as nome FROM tb_pessoa WHERE codPessoa IS NOT NULL GROUP BY codPessoa) p ON a.codPessoa = p.codPessoa
    WHERE a.ra IN ('2025-4179','2026-4195','2026-4222')
  `);
  rows.forEach(r => console.log(r.ra, '|', r.nome_pessoa, '|', r.situacao));
  pool.end();
}
test().catch(console.error);
