const { pool } = require('../config/database');
const totvsService = require('../services/totvs.service');

/**
 * Serviço de sincronização de pessoas com TOTVS
 */
class SincronizacaoPessoaService {

  /**
   * Sincronizar pessoas do TOTVS
   */
  static async sincronizarPessoas(filters = {}) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      console.log('🔄 Iniciando sincronização de pessoas com TOTVS Educacional...');
      
      // Buscar pessoas do TOTVS
      const totvsPessoas = await totvsService.getPessoas(filters);
      
      console.log(`📥 ${totvsPessoas.length} pessoas encontradas no TOTVS`);

      const resultado = {
        total: totvsPessoas.length,
        inseridos: 0,
        atualizados: 0,
        erros: []
      };

      for (const totvsPessoa of totvsPessoas) {
        try {
          const pessoaLocal = totvsService.mapPessoaToLocal(totvsPessoa);
          
          // Verificar se pessoa já existe e buscar dados atuais
          const [pessoaExistente] = await connection.query(
            'SELECT idPessoa, nome, email, dtnasc, cpf FROM tb_pessoa WHERE codPessoa = ?',
            [pessoaLocal.codPessoa]
          );

          if (pessoaExistente.length > 0) {
            // Comparar campos para verificar se há mudanças
            const pessoaAtual = pessoaExistente[0];
            const houveMudanca = (
              pessoaAtual.nome !== pessoaLocal.nome ||
              pessoaAtual.email !== pessoaLocal.email ||
              pessoaAtual.dtnasc !== pessoaLocal.dtnasc ||
              pessoaAtual.cpf !== pessoaLocal.cpf
            );

            if (houveMudanca) {
              // Atualizar apenas se houve mudança
              await connection.query(
                `UPDATE tb_pessoa 
                 SET nome = ?, email = ?, dtnasc = ?, cpf = ?
                 WHERE codPessoa = ?`,
                [
                  pessoaLocal.nome,
                  pessoaLocal.email,
                  pessoaLocal.dtnasc,
                  pessoaLocal.cpf,
                  pessoaLocal.codPessoa
                ]
              );
              resultado.atualizados++;
              console.log(`   🔄 Atualizado: ${pessoaLocal.nome} (${pessoaLocal.codPessoa})`);
            }
          } else {
            // Inserir
            await connection.query(
              `INSERT INTO tb_pessoa (codPessoa, nome, email, dtnasc, cpf, imgUrl)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [
                pessoaLocal.codPessoa,
                pessoaLocal.nome,
                pessoaLocal.email,
                pessoaLocal.dtnasc,
                pessoaLocal.cpf,
                pessoaLocal.imgUrl
              ]
            );
            resultado.inseridos++;
            console.log(`   📝 Inserido: ${pessoaLocal.nome} (${pessoaLocal.codPessoa})`);
          }

        } catch (error) {
          console.error(`Erro ao processar pessoa ${totvsPessoa.codpessoa}:`, error);
          resultado.erros.push({
            codPessoa: totvsPessoa.codpessoa,
            erro: error.message
          });
        }
      }

      await connection.commit();
      
      console.log(`✅ Sincronização de pessoas concluída:`);
      console.log(`   📝 ${resultado.inseridos} inseridos`);
      console.log(`   🔄 ${resultado.atualizados} atualizados`);
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
}

module.exports = SincronizacaoPessoaService;
