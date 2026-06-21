import fs from 'fs';
import { criarLivro, validarLivro } from './src/models/book.js';

try {
  const caminho = './livros.json';
  if (!fs.existsSync(caminho)) {
    console.error(`Erro: Arquivo ${caminho} não encontrado.`);
    process.exit(1);
  }

  const content = fs.readFileSync(caminho, 'utf8');
  const livros = JSON.parse(content);
  
  console.log(`Lendo ${livros.length} registros de ${caminho}...`);
  
  const livrosAjustados = [];
  const errosModificacao = [];

  livros.forEach((item, index) => {
    // Passar pelo construtor do modelo do Libris para garantir que os dados estejam no formato correto
    const livro = criarLivro({
      ...item,
      // Se não tiver ID ou for vazio, o criarLivro gerará automaticamente um UUID.
      id: item.id && item.id.trim() !== '' ? item.id : undefined
    });

    // Se o status for "Lido" mas não tiver data_termino e tiver data_inicio, 
    // ou se tiver alguma pequena inconsistência, o validador pode nos apontar.
    const { valido, erros } = validarLivro(livro);
    if (!valido) {
      errosModificacao.push({
        indice: index,
        titulo: item.titulo || 'Sem título',
        erros
      });
      
      // Auto-correção de inconsistências comuns de progresso
      if (livro.status_leitura === 'Lido' && livro.pagina_atual < livro.total_paginas) {
        livro.pagina_atual = livro.total_paginas;
      }
    }

    livrosAjustados.push(livro);
  });

  // Salvar backup original antes de sobrescrever
  const dataHoje = new Date().toISOString().split('T')[0];
  fs.writeFileSync(`./livros_backup_original_${dataHoje}.json`, content, 'utf8');
  console.log(`Backup original salvo como livros_backup_original_${dataHoje}.json`);

  // Escrever arquivo corrigido
  fs.writeFileSync(caminho, JSON.stringify(livrosAjustados, null, 2), 'utf8');
  console.log(`Sucesso: ${livrosAjustados.length} livros processados e salvos em ${caminho}!`);

  if (errosModificacao.length > 0) {
    console.log(`\nInconsistências encontradas (e corrigidas quando possível): ${errosModificacao.length}`);
    console.log("Amostra das primeiras 5 inconsistências:");
    errosModificacao.slice(0, 5).forEach((e) => {
      console.log(`- Índice ${e.indice} ("${e.titulo}"): ${e.erros.join(' | ')}`);
    });
  }

} catch (err) {
  console.error("Erro fatal ao processar o arquivo JSON:", err);
}
