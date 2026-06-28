/**
 * @typedef {'Livro' | 'HQ' | 'Mangá' | 'Audiobook'} TipoMidia
 * @typedef {'Não Lido' | 'Lendo' | 'Lido'} StatusLeitura
 * @typedef {'Físico' | 'Digital'} FormatoLivro
 * 
 * @typedef {Object} Livro
 * @property {number} [id] - Identificador único incremental (definido pelo servidor)
 * @property {string} titulo - Título da obra
 * @property {string} autor - Autor da obra
 * @property {TipoMidia} tipo_midia - Tipo de mídia do livro
 * @property {number} total_paginas - Quantidade total de páginas (ou minutos para Audiobook)
 * @property {StatusLeitura} status_leitura - Progresso atual da leitura
 * @property {number} pagina_atual - Página atual (padrão 0)
 * @property {string} [data_inicio] - Data de início da leitura (formato ISO YYYY-MM-DD ou semelhante, opcional)
 * @property {string} [data_termino] - Data de término da leitura (formato ISO YYYY-MM-DD ou semelhante, opcional)
 * @property {boolean} possui_o_livro - Indica se o usuário possui a cópia física/digital
 * @property {FormatoLivro} [formato] - Formato do livro (Físico ou Digital) - Apenas se possui_o_livro for true
 * @property {boolean} e_colecao - Indica se faz parte de uma coleção
 * @property {string} [nome_colecao] - Nome da coleção, se aplicável
 * @property {string|number} [volume_colecao] - Volume da coleção, se aplicável
 */

export const TIPOS_MIDIA = ['Livro', 'HQ', 'Mangá', 'Audiobook'];
export const STATUS_LEITURA = ['Não Lido', 'Lendo', 'Lido'];
export const FORMATOS = ['Físico', 'Digital'];

/**
 * Cria uma estrutura padrão para um livro com os valores limpos e higienizados.
 * 
 * @param {Partial<Livro>} dados - Dados iniciais passados pelo formulário ou estado
 * @returns {Livro} O livro completo formatado
 */
export function criarLivro(dados = {}) {
  const possui = !!dados.possui_o_livro;
  const eColecao = !!dados.e_colecao;

  return {
    id: dados.id !== undefined && dados.id !== null ? Number(dados.id) : undefined,
    titulo: (dados.titulo || '').trim(),
    autor: (dados.autor || '').trim(),
    tipo_midia: TIPOS_MIDIA.includes(dados.tipo_midia) ? dados.tipo_midia : 'Livro',
    total_paginas: Math.max(1, Number(dados.total_paginas) || 0),
    status_leitura: STATUS_LEITURA.includes(dados.status_leitura) ? dados.status_leitura : 'Não Lido',
    pagina_atual: Math.max(0, Number(dados.pagina_atual) || 0),
    data_inicio: dados.data_inicio || null,
    data_termino: dados.data_termino || null,
    possui_o_livro: possui,
    formato: possui && FORMATOS.includes(dados.formato) ? dados.formato : null,
    e_colecao: eColecao,
    nome_colecao: eColecao ? (dados.nome_colecao || '').trim() : null,
    volume_colecao: eColecao ? dados.volume_colecao || '' : null,
  };
}

/**
 * Valida a integridade de um objeto Livro antes de persistência.
 * 
 * @param {Livro} livro - O livro a ser validado
 * @returns {{ valido: boolean, erros: string[] }} Resumo da validação
 */
export function validarLivro(livro) {
  const erros = [];

  if (!livro.titulo || livro.titulo.trim() === '') {
    erros.push('O título é obrigatório.');
  }

  if (!livro.autor || livro.autor.trim() === '') {
    erros.push('O autor é obrigatório.');
  }

  if (!TIPOS_MIDIA.includes(livro.tipo_midia)) {
    erros.push(`Tipo de mídia inválido. Deve ser um de: ${TIPOS_MIDIA.join(', ')}.`);
  }

  if (livro.total_paginas <= 0) {
    erros.push('O total de páginas deve ser maior que zero.');
  }

  if (!STATUS_LEITURA.includes(livro.status_leitura)) {
    erros.push(`Status de leitura inválido. Deve ser um de: ${STATUS_LEITURA.join(', ')}.`);
  }

  if (livro.pagina_atual < 0) {
    erros.push('A página atual não pode ser negativa.');
  }

  if (livro.pagina_atual > livro.total_paginas) {
    erros.push('A página atual não pode ser maior que o total de páginas.');
  }

  if (livro.status_leitura === 'Lido' && livro.pagina_atual < livro.total_paginas) {
    // Se está lido, força o progresso para o total para consistência de dados
    livro.pagina_atual = livro.total_paginas;
  }

  if (livro.status_leitura === 'Lendo' && livro.pagina_atual === livro.total_paginas) {
    // Se atingiu o final, o status idealmente seria Lido (mas mantemos flexibilidade ou avisamos)
  }

  if (livro.possui_o_livro && !livro.formato) {
    erros.push('Se você possui o livro, defina o formato (Físico ou Digital).');
  }

  if (livro.e_colecao && (!livro.nome_colecao || livro.nome_colecao.trim() === '')) {
    erros.push('Se é parte de uma coleção, o nome da coleção é obrigatório.');
  }

  return {
    valido: erros.length === 0,
    erros
  };
}

// Removidos métodos de compressão/descompressão do IndexedDB

