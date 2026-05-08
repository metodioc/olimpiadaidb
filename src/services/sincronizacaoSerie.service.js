const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de séries com TOTVS
 */
class SincronizacaoSerieService {

  /**
   * Sincronizar séries do TOTVS
   */
  static async sincronizarSeries(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização de séries com TOTVS Educacional...');
      
      // Buscar séries do TOTVS
      const totvsSeries = await totvsService.getSeries(filters);
      
      console.log(`📥 ${totvsSeries.length} séries encontradas no TOTVS`);

      const resultado = {
        total: totvsSeries.length,
        inseridos: 0,
        atualizados: 0,
        erros: []
      };

      for (const totvsSerie of totvsSeries) {
        try {
          const serieLocal = totvsService.mapSerieToLocal(totvsSerie);
          
          // Buscar idFilial pelo codFilial
          const [filial] = await connection.query(
            'SELECT idFilial FROM tb_filial WHERE codFilial = ?',
            [serieLocal.codFilial]
          );

          if (filial.length === 0) {
            resultado.erros.push({
              codSerie: serieLocal.codSerie,
              erro: `Filial ${serieLocal.codFilial} não encontrada`
            });
            continue;
          }

          const idFilial = filial[0].idFilial;

          // Verificar se série já existe e buscar dados atuais
          const [serieExistente] = await connection.query(
            'SELECT idSerie, serie, abSerie FROM tb_serie WHERE codSerie = ? AND idFilial = ?',
            [serieLocal.codSerie, idFilial]
          );

          if (serieExistente.length > 0) {
            // Comparar campos para verificar se há mudanças
            const serieAtual = serieExistente[0];
            const houveMudanca = (
              serieAtual.serie !== serieLocal.serie ||
              serieAtual.abSerie !== serieLocal.abSerie
            );

            if (houveMudanca) {
              // Atualizar apenas se houve mudança
              await connection.query(
                `UPDATE tb_serie 
                 SET serie = ?, abSerie = ?
                 WHERE codSerie = ? AND idFilial = ?`,
                [
                  serieLocal.serie,
                  serieLocal.abSerie,
                  serieLocal.codSerie,
                  idFilial
                ]
              );
              resultado.atualizados++;
              console.log(`   🔄 Atualizado: ${serieLocal.serie} (${serieLocal.codSerie})`);
            }
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_serie (codSerie, serie, abSerie, idFilial)
               VALUES (?, ?, ?, ?)`,
              [
                serieLocal.codSerie,
                serieLocal.serie,
                serieLocal.abSerie,
                idFilial
              ]
            );
            resultado.inseridos++;
            console.log(`   📝 Inserido: ${serieLocal.serie} (${serieLocal.codSerie})`);
          }

        } catch (error) {
          console.error(`Erro ao processar série ${totvsSerie.codSerie}:`, error);
          resultado.erros.push({
            codSerie: totvsSerie.codSerie,
            erro: error.message
          });
        }
      }

      await connection.commit();
      
      console.log(`✅ Sincronização de séries concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização de séries:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SincronizacaoSerieService;
