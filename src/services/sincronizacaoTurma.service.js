const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de turmas com TOTVS
 */
class SincronizacaoTurmaService {

  /**
   * Sincronizar turmas do TOTVS
   */
  static async sincronizarTurmas(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização de turmas com TOTVS Educacional...');
      
      // Buscar turmas do TOTVS
      const totvsTurmas = await totvsService.getTurmas(filters);
      
      console.log(`📥 ${totvsTurmas.length} turmas encontradas no TOTVS`);

      const resultado = {
        total: totvsTurmas.length,
        inseridos: 0,
        atualizados: 0,
        erros: []
      };

      for (const totvsTurma of totvsTurmas) {
        try {
          const turmaLocal = totvsService.mapTurmaToLocal(totvsTurma);
          
          // Buscar idFilial pelo codFilial
          const [filial] = await connection.query(
            'SELECT idFilial FROM tb_filial WHERE codFilial = ?',
            [turmaLocal.codFilial]
          );

          if (filial.length === 0) {
            resultado.erros.push({
              codTurma: turmaLocal.codTurma,
              erro: `Filial ${turmaLocal.codFilial} não encontrada`
            });
            continue;
          }

          const idFilial = filial[0].idFilial;

          // Buscar idAnoLetivo pelo anoLetivo
          const [anoLetivo] = await connection.query(
            'SELECT idAnoLetivo FROM tb_ano_letivo WHERE anoLetivo = ?',
            [turmaLocal.anoLetivo]
          );

          if (anoLetivo.length === 0) {
            resultado.erros.push({
              codTurma: turmaLocal.codTurma,
              erro: `Ano letivo ${turmaLocal.anoLetivo} não encontrado`
            });
            continue;
          }

          const idAnoLetivo = anoLetivo[0].idAnoLetivo;

          // Buscar idSerie pelo codSerie e idFilial
          const [serie] = await connection.query(
            'SELECT idSerie FROM tb_serie WHERE codSerie = ? AND idFilial = ?',
            [turmaLocal.codSerie, idFilial]
          );

          if (serie.length === 0) {
            resultado.erros.push({
              codTurma: turmaLocal.codTurma,
              erro: `Série ${turmaLocal.codSerie} não encontrada para filial ${turmaLocal.codFilial}`
            });
            continue;
          }

          const idSerie = serie[0].idSerie;

          // Verificar se turma já existe e buscar dados atuais
          const [turmaExistente] = await connection.query(
            'SELECT idTurma, turma, turno FROM tb_turma WHERE codTurma = ? AND idSerie = ? AND idAnoLetivo = ?',
            [turmaLocal.codTurma, idSerie, idAnoLetivo]
          );

          if (turmaExistente.length > 0) {
            // Comparar campos para verificar se há mudanças
            const turmaAtual = turmaExistente[0];
            const houveMudanca = (
              turmaAtual.turma !== turmaLocal.turma ||
              turmaAtual.turno !== turmaLocal.turno
            );

            if (houveMudanca) {
              // Atualizar apenas se houve mudança
              await connection.query(
                `UPDATE tb_turma 
                 SET turma = ?, turno = ?
                 WHERE codTurma = ? AND idSerie = ? AND idAnoLetivo = ?`,
                [
                  turmaLocal.turma,
                  turmaLocal.turno,
                  turmaLocal.codTurma,
                  idSerie,
                  idAnoLetivo
                ]
              );
              resultado.atualizados++;
              console.log(`   🔄 Atualizado: ${turmaLocal.turma} (${turmaLocal.codTurma})`);
            }
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_turma (codTurma, turma, idSerie, idAnoLetivo, turno)
               VALUES (?, ?, ?, ?, ?)`,
              [
                turmaLocal.codTurma,
                turmaLocal.turma,
                idSerie,
                idAnoLetivo,
                turmaLocal.turno
              ]
            );
            resultado.inseridos++;
            console.log(`   📝 Inserido: ${turmaLocal.turma} (${turmaLocal.codTurma})`);
          }

        } catch (error) {
          console.error(`Erro ao processar turma ${totvsTurma.codTurma}:`, error);
          resultado.erros.push({
            codTurma: totvsTurma.codTurma,
            erro: error.message
          });
        }
      }

      await connection.commit();
      
      console.log(`✅ Sincronização de turmas concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização de turmas:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SincronizacaoTurmaService;
