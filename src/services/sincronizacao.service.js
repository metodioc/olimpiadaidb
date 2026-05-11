const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de alunos com TOTVS
 */
class SincronizacaoService {

  /**
   * Sincronizar alunos de uma filial
   */
  static async sincronizarAlunos(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização com TOTVS Educacional...');
      
      // Buscar alunos do TOTVS
      const totvsAlunos = await totvsService.getAlunos(filters);
      
      console.log(`📥 ${totvsAlunos.length} alunos encontrados no TOTVS`);

      const resultado = {
        total: totvsAlunos.length,
        inseridos: 0,
        atualizados: 0,
        transferidos: 0,
        erros: [],
        detalhes: []
      };

      for (const totvsAluno of totvsAlunos) {
        try {
          const alunoLocal = totvsService.mapTotvsToLocal(totvsAluno);
          
          // Verificar se aluno já existe (por RA e ano letivo)
          const [alunoExistente] = await connection.query(
            `SELECT a.idAluno, a.situacao, a.tipo, a.sistema, a.idGrupoEscola, 
                    a.codPessoa, a.codTurma, a.codFilial, a.codSerie, a.anoLetivo
             FROM tb_aluno a
             WHERE a.ra = ? AND a.anoLetivo = ?`,
            [alunoLocal.ra, alunoLocal.anoLetivo]
          );

          if (alunoExistente.length > 0) {
            // Comparar campos para verificar se há mudanças
            const alunoAtual = alunoExistente[0];
            const houveMudanca = (
              alunoAtual.situacao !== alunoLocal.situacao ||
              alunoAtual.tipo !== alunoLocal.tipo ||
              alunoAtual.sistema !== alunoLocal.sistema ||
              alunoAtual.idGrupoEscola !== alunoLocal.idGrupoEscola ||
              alunoAtual.codPessoa !== alunoLocal.codPessoa ||
              alunoAtual.codTurma !== alunoLocal.codTurma ||
              alunoAtual.codFilial !== alunoLocal.codFilial ||
              alunoAtual.codSerie !== alunoLocal.codSerie
            );

            if (houveMudanca) {
              // Atualizar apenas se houve mudança
              await connection.query(
                `UPDATE tb_aluno 
                 SET situacao = ?, tipo = ?, sistema = ?, idGrupoEscola = ?, 
                     codPessoa = ?, codTurma = ?, codFilial = ?, codSerie = ?
                 WHERE ra = ? AND idAluno = ?`,
                [
                  alunoLocal.situacao,
                  alunoLocal.tipo,
                  alunoLocal.sistema,
                  alunoLocal.idGrupoEscola,
                  alunoLocal.codPessoa,
                  alunoLocal.codTurma,
                  alunoLocal.codFilial,
                  alunoLocal.codSerie,
                  alunoLocal.ra,
                  alunoAtual.idAluno
                ]
              );
              resultado.atualizados++;
              resultado.detalhes.push({ ra: alunoLocal.ra, acao: 'atualizado' });
            }
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_aluno 
               (ra, situacao, tipo, sistema, idGrupoEscola, codPessoa, codTurma, codFilial, codSerie, anoLetivo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                alunoLocal.ra,
                alunoLocal.situacao,
                alunoLocal.tipo,
                alunoLocal.sistema,
                alunoLocal.idGrupoEscola,
                alunoLocal.codPessoa,
                alunoLocal.codTurma,
                alunoLocal.codFilial,
                alunoLocal.codSerie,
                alunoLocal.anoLetivo
              ]
            );
            resultado.inseridos++;
            resultado.detalhes.push({ ra: alunoLocal.ra, acao: 'inserido' });
          }

        } catch (error) {
          console.error(`Erro ao processar aluno ${totvsAluno.RA || 'desconhecido'}:`, error);
          resultado.erros.push({
            ra: totvsAluno.RA || 'desconhecido',
            erro: error.message
          });
        }
      }

      // ─── Detectar alunos ausentes na sincronização ───────────────────────
      // Pega os RAs que vieram do TOTVS para o(s) anoLetivo(s) retornados
      const rasTotvs = new Set(totvsAlunos.map(a => String(a.RA)));

      // Busca todos os alunos locais ativos que não vieram na carga
      // Considera apenas os mesmos anos letivos presentes na carga TOTVS
      const anosLetivosTotvs = [...new Set(
        totvsAlunos.map(a => parseInt(a.ANOLETIVO || new Date().getFullYear()))
      )];

      if (anosLetivosTotvs.length > 0) {
        const placeholders = anosLetivosTotvs.map(() => '?').join(',');
        const [alunosAtivos] = await connection.query(
          `SELECT idAluno, ra, situacao, anoLetivo
           FROM tb_aluno
           WHERE situacao NOT IN ('Transferido', 'Formado', 'Inativo')
             AND anoLetivo IN (${placeholders})`,
          anosLetivosTotvs
        );

        for (const aluno of alunosAtivos) {
          if (!rasTotvs.has(String(aluno.ra))) {
            await connection.query(
              `UPDATE tb_aluno SET situacao = 'Transferido' WHERE idAluno = ?`,
              [aluno.idAluno]
            );
            resultado.transferidos++;
            resultado.detalhes.push({ ra: aluno.ra, acao: 'transferido' });
          }
        }
      }
      // ─────────────────────────────────────────────────────────────────────

      await connection.commit();

