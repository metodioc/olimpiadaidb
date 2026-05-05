const axios = require('axios');

/**
 * Serviço para integração com TOTVS Educacional
 */
class TotvsService {
  constructor() {
    this.baseURL = process.env.TOTVS_API_URL || '';
    this.username = process.env.TOTVS_USERNAME || '';
    this.password = process.env.TOTVS_PASSWORD || '';
    // Criar Basic Auth token (Base64 de username:password)
    this.authToken = Buffer.from(`${this.username}:${this.password}`).toString('base64');
  }

  /**
   * Obter headers de autenticação Basic
   */
  getAuthHeaders() {
    return {
      'Authorization': `Basic ${this.authToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Buscar alunos do TOTVS
   * @param {Object} filters - Filtros (idFilial, idAnoLetivo, etc)
   */
  async getAlunos(filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/OLIMPIADAS005/0/S`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alunos do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar alunos do TOTVS Educacional');
    }
  }

  /**
   * Buscar pessoas do TOTVS
   * @param {Object} filters - Filtros (idAnoLetivo, etc)
   */
  async getPessoas(filters = {}) {
    try {
      const date = new Date();
      const year = filters.idAnoLetivo || date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      // Montar parâmetros conforme API TOTVS
      const parameters = `CODPERLET=${year};DTBASE_D=${year}-${month}-${day}T23:59:00`;

      const response = await axios.get(`${this.baseURL}/OLIMPIADAS001/0/S`, {
        headers: this.getAuthHeaders(),
        params: {
          parameters
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pessoas do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar pessoas do TOTVS Educacional');
    }
  }

  /**
   * Buscar filiais do TOTVS
   */
  async getFiliais() {
    try {
      const response = await axios.get(`${this.baseURL}/OLIMPIADAS002/0/S`, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar filiais do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar filiais do TOTVS Educacional');
    }
  }

  /**
   * Buscar séries do TOTVS
   * @param {Object} filters - Filtros (idAnoLetivo, etc)
   */
  async getSeries(filters = {}) {
    try {
      const date = new Date();
      const year = filters.idAnoLetivo || date.getFullYear();
      
      // Montar parâmetros conforme API TOTVS
      const parameters = `CODPERLET=${year}`;

      const response = await axios.get(`${this.baseURL}/OLIMPIADAS003/0/S`, {
        headers: this.getAuthHeaders(),
        params: {
          parameters
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar séries do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar séries do TOTVS Educacional');
    }
  }

  /**
   * Buscar turmas do TOTVS
   * @param {Object} filters - Filtros (idAnoLetivo, etc)
   */
  async getTurmas(filters = {}) {
    try {
      const date = new Date();
      const year = filters.idAnoLetivo || date.getFullYear();
      
      // Montar parâmetros conforme API TOTVS
      const parameters = `CODPERLET=${year}`;
      const url = `${this.baseURL}/OLIMPIADAS004/0/S?parameters=${parameters}`;

      const response = await axios.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar turmas do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar turmas do TOTVS Educacional');
    }
  }

  /**
   * Buscar anos letivos do TOTVS
   * Endpoint: OLIMPIADAS006 (a ser criado no TOTVS)
   * Retorna: ANOLETIVO, STATUS (ex.: 'ativo'/'inativo')
   */
  async getAnosLetivos(filters = {}) {
    try {
      const parameters = filters.idAnoLetivo
        ? `CODPERLET=${filters.idAnoLetivo}`
        : '';

      const url = parameters
        ? `${this.baseURL}/OLIMPIADAS006/0/S?parameters=${parameters}`
        : `${this.baseURL}/OLIMPIADAS006/0/S`;

      const response = await axios.get(url, {
        headers: this.getAuthHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar anos letivos do TOTVS:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      throw new Error('Falha ao buscar anos letivos do TOTVS Educacional');
    }
  }

  /**
   * Mapear dados de ano letivo do TOTVS para o formato local
   * Campos esperados: ANOLETIVO (int), STATUS (string: 'ativo'/'inativo')
   */
  mapAnoLetivoToLocal(totvsAnoLetivo) {
    const statusRaw = (totvsAnoLetivo.STATUS || totvsAnoLetivo.status || '').toLowerCase();
    const status = statusRaw === 'inativo' ? 'inativo' : 'ativo';

    return {
      anoLetivo: parseInt(totvsAnoLetivo.anoLetivo),
      status
    };
  }

  /**
   * Buscar um aluno específico por RA
   */
  async getAlunoByRA(ra) {
    try {
      const response = await axios.get(`${this.baseURL}/alunos/${ra}`, {
        headers: this.getAuthHeaders()
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
      ra: totvsAluno.RA,
      situacao: totvsAluno.STATUS || totvsAluno.SITUACAO || 'Ativo',
      tipo: totvsAluno.TIPO || 'Regular',
      sistema: 'TOTVS',
      idGrupoEscola: null,
      
      // Códigos para relacionamento
      codPessoa: totvsAluno.CODPESSOA,
      codTurma: totvsAluno.CODTURMA,
      codFilial: totvsAluno.CODFILIAL,
      codSerie: totvsAluno.CODSERIE,
      anoLetivo: totvsAluno.ANOLETIVO || new Date().getFullYear()
    };
  }

  /**
   * Mapear dados de pessoa do TOTVS para o formato do banco local
   */
  mapPessoaToLocal(totvsPessoa) {
    // Converter data do formato DD/MM/YYYY para YYYY-MM-DD
    let dtnasc = null;
    if (totvsPessoa.DTNASC) {
      const partes = totvsPessoa.DTNASC.split('/');
      if (partes.length === 3) {
        dtnasc = `${partes[2]}-${partes[1]}-${partes[0]}`; // YYYY-MM-DD
      }
    }

    return {
      codPessoa: totvsPessoa.CODPESSOA || totvsPessoa.codpessoa,
      nome: totvsPessoa.NOME,
      email: totvsPessoa.EMAIL || null,
      dtnasc: dtnasc,
      imgUrl: null,
      habilitacao: totvsPessoa.HABNOME || null
    };
  }

  /**
   * Mapear dados de filial do TOTVS para o formato do banco local
   */
  mapFilialToLocal(totvsFilial) {
    return {
      codFilial: totvsFilial.CODFILIAL || totvsFilial.codfilial,
      filial: totvsFilial.FILIAL || totvsFilial.filial
    };
  }

  /**
   * Mapear dados de série do TOTVS para o formato do banco local
   */
  mapSerieToLocal(totvsSerie) {
    return {
      codFilial: totvsSerie.CODFILIAL || totvsSerie.codfilial,
      anoLetivo: totvsSerie.ANOLETIVO || totvsSerie.anoLetivo,
      codSerie: totvsSerie.CODSERIE || totvsSerie.codSerie,
      serie: totvsSerie.SERIE || totvsSerie.serie,
      abSerie: totvsSerie.ABSERIE || totvsSerie.abSerie
    };
  }

  /**
   * Mapear dados de turma do TOTVS para formato local
   */
  mapTurmaToLocal(totvsTurma) {
    return {
      codTurma: totvsTurma.CODTURMA || totvsTurma.codturma,
      turma: totvsTurma.TURMA || totvsTurma.turma,
      codSerie: totvsTurma.CODSERIE || totvsTurma.codserie,
      anoLetivo: totvsTurma.ANOLETIVO || totvsTurma.anoLetivo,
      turno: totvsTurma.TURNO || totvsTurma.turno,
      codFilial: totvsTurma.CODFILIAL || totvsTurma.codFilial
    };
  }

  /**
   * Resolver ID da filial baseado no código TOTVS
   */
  resolverIdFilial(codFilial) {
    // Mapear códigos TOTVS para IDs locais
    const mapeamento = {
      '1': 1,  // Ajustar conforme seu banco
      '2': 2,
      '3': 3,
      '4': 4
    };
    return mapeamento[codFilial] || null;
  }
}

module.exports = new TotvsService();
