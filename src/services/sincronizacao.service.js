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
        erros: [],
        detalhes: []
      };

      for (const totvsAluno of totvsAlunos) {
        try {
          const alunoLocal = totvsService.mapTotvsToLocal(totvsAluno);
          
          // Processar pessoa
          const idPessoa = await this.processarPessoa(connection, alunoLocal.pessoa);
          
          // Buscar idTurma pelo código
          const idTurma = await this.buscarIdTurma(connection, alunoLocal.codigoTurma, alunoLocal.anoLetivo);
          
          if (!idTurma) {
            resultado.erros.push({
              ra: alunoLocal.ra,
              erro: `Turma ${alunoLocal.codigoTurma} não encontrada`
            });
            continue;
          }

          // Verificar se aluno já existe
          const [alunoExistente] = await connection.query(
            'SELECT idAluno FROM tb_aluno WHERE ra = ?',
            [alunoLocal.ra]
          );

          if (alunoExistente.length > 0) {
            // Atualizar
            await connection.query(
              `UPDATE tb_aluno 
               SET situacao = ?, tipo = ?, sistema = ?, idGrupoEscola = ?, 
                   idPessoa = ?, idTurma = ?
               WHERE ra = ?`,
              [
                alunoLocal.situacao,
                alunoLocal.tipo,
                alunoLocal.sistema,
                alunoLocal.idGrupoEscola,
                idPessoa,
                idTurma,
                alunoLocal.ra
              ]
            );
            resultado.atualizados++;
            resultado.detalhes.push({ ra: alunoLocal.ra, acao: 'atualizado' });
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_aluno 
               (ra, situacao, tipo, sistema, idGrupoEscola, idPessoa, idTurma)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                alunoLocal.ra,
                alunoLocal.situacao,
                alunoLocal.tipo,
                alunoLocal.sistema,
                alunoLocal.idGrupoEscola,
                idPessoa,
                idTurma
              ]
            );
            resultado.inseridos++;
            resultado.detalhes.push({ ra: alunoLocal.ra, acao: 'inserido' });
          }

        } catch (error) {
          console.error(`Erro ao processar aluno ${totvsAluno.ra}:`, error);
          resultado.erros.push({
            ra: totvsAluno.ra,
            erro: error.message
          });
        }
      }

      await connection.commit();
      
      console.log(`✅ Sincronização concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
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
   * Processar dados da pessoa (criar ou atualizar)
   */
  static async processarPessoa(connection, pessoa) {
    const [pessoaExistente] = await connection.query(
      'SELECT idPessoa FROM tb_pessoa WHERE codPessoa = ?',
      [pessoa.codPessoa]
    );

    if (pessoaExistente.length > 0) {
      // Atualizar pessoa
      await connection.query(
        `UPDATE tb_pessoa 
         SET nome = ?, email = ?, dtnasc = ?, imgUrl = ?
         WHERE codPessoa = ?`,
        [pessoa.nome, pessoa.email, pessoa.dtnasc, pessoa.imgUrl, pessoa.codPessoa]
      );
      return pessoaExistente[0].idPessoa;
    } else {
      // Inserir pessoa
      const [result] = await connection.query(
        `INSERT INTO tb_pessoa (codPessoa, nome, email, dtnasc, imgUrl)
         VALUES (?, ?, ?, ?, ?)`,
        [pessoa.codPessoa, pessoa.nome, pessoa.email, pessoa.dtnasc, pessoa.imgUrl]
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
