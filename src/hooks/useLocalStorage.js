import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para gerenciar estado persistido no LocalStorage.
 * 
 * @template T
 * @param {string} key A chave sob a qual o valor será salvo no LocalStorage
 * @param {T | (() => T)} initialValue O valor inicial (ou função que retorna o valor inicial) se a chave não existir
 * @returns {[T, (value: T | ((val: T) => T)) => void]} O estado atual e a função para atualizá-lo
 */
export function useLocalStorage(key, initialValue) {
  // Função para ler do LocalStorage com tratamento de erros
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      
      // Se não houver dados, inicializar com valor padrão
      const valueToStore = typeof initialValue === 'function' ? initialValue() : initialValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
    } catch (error) {
      console.warn(`Erro ao ler chave "${key}" do LocalStorage:`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  }, [key, initialValue]);

  // Manter estado interno
  const [storedValue, setStoredValue] = useState(readValue);

  // Retorna uma versão estável da função de atualização (semelhante ao useState)
  const setValue = useCallback((value) => {
    try {
      setStoredValue((prevStoredValue) => {
        // Permite que o novo valor seja uma função de callback (como o setState clássico)
        const valueToStore = value instanceof Function ? value(prevStoredValue) : value;
        
        // Salva no LocalStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          
          // Disparar evento de armazenamento customizado para atualizar outras instâncias do hook na mesma janela
          window.dispatchEvent(new Event('local-storage'));
        }
        
        return valueToStore;
      });
    } catch (error) {
      console.error(`Erro ao salvar chave "${key}" no LocalStorage:`, error);
    }
  }, [key]);

  // Efeito para sincronizar caso o valor mude em outra aba/componente
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Sincroniza abas diferentes
    window.addEventListener('storage', handleStorageChange);
    
    // Sincroniza componentes no mesmo documento usando nosso evento customizado
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
}