      console.log(`✅ Sincronização concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
      console.log(`   🚌 ${resultado.transferidos} transferidos`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Sincronizar pessoas (tb_pessoa) com TOTVS
   */
  static async sincronizarPessoas(filters = {}) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      console.log('👤 Iniciando sincronização de pessoas com TOTVS...');

      const totvsPessoas = await totvsService.getPessoas(filters);

      console.log(`📥 ${totvsPessoas.length} pessoas encontradas no TOTVS`);

      const resultado = {
        total: totvsPessoas.length,
        inseridas: 0,
        atualizadas: 0,
        erros: []
      };

      for (const totvsPessoa of totvsPessoas) {
        try {
          const pessoaLocal = totvsService.mapPessoaToLocal(totvsPessoa);

          if (!pessoaLocal.codPessoa) continue;

          const [existente] = await connection.query(
            'SELECT idPessoa, nome, email, dtnasc, cpf FROM tb_pessoa WHERE codPessoa = ?',
            [pessoaLocal.codPessoa]
          );

          if (existente.length > 0) {
            const atual = existente[0];
            const houveMudanca = (
              atual.nome !== pessoaLocal.nome ||
              atual.email !== pessoaLocal.email ||
              String(atual.dtnasc ?? '').slice(0, 10) !== String(pessoaLocal.dtnasc ?? '').slice(0, 10) ||
              atual.cpf !== pessoaLocal.cpf
            );

            if (houveMudanca) {
              await connection.query(
                `UPDATE tb_pessoa SET nome = ?, email = ?, dtnasc = ?, cpf = ? WHERE codPessoa = ?`,
                [pessoaLocal.nome, pessoaLocal.email, pessoaLocal.dtnasc, pessoaLocal.cpf, pessoaLocal.codPessoa]
              );
              resultado.atualizadas++;
            }
          } else {
            await connection.query(
              `INSERT INTO tb_pessoa (codPessoa, nome, email, dtnasc, cpf, imgUrl) VALUES (?, ?, ?, ?, ?, ?)`,
              [pessoaLocal.codPessoa, pessoaLocal.nome, pessoaLocal.email, pessoaLocal.dtnasc, pessoaLocal.cpf, pessoaLocal.imgUrl]
            );
            resultado.inseridas++;
          }
        } catch (error) {
          console.error(`Erro ao processar pessoa ${totvsPessoa.CODPESSOA || 'desconhecido'}:`, error.message);
          resultado.erros.push({ codPessoa: totvsPessoa.CODPESSOA, erro: error.message });
        }
      }

      await connection.commit();

      console.log(`✅ Sincronização de pessoas concluída:`);
      console.log(`   ➕ ${resultado.inseridas} inseridas`);
      console.log(`   🔄 ${resultado.atualizadas} atualizadas`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização de pessoas:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Processar dados da pessoa (criar ou atualizar)
   */
  static async processarPessoa(connection, pessoa) {
    const [pessoaExistente] = await connection.query(
      'SELECT idPessoa, nome, email, dtnasc, cpf FROM tb_pessoa WHERE codPessoa = ?',
      [pessoa.codPessoa]
    );

    if (pessoaExistente.length > 0) {
      // Comparar campos para verificar se há mudanças
      const pessoaAtual = pessoaExistente[0];
      const houveMudanca = (
        pessoaAtual.nome !== pessoa.nome ||
        pessoaAtual.email !== pessoa.email ||
        pessoaAtual.dtnasc !== pessoa.dtnasc ||
        pessoaAtual.cpf !== pessoa.cpf
      );

      if (houveMudanca) {
        // Atualizar pessoa apenas se houve mudança
        await connection.query(
          `UPDATE tb_pessoa 
           SET nome = ?, email = ?, dtnasc = ?, cpf = ?
           WHERE codPessoa = ?`,
          [pessoa.nome, pessoa.email, pessoa.dtnasc, pessoa.cpf, pessoa.codPessoa]
        );
      }
      return pessoaExistente[0].idPessoa;
    } else {
      // Inserir pessoa
      const [result] = await connection.query(
        `INSERT INTO tb_pessoa (codPessoa, nome, email, dtnasc, cpf, imgUrl)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pessoa.codPessoa, pessoa.nome, pessoa.email, pessoa.dtnasc, pessoa.cpf, pessoa.imgUrl]
      );
      return result.insertId;
    }
  }

  /**
   * Buscar ID da turma pelo código
   */
  static async buscarIdTurma(connection, codigoTurma, anoLetivo) {
    const [turma] = await connection.query(
      `SELECT t.idTurma 
       FROM tb_turma t
       INNER JOIN tb_ano_letivo al ON t.idAnoLetivo = al.idAnoLetivo
       WHERE t.codTurma = ? AND al.anoLetivo = ?`,
      [codigoTurma, anoLetivo]
    );

    return turma.length > 0 ? turma[0].idTurma : null;
  }

  /**
   * Sincronização incremental (apenas alunos modificados)
   */
  static async sincronizacaoIncremental(dataUltimaSync) {
    // Implementar lógica para buscar apenas registros modificados após dataUltimaSync
    console.log(`🔄 Sincronização incremental desde ${dataUltimaSync}`);
    
    const filters = {
      dataModificacao: dataUltimaSync
    };

    return await this.sincronizarAlunos(filters);
  }
}

module.exports = SincronizacaoService;
