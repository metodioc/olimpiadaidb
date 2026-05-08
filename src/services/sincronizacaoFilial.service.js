const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de filiais com TOTVS
 */
class SincronizacaoFilialService {

  /**
   * Sincronizar filiais do TOTVS
   */
  static async sincronizarFiliais() {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização de filiais com TOTVS Educacional...');
      
      // Buscar filiais do TOTVS
      const totvsFiliais = await totvsService.getFiliais();
      
      console.log(`📥 ${totvsFiliais.length} filiais encontradas no TOTVS`);

      const resultado = {
        total: totvsFiliais.length,
        inseridos: 0,
        atualizados: 0,
        erros: []
      };

      for (const totvsFilial of totvsFiliais) {
        try {
          const filialLocal = totvsService.mapFilialToLocal(totvsFilial);
          
          // Verificar se filial já existe e buscar dados atuais
          const [filialExistente] = await connection.query(
            'SELECT idFilial, filial FROM tb_filial WHERE codFilial = ?',
            [filialLocal.codFilial]
          );

          if (filialExistente.length > 0) {
            // Comparar campos para verificar se há mudanças
            const filialAtual = filialExistente[0];
            const houveMudanca = (filialAtual.filial !== filialLocal.filial);

            if (houveMudanca) {
              // Atualizar apenas se houve mudança
              await connection.query(
                `UPDATE tb_filial 
                 SET filial = ?
                 WHERE codFilial = ?`,
                [
                  filialLocal.filial,
                  filialLocal.codFilial
                ]
              );
              resultado.atualizados++;
              console.log(`   🔄 Atualizado: ${filialLocal.filial} (${filialLocal.codFilial})`);
            }
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_filial (codFilial, filial)
               VALUES (?, ?)`,
              [
                filialLocal.codFilial,
                filialLocal.filial
              ]
            );
            resultado.inseridos++;
            console.log(`   📝 Inserido: ${filialLocal.filial} (${filialLocal.codFilial})`);
          }

        } catch (error) {
          console.error(`Erro ao processar filial ${totvsFilial.codfilial}:`, error);
          resultado.erros.push({
            codFilial: totvsFilial.codfilial,
            erro: error.message
          });
        }
      }

      await connection.commit();
      
      console.log(`✅ Sincronização de filiais concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
      console.log(`   ❌ ${resultado.erros.length} erros`);

      return resultado;

    } catch (error) {
      await connection.rollback();
      console.error('❌ Erro na sincronização de filiais:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = SincronizacaoFilialService;
