const axios = require('axios');

/**
 * Serviço para integração com TOTVS Educacional
 */
class TotvsService {
  constructor() {
    this.baseURL = process.env.TOTVS_API_URL || '';
    this.username = process.env.TOTVS_USERNAME || '';
    this.password = process.env.TOTVS_PASSWORD || '';
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Autenticar na API do TOTVS
   */
  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        username: this.username,
        password: this.password
      });

      this.token = response.data.token;
      this.tokenExpiry = Date.now() + (response.data.expiresIn || 3600) * 1000;
      
      return this.token;
    } catch (error) {
      console.error('Erro ao autenticar no TOTVS:', error.message);
      throw new Error('Falha na autenticação com TOTVS Educacional');
    }
  }

  /**
   * Verificar e renovar token se necessário
   */
  async ensureAuthenticated() {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }

  /**
   * Buscar alunos do TOTVS
   * @param {Object} filters - Filtros (idFilial, idAnoLetivo, etc)
   */
  async getAlunos(filters = {}) {
    await this.ensureAuthenticated();

    try {
      const params = new URLSearchParams();
      
      if (filters.idFilial) params.append('filial', filters.idFilial);
      if (filters.idAnoLetivo) params.append('anoLetivo', filters.idAnoLetivo);
      if (filters.situacao) params.append('situacao', filters.situacao);

      const response = await axios.get(`${this.baseURL}/alunos`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        params
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alunos do TOTVS:', error.message);
      throw new Error('Falha ao buscar alunos do TOTVS Educacional');
    }
  }

  /**
   * Buscar um aluno específico por RA
   */
  async getAlunoByRA(ra) {
    await this.ensureAuthenticated();

    try {
      const response = await axios.get(`${this.baseURL}/alunos/${ra}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar aluno ${ra}:`, error.message);
      return null;
    }
  }

  /**
   * Mapear dados do TOTVS para o formato do banco local
   */
  mapTotvsToLocal(totvsAluno) {
    return {
      // Dados do Aluno
      ra: totvsAluno.ra || totvsAluno.matricula,
      situacao: totvsAluno.situacao || 'Matriculado',
      tipo: totvsAluno.tipo || 'regular',
      sistema: 'TOTVS',
      idGrupoEscola: totvsAluno.idGrupoEscola || null,
      
      // Dados da Pessoa
      pessoa: {
        codPessoa: totvsAluno.codPessoa || totvsAluno.ra,
        nome: totvsAluno.nome,
        email: totvsAluno.email || null,
        dtnasc: totvsAluno.dataNascimento || null,
        imgUrl: totvsAluno.foto || null
      },

      // Referências
      codigoTurma: totvsAluno.codigoTurma || totvsAluno.turma,
      codigoFilial: totvsAluno.codigoFilial || totvsAluno.filial,
      anoLetivo: totvsAluno.anoLetivo
    };
  }
}

module.exports = new TotvsService();
