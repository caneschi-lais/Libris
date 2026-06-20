import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { criarLivro, validarLivro } from '../models/book';

const STORAGE_KEY = 'libris_books';

/**
 * Hook especializado para gerenciar o estado dos livros do Libris e expor métricas agregadas.
 */
export function useBooks() {
  const [books, setBooks] = useLocalStorage(STORAGE_KEY, []);

  /**
   * Adiciona um novo livro ao estado.
   * 
   * @param {Object} dadosLivro - Dados brutos vindos do formulário
   * @returns {{ success: boolean, book?: Object, errors?: string[] }}
   */
  const adicionarLivro = useCallback((dadosLivro) => {
    try {
      const novoLivro = criarLivro(dadosLivro);
      const { valido, erros } = validarLivro(novoLivro);

      if (!valido) {
        return { success: false, errors: erros };
      }

      setBooks((prevBooks) => [...prevBooks, novoLivro]);
      return { success: true, book: novoLivro };
    } catch (err) {
      console.error("Erro ao adicionar livro:", err);
      return { success: false, errors: [err.message] };
    }
  }, [setBooks]);

  /**
   * Atualiza as informações de um livro existente.
   * 
   * @param {string} id - ID do livro a ser atualizado
   * @param {Object} novosDados - Dados a serem atualizados/mesclados
   * @returns {{ success: boolean, book?: Object, errors?: string[] }}
   */
  const atualizarLivro = useCallback((id, novosDados) => {
    let resultado = { success: false, errors: ['Livro não encontrado.'] };

    setBooks((prevBooks) => {
      const index = prevBooks.findIndex((b) => b.id === id);
      if (index === -1) return prevBooks;

      const livroExistente = prevBooks[index];
      // Mescla os dados mantendo o ID
      const livroMesclado = criarLivro({ ...livroExistente, ...novosDados, id });
      const { valido, erros } = validarLivro(livroMesclado);

      if (!valido) {
        resultado = { success: false, errors: erros };
        return prevBooks;
      }

      const novosLivros = [...prevBooks];
      novosLivros[index] = livroMesclado;
      resultado = { success: true, book: livroMesclado };
      return novosLivros;
    });

    return resultado;
  }, [setBooks]);

  /**
   * Remove um livro da lista por ID.
   * 
   * @param {string} id - ID do livro a ser removido
   */
  const removerLivro = useCallback((id) => {
    setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
  }, [setBooks]);

  /**
   * Busca um livro pelo ID.
   * 
   * @param {string} id - ID do livro
   * @returns {Object|undefined} O livro encontrado
   */
  const buscarLivroPorId = useCallback((id) => {
    return books.find((b) => b.id === id);
  }, [books]);

  /**
   * Métricas calculadas em tempo real com memoização para evitar re-computações desnecessárias.
   */
  const metrics = useMemo(() => {
    const totalLivros = books.length;
    let livrosLidos = 0;
    let livrosLendo = 0;
    let livrosNaoLidos = 0;
    let totalPaginasLidas = 0;
    let totalPaginasEstimadas = 0;
    let livrosPossuidos = 0;
    let livrosFisicos = 0;
    let livrosDigitais = 0;

    const porMidia = {
      Livro: 0,
      HQ: 0,
      Mangá: 0,
      Audiobook: 0
    };

    books.forEach((livro) => {
      // Status de Leitura
      if (livro.status_leitura === 'Lido') livrosLidos++;
      else if (livro.status_leitura === 'Lendo') livrosLendo++;
      else livrosNaoLidos++;

      // Páginas Lidas & Totais
      totalPaginasLidas += livro.pagina_atual || 0;
      totalPaginasEstimadas += livro.total_paginas || 0;

      // Posse do Livro & Formatos
      if (livro.possui_o_livro) {
        livrosPossuidos++;
        if (livro.formato === 'Físico') livrosFisicos++;
        if (livro.formato === 'Digital') livrosDigitais++;
      }

      // Tipo de Mídia
      if (porMidia[livro.tipo_midia] !== undefined) {
        porMidia[livro.tipo_midia]++;
      }
    });

    const percentualLido = totalPaginasEstimadas > 0
      ? Math.round((totalPaginasLidas / totalPaginasEstimadas) * 100)
      : 0;

    return {
      totalLivros,
      livrosLidos,
      livrosLendo,
      livrosNaoLidos,
      totalPaginasLidas,
      totalPaginasEstimadas,
      percentualLido,
      livrosPossuidos,
      porMidia,
      porFormato: {
        Físico: livrosFisicos,
        Digital: livrosDigitais
      }
    };
  }, [books]);

  return {
    books,
    adicionarLivro,
    atualizarLivro,
    removerLivro,
    buscarLivroPorId,
    metrics
  };
}
