import React, { createContext, useContext } from 'react';
import { useBooks } from '../hooks/useBooks';

// Criação do Contexto para os livros
const BooksContext = createContext(undefined);

/**
 * Provider do Contexto de Livros que disponibiliza o estado useBooks
 * para todos os componentes filhos da árvore de renderização.
 */
export function BooksProvider({ children }) {
  const booksData = useBooks();

  return (
    <BooksContext.Provider value={booksData}>
      {children}
    </BooksContext.Provider>
  );
}

/**
 * Hook customizado para consumir o contexto de livros de forma simples e rápida.
 * 
 * @returns {import('../hooks/useBooks').useBooks} O estado e ações expostas pelo useBooks
 */
export function useBooksContext() {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooksContext deve ser utilizado dentro de um BooksProvider');
  }
  return context;
}
