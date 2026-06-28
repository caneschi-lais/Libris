import { useState, useEffect, useMemo, useCallback } from 'react';
import { criarLivro, validarLivro } from '../models/book';
import { calculateMetrics } from '../utils/metrics';

const API_URL = 'http://localhost:5000/api';

/**
 * Hook especializado para gerenciar o estado dos livros do Libris integrando com o backend MongoDB e expor métricas agregadas.
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega todos os livros do banco de dados na inicialização
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao obter livros do servidor backend.');
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[Libris] Erro ao carregar livros do MongoDB:", err);
        setIsLoading(false);
      });
  }, []);

  /**
   * Adiciona um novo livro ao banco de dados e sincroniza o estado.
   * 
   * @param {Object} dadosLivro - Dados brutos vindos do formulário
   * @returns {Promise<{ success: boolean, book?: Object, errors?: string[] }>}
   */
  const adicionarLivro = useCallback(async (dadosLivro) => {
    try {
      const novoLivro = criarLivro(dadosLivro);
      const { valido, erros } = validarLivro(novoLivro);

      if (!valido) {
        return { success: false, errors: erros };
      }

      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoLivro)
      });

      if (!response.ok) {
        const errData = await response.json();
        return { success: false, errors: [errData.message || 'Erro ao salvar livro no MongoDB.'] };
      }

      const savedBook = await response.json();
      setBooks((prevBooks) => [...prevBooks, savedBook]);
      return { success: true, book: savedBook };
    } catch (err) {
      console.error("Erro ao adicionar livro:", err);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Adiciona múltiplos livros ao banco de dados e sincroniza o estado.
   * 
   * @param {Array<Object>} listaDeLivros - Lista de dados brutos de livros
   * @returns {Promise<{ success: boolean, books?: Array<Object>, errors?: string[] }>}
   */
  const adicionarLivros = useCallback(async (listaDeLivros) => {
    try {
      const novosLivros = [];
      const errosAcumulados = [];

      listaDeLivros.forEach((dadosLivro, index) => {
        const novoLivro = criarLivro(dadosLivro);
        const { valido, erros } = validarLivro(novoLivro);

        if (!valido) {
          errosAcumulados.push(`Item ${index + 1} (${dadosLivro.titulo || 'Sem título'}): ${erros.join(', ')}`);
        } else {
          novosLivros.push(novoLivro);
        }
      });

      if (errosAcumulados.length > 0) {
        return { success: false, errors: errosAcumulados };
      }

      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novosLivros)
      });

      if (!response.ok) {
        const errData = await response.json();
        return { success: false, errors: [errData.message || 'Erro ao salvar lote no MongoDB.'] };
      }

      const savedBooks = await response.json();
      setBooks((prevBooks) => [...prevBooks, ...savedBooks]);
      return { success: true, books: savedBooks };
    } catch (err) {
      console.error("Erro ao adicionar livros em lote:", err);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Importa a lista completa de livros no banco de dados, limpando dados antigos (restauração de backup).
   * 
   * @param {Array<Object>} novaLista - Lista completa de livros a importar
   */
  const importarLivros = useCallback(async (novaLista) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/books/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaLista)
      });

      if (!response.ok) {
        let message = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          message = errData.message || message;
        } catch (e) {
          try {
            const text = await response.text();
            if (text && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
              message = text;
            }
          } catch (eText) {
            console.error("Falha ao ler corpo do erro como texto:", eText);
          }
        }
        alert('Erro ao importar backup no servidor: ' + message);
        setIsLoading(false);
        return;
      }

      const imported = await response.json();
      setBooks(imported);
      setIsLoading(false);
    } catch (err) {
      console.error("Erro ao importar backup:", err);
      alert("Erro de conexão ao enviar backup para o servidor: " + err.message);
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza as informações de um livro existente no banco de dados.
   * 
   * @param {number} id - ID numérico do livro a ser atualizado
   * @param {Object} novosDados - Dados a serem atualizados
   * @returns {Promise<{ success: boolean, book?: Object, errors?: string[] }>}
   */
  const atualizarLivro = useCallback(async (id, novosDados) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novosDados)
      });

      if (!response.ok) {
        const errData = await response.json();
        return { success: false, errors: [errData.message || 'Erro ao atualizar livro no MongoDB.'] };
      }

      const updatedBook = await response.json();
      setBooks((prevBooks) => {
        const index = prevBooks.findIndex((b) => b.id === id);
        if (index === -1) return prevBooks;
        const novosLivros = [...prevBooks];
        novosLivros[index] = updatedBook;
        return novosLivros;
      });

      return { success: true, book: updatedBook };
    } catch (err) {
      console.error("Erro ao atualizar livro:", err);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Remove um livro da lista por ID de negócio numérico.
   * 
   * @param {number} id - ID do livro a ser removido
   */
  const removerLivro = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Erro ao deletar livro do servidor:", errData.message);
        return;
      }

      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Erro ao remover livro:", err);
    }
  }, []);

  /**
   * Busca um livro pelo ID de negócio numérico.
   * 
   * @param {number} id - ID numérico do livro
   * @returns {Object|undefined} O livro encontrado
   */
  const buscarLivroPorId = useCallback((id) => {
    return books.find((b) => b.id === id);
  }, [books]);

  /**
   * Métricas calculadas em tempo real a partir da estante local sincronizada.
   */
  const metrics = useMemo(() => calculateMetrics(books), [books]);

  return {
    books,
    adicionarLivro,
    adicionarLivros,
    importarLivros,
    atualizarLivro,
    removerLivro,
    buscarLivroPorId,
    metrics,
    isLoading
  };
}
