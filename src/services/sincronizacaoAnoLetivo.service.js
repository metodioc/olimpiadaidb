const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de anos letivos com TOTVS
 *
 * O TOTVS deve expor o endpoint OLIMPIADAS006 retornando ao menos:
 *   ANOLETIVO  (number) – ex.: 2025
 *   STATUS     (string) – ex.: 'ativo' | 'inativo'
 */
class SincronizacaoAnoLetivoService {

  /**
   * Sincronizar anos letivos do TOTVS
   * @param {Object} filters - Filtros opcionais (idAnoLetivo)
   */
  static async sincronizarAnosLetivos(filters = {}) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização de anos letivos com TOTVS Educacional...');

      // Buscar anos letivos do TOTVS
      const totvsAnosLetivos = await totvsService.getAnosLetivos(filters);

      console.log(`📥 ${totvsAnosLetivos.length} anos letivos encontrados no TOTVS`);

      const resultado = {
        total: totvsAnosLetivos.length,
        inseridos: 0,
        atualizados: 0,
        erros: []
      };

      for (const totvsAnoLetivo of totvsAnosLetivos) {
        try {
          const anoLetivoLocal = totvsService.mapAnoLetivoToLocal(totvsAnoLetivo);

          if (!anoLetivoLocal.anoLetivo || isNaN(anoLetivoLocal.anoLetivo)) {
            resultado.erros.push({
              raw: totvsAnoLetivo,
              erro: 'Campo anoLetivo ausente ou inválido'
            });
            continue;
          }

          // Verificar se já existe
          const [existente] = await connection.query(
            'SELECT idAnoLetivo, status FROM tb_ano_letivo WHERE anoLetivo = ?',
            [anoLetivoLocal.anoLetivo]
          );

          if (existente.length > 0) {
            const atual = existente[0];
            const houveMudanca = atual.status !== anoLetivoLocal.status;

            if (houveMudanca) {
              await connection.query(
                'UPDATE tb_ano_letivo SET status = ? WHERE anoLetivo = ?',
                [anoLetivoLocal.status, anoLetivoLocal.anoLetivo]
              );
              resultado.atualizados++;
              console.log(`   🔄 Atualizado: ${anoLetivoLocal.anoLetivo} → ${anoLetivoLocal.status}`);
            }
          } else {
            await connection.query(
              'INSERT INTO tb_ano_letivo (anoLetivo, status) VALUES (?, ?)',
              [anoLetivoLocal.anoLetivo, anoLetivoLocal.status]
            );
            resultado.inseridos++;
            console.log(`   📝 Inserido: ${anoLetivoLocal.anoLetivo} (${anoLetivoLocal.status})`);
          }

        } catch (error) {
          console.error(`Erro ao processar ano letivo ${totvsAnoLetivo.ANOLETIVO || totvsAnoLetivo.anoLetivo || 'desconhecido'}:`, error.message);
          resultado.erros.push({
            anoLetivo: totvsAnoLetivo.ANOLETIVO || totvsAnoLetivo.anoLetivo,
            erro: error.message
          });
        }
      }

      await connection.commit();

      console.log(`✅ Sincronização de anos letivos concluída:`);
      console.log(`   ➕ ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização de anos letivos:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SincronizacaoAnoLetivoService;
