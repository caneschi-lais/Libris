/**
 * Utilitário contendo a lógica matemática pura para calcular métricas gerais da estante
 * de leitura e verificar regras de desbloqueio das 14 Conquistas (Badges) do Libris.
 * 
 * @param {Array<Object>} books - Lista de livros sincronizada
 * @returns {Object} As métricas compiladas (total de livros, lidos, páginas, ritmo e conquistas)
 */
export function calculateMetrics(books) {
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

  const parseDate = (dStr) => {
    if (!dStr) return null;
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? null : d;
  };

  let totalDaysSpent = 0;
  let booksWithDatesCount = 0;
  let fastestBook = null;
  let fastestDays = Infinity;
  let biggestBook = null;
  let biggestPages = 0;

  books.forEach((livro) => {
    // Status de Leitura
    if (livro.status_leitura === 'Lido') {
      livrosLidos++;
      
      // Maior livro concluído
      if (livro.total_paginas > biggestPages) {
        biggestPages = livro.total_paginas;
        biggestBook = livro;
      }

      // Tempo de leitura
      const inicio = parseDate(livro.data_inicio);
      const termino = parseDate(livro.data_termino);
      if (inicio && termino) {
        const diffTime = termino.getTime() - inicio.getTime();
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        totalDaysSpent += diffDays;
        booksWithDatesCount++;

        if (diffDays < fastestDays) {
          fastestDays = diffDays;
          fastestBook = livro;
        }
      }
    }
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

  const tempoMedio = booksWithDatesCount > 0 ? Math.round(totalDaysSpent / booksWithDatesCount) : 0;

  // === CÁLCULO DE CONQUISTAS (BADGES) ===
  
  // 1. Iniciando a Jornada (Pelo menos 1 lido)
  const badgeJornada = livrosLidos >= 1;

  // 2. Devorador de Gigantes (Lido com >= 500 páginas)
  const badgeGigante = books.some(b => b.status_leitura === 'Lido' && b.total_paginas >= 500);

  // 3. Veloz e Furioso (Lido com data_inicio === data_termino e não nulos)
  const badgeVeloz = books.some(b => 
    b.status_leitura === 'Lido' && 
    b.data_inicio && 
    b.data_termino && 
    b.data_inicio === b.data_termino
  );

  // 4. Leitor Eclético (Ter lido pelo menos 1 de cada mídia)
  const midiasLidas = new Set(
    books.filter(b => b.status_leitura === 'Lido').map(b => b.tipo_midia)
  );
  const badgeEcletico = midiasLidas.has('Livro') && 
                        midiasLidas.has('HQ') && 
                        midiasLidas.has('Mangá') && 
                        midiasLidas.has('Audiobook');

  // 5. Maratonista Literário (3 concluídos no mesmo mês)
  const conclusoesPorMes = {};
  books.forEach(b => {
    if (b.status_leitura === 'Lido' && b.data_termino) {
      const mesAno = b.data_termino.substring(0, 7); // YYYY-MM
      if (mesAno.length === 7) {
        conclusoesPorMes[mesAno] = (conclusoesPorMes[mesAno] || 0) + 1;
      }
    }
  });
  const maxConclusoesNoMes = Object.values(conclusoesPorMes).length > 0
    ? Math.max(...Object.values(conclusoesPorMes))
    : 0;
  const badgeMaratonista = maxConclusoesNoMes >= 3;

  // 6. Colecionador Sênior (Possui >= 10 livros)
  const badgeColecionador = livrosPossuidos >= 10;

  // 7. Mestre das Sagas (Concluiu pelo menos 3 volumes de uma mesma coleção)
  const colecoesConcluidas = {};
  books.forEach(b => {
    if (b.status_leitura === 'Lido' && b.e_colecao && b.nome_colecao) {
      const nome = b.nome_colecao.trim().toLowerCase();
      colecoesConcluidas[nome] = (colecoesConcluidas[nome] || 0) + 1;
    }
  });
  const maxVolumesColecao = Object.values(colecoesConcluidas).length > 0
    ? Math.max(...Object.values(colecoesConcluidas))
    : 0;
  const badgeSagas = maxVolumesColecao >= 3;

  // 8. Ouvinte por Excelência (Concluiu 5+ audiobooks)
  const audiobooksLidosCount = books.filter(b => b.status_leitura === 'Lido' && b.tipo_midia === 'Audiobook').length;
  const badgeOuvinte = audiobooksLidosCount >= 5;

  // 9. Bibliotecário do Futuro (Possui 15+ livros digitais)
  const digitalPossuidosCount = books.filter(b => b.possui_o_livro && b.formato === 'Digital').length;
  const badgeDigital = digitalPossuidosCount >= 15;

  // 10. Fã de Carteirinha (Lido 3+ livros do mesmo autor)
  const autoresConcluidos = {};
  books.forEach(b => {
    if (b.status_leitura === 'Lido' && b.autor) {
      const autor = b.autor.trim().toLowerCase();
      autoresConcluidos[autor] = (autoresConcluidos[autor] || 0) + 1;
    }
  });
  const maxObrasAutor = Object.values(autoresConcluidos).length > 0
    ? Math.max(...Object.values(autoresConcluidos))
    : 0;
  const badgeFa = maxObrasAutor >= 3;

  // 11. Escalador de Montanhas (5.000 páginas ou minutos lidas)
  const badgeMontanha = totalPaginasLidas >= 5000;

  // 12. Sonhador Planejado (10+ itens marcados como não possuídos)
  const desejosCount = books.filter(b => !b.possui_o_livro).length;
  const badgeDesejos = desejosCount >= 10;

  // 13. Colecionador Físico (15+ livros físicos possuídos)
  const fisicoPossuidosCount = books.filter(b => b.possui_o_livro && b.formato === 'Físico').length;
  const badgeFisico = fisicoPossuidosCount >= 15;

  // 14. Fanático por Quadrinhos (5+ HQs ou Mangás concluídos)
  const quadrinhosLidosCount = books.filter(b => b.status_leitura === 'Lido' && (b.tipo_midia === 'HQ' || b.tipo_midia === 'Mangá')).length;
  const badgeQuadrinhos = quadrinhosLidosCount >= 5;

  const conquistas = [
    {
      id: 'jornada',
      name: 'Iniciando a Jornada',
      description: 'Concluiu sua primeira leitura no sistema.',
      unlocked: badgeJornada,
      badgeName: 'jornada.png',
      emoji: '🌌',
      current: livrosLidos,
      target: 1
    },
    {
      id: 'gigante',
      name: 'Devorador de Gigantes',
      description: 'Concluiu um livro ou mídia com mais de 500 páginas/minutos.',
      unlocked: badgeGigante,
      badgeName: 'gigante.png',
      emoji: '👑',
      current: books.filter(b => b.status_leitura === 'Lido').reduce((max, b) => Math.max(max, b.total_paginas), 0),
      target: 500
    },
    {
      id: 'veloz',
      name: 'Veloz e Furioso',
      description: 'Começou e terminou uma obra inteira no mesmo dia.',
      unlocked: badgeVeloz,
      badgeName: 'veloz.png',
      emoji: '⚡',
      current: badgeVeloz ? 1 : 0,
      target: 1
    },
    {
      id: 'ecletico',
      name: 'Leitor Eclético',
      description: 'Concluiu pelo menos uma obra de cada tipo de mídia (Livro, HQ, Mangá e Audiobook).',
      unlocked: badgeEcletico,
      badgeName: 'ecletico.png',
      emoji: '🧭',
      current: midiasLidas.size,
      target: 4
    },
    {
      id: 'maratonista',
      name: 'Maratonista Literário',
      description: 'Concluiu 3 ou mais livros em um único mês.',
      unlocked: badgeMaratonista,
      badgeName: 'maratonista.png',
      emoji: '🏃',
      current: maxConclusoesNoMes,
      target: 3
    },
    {
      id: 'colecionador',
      name: 'Colecionador Sênior',
      description: 'Adicionou 10 ou mais livros à sua coleção pessoal.',
      unlocked: badgeColecionador,
      badgeName: 'colecionador.png',
      emoji: '💎',
      current: livrosPossuidos,
      target: 10
    },
    {
      id: 'sagas',
      name: 'Mestre das Sagas',
      description: 'Demonstrou compromisso ao concluir pelo menos 3 volumes de uma mesma coleção.',
      unlocked: badgeSagas,
      badgeName: 'sagas.png',
      emoji: '📚',
      current: maxVolumesColecao,
      target: 3
    },
    {
      id: 'ouvinte',
      name: 'Ouvinte por Excelência',
      description: 'Devorou histórias através dos fones de ouvido, concluindo 5 audiobooks.',
      unlocked: badgeOuvinte,
      badgeName: 'ouvinte.png',
      emoji: '🎧',
      current: audiobooksLidosCount,
      target: 5
    },
    {
      id: 'digital',
      name: 'Bibliotecário do Futuro',
      description: 'Sua estante digital está expandindo! Possui mais de 15 livros no formato digital.',
      unlocked: badgeDigital,
      badgeName: 'digital.png',
      emoji: '💾',
      current: digitalPossuidosCount,
      target: 15
    },
    {
      id: 'fa',
      name: 'Fã de Carteirinha',
      description: 'Se aprofundou na escrita de um autor específico, lendo 3 ou mais obras dele.',
      unlocked: badgeFa,
      badgeName: 'fa.png',
      emoji: '🎯',
      current: maxObrasAutor,
      target: 3
    },
    {
      id: 'montanha',
      name: 'Escalador de Montanhas',
      description: 'Alcançou a impressionante marca histórica de 5.000 páginas/minutos lidas no sistema.',
      unlocked: badgeMontanha,
      badgeName: 'montanha.png',
      emoji: '⛰️',
      current: totalPaginasLidas,
      target: 5000
    },
    {
      id: 'desejos',
      name: 'Sonhador Planejado',
      description: 'Alimenta sua lista de desejos constantemente, mapeando o que quer ler no futuro.',
      unlocked: badgeDesejos,
      badgeName: 'desejos.png',
      emoji: '🛒',
      current: desejosCount,
      target: 10
    },
    {
      id: 'fisico',
      name: 'Colecionador Físico',
      description: 'Prefere o cheiro do papel! Possui 15 ou mais livros no formato físico.',
      unlocked: badgeFisico,
      badgeName: 'fisico.png',
      emoji: '📕',
      current: fisicoPossuidosCount,
      target: 15
    },
    {
      id: 'quadrinhos',
      name: 'Fanático por Quadrinhos',
      description: 'Concluiu 5 ou mais obras do tipo HQ ou Mangá.',
      unlocked: badgeQuadrinhos,
      badgeName: 'quadrinhos.png',
      emoji: '🎨',
      current: quadrinhosLidosCount,
      target: 5
    }
  ];

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
    },
    ritmo: {
      tempoMedio,
      fastestBookTitle: fastestBook ? fastestBook.titulo : null,
      fastestDays: fastestBook ? fastestDays : null,
      biggestBookTitle: biggestBook ? biggestBook.titulo : null,
      biggestPages: biggestBook ? biggestPages : null,
    },
    conquistas
  };
}
