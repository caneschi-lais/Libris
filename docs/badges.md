# 🏆 Sistema de Conquistas & Medalhas — Libris

O Libris possui um sistema de gamificação local integrado que analisa suas leituras e desbloqueia conquistas automaticamente de acordo com as obras na sua estante.

> [!TIP]
> **Como adicionar suas artes personalizadas:**
> 1. Desenhe ou gere imagens quadradas no formato **PNG** (ex: `256x256px` com fundo transparente).
> 2. Crie uma pasta chamada `badges` dentro do diretório `public` na raiz do seu projeto (`public/badges/`).
> 3. Salve as imagens com os nomes exatos listados na coluna **Arquivo de Imagem** abaixo.
> 
> *Nota: Enquanto as imagens não existirem na pasta, o sistema exibirá o **Emoji de Fallback** com a cor ativa do tema!*

---

## 🎖️ Catálogo Geral de Medalhas

| # | Conquista | Descrição | Regra de Desbloqueio | Arquivo de Imagem | Fallback |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 1 | **Iniciando a Jornada** | Concluiu sua primeira leitura no sistema. | `livrosLidos >= 1` | `jornada.png` | 🌌 |
| 2 | **Devorador de Gigantes** | Concluiu um livro ou mídia com mais de 500 páginas/minutos. | `total_paginas >= 500` (concluído) | `gigante.png` | 👑 |
| 3 | **Veloz e Furioso** | Começou e terminou uma obra inteira no mesmo dia. | `data_inicio === data_termino` (não nulos) | `veloz.png` | ⚡ |
| 4 | **Leitor Eclético** | Concluiu obras de todas as 4 mídias suportadas. | Pelo menos um de cada tipo de mídia lido | `ecletico.png` | 🧭 |
| 5 | **Maratonista Literário** | Concluiu 3 ou mais leituras no mesmo mês do mesmo ano. | 3+ conclusões no mesmo mês | `maratonista.png` | 🏃 |
| 6 | **Colecionador Sênior** | Possui 10 ou mais livros em sua coleção pessoal. | `livrosPossuidos >= 10` | `colecionador.png` | 💎 |
| 7 | **Mestre das Sagas** | Concluiu pelo menos 3 volumes de uma mesma coleção. | 3+ volumes lidos na mesma coleção | `sagas.png` | 📚 |
| 8 | **Ouvinte por Excelência** | Concluiu 5 ou mais audiobooks no sistema. | 5+ audiobooks lidos | `ouvinte.png` | 🎧 |
| 9 | **Bibliotecário do Futuro** | Sua estante digital possui mais de 15 e-books cadastrados. | 15+ e-books possuídos (`Digital`) | `digital.png` | 💾 |
| 10 | **Fã de Carteirinha** | Se aprofundou nas obras de um autor, lendo 3+ livros dele. | 3+ livros lidos do mesmo autor | `fa.png` | 🎯 |
| 11 | **Escalador de Montanhas** | Alcançou a marca de 5.000 páginas ou minutos lidos. | Soma acumulada lida `>= 5000` | `montanha.png` | ⛰️ |
| 12 | **Sonhador Planejado** | Alimenta sua lista de desejos com 10+ itens planejados. | 10+ itens marcados como não possuídos | `desejos.png` | 🛒 |
| 13 | **Colecionador Físico** | Prefere o cheiro do papel! Possui 15+ livros físicos. | 15+ livros possuídos (`Físico`) | `fisico.png` | 📕 |
| 14 | **Fanático por Quadrinhos** | Concluiu 5 ou mais obras do tipo HQ ou Mangá. | 5+ HQs ou Mangás lidos | `quadrinhos.png` | 🎨 |

---

## ⚙️ Regras Detalhadas para Programação (JSON/Mongoose)

### 1. Iniciando a Jornada
*   **Trigger**: No loop de verificação de status.
*   **Filtro**: `status_leitura === 'Lido'`.

### 2. Devorador de Gigantes
*   **Trigger**: Qualquer livro marcado como `Lido` onde `total_paginas >= 500`.

### 3. Veloz e Furioso
*   **Trigger**: Livro concluído onde `data_inicio === data_termino` e ambos sejam datas válidas e preenchidas (ex: `"2026-06-28"`).

### 4. Leitor Eclético
*   **Trigger**: O conjunto de tipos de mídia (`tipo_midia`) dos livros terminados deve conter os 4 valores: `['Livro', 'HQ', 'Mangá', 'Audiobook']`.

### 5. Maratonista Literário
*   **Trigger**: Agrupamento por ano e mês do campo `data_termino` (ex: `substring(0, 7)`) dos livros com status `Lido`. Algum grupo deve possuir tamanho `>= 3`.

### 6. Colecionador Sênior
*   **Trigger**: Contagem simples de obras onde `possui_o_livro === true`.

### 7. Mestre das Sagas
*   **Trigger**: Agrupamento dos livros concluídos (`Lido`) onde `e_colecao === true` pelo campo `nome_colecao`. Se houver algum nome de coleção repetido 3 ou mais vezes, conquista liberada.

### 8. Ouvinte por Excelência
*   **Trigger**: Contagem de livros com `status_leitura === 'Lido'` e `tipo_midia === 'Audiobook'` `>= 5`.

### 9. Bibliotecário do Futuro
*   **Trigger**: Contagem de livros com `possui_o_livro === true` e `formato === 'Digital'` `>= 15`.

### 10. Fã de Carteirinha
*   **Trigger**: Agrupamento de livros com status `Lido` pelo campo `autor`. Se a quantidade de algum autor for `>= 3`, a medalha é concedida.

### 11. Escalador de Montanhas
*   **Trigger**: Soma das páginas lidas de livros lidos (`total_paginas`) e livros lendo (`pagina_atual`) deve ser `>= 5000`.

### 12. Sonhador Planejado
*   **Trigger**: Contagem de livros com `possui_o_livro === false` `>= 10`.

### 13. Colecionador Físico
*   **Trigger**: Contagem de livros com `possui_o_livro === true` e `formato === 'Físico'` `>= 15`.

### 14. Fanático por Quadrinhos
*   **Trigger**: Contagem de livros com status `Lido` onde `tipo_midia === 'HQ'` ou `tipo_midia === 'Mangá'` `>= 5`.