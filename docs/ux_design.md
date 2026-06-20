# Diretrizes de Design e UX 🎨

Este documento descreve as decisões de design, linguagem visual, acessibilidade e padrões de Experiência do Usuário (UX) adotados no **Libris**.

---

## 1. Identidade Visual e Estética Premium

O Libris foi projetado como um "refúgio digital". Diferente de redes sociais literárias barulhentas, ele adota uma interface limpa, focada em dados estruturados e com cores harmoniosas sobre fundo escuro.

### Paleta de Cores Curada
* **Fundo (`bg-base-100` / `bg-base-200`)**: Tons de grafite escuro (`#1e293b` e `#0f172a`), que evitam a fadiga ocular em leituras prolongadas.
* **Cor Primária (Indigo `#6366f1`)**: Usada para botões de ação prioritários, marcação de posse física e o logotipo oficial.
* **Cor Secundária (Purple `#a855f7` / `#14b8a6`)**: Representa mídias e progresso geral.
* **Cor de Destaque (Cyan `#06b6d4`)**: Usada para livros digitais.
* **Cor de Alerta/Aviso (Amber `#f59e0b`)**: Representa itens desejados/wishlist.

### Elementos Visuais
* **Glassmorphism**: Painéis e cartões de estatísticas contam com bordas finas semi-transparentes (`border-base-300`) e sombras projetadas suaves (`shadow-xl`), criando senso de profundidade.
* **Micro-animações**:
  * Transição suave ao passar o mouse sobre botões e tabelas (`transition-all duration-300`).
  * Efeito de entrada suave nas visualizações principais através da classe CSS `animate-fadeIn` do Tailwind.
  * Efeitos de foco suaves com bordas brilhantes (`focus:border-primary`).

---

## 2. Decisões de Experiência do Usuário (UX)

### Cabeçalho Dinâmico (Navbar Global)
* A barra de navegação principal é exibida apenas nas páginas internas (`/dashboard`, `/estante`, `/cadastro`). Na página inicial de entrada (`/`), ela é intencionalmente omitida, permitindo foco total na mensagem de boas-vindas e incentivo ao primeiro clique de "Entrar no Site".

### Estante Focada na Tabela e Organização
* O layout anterior dividia o espaço lateralmente com o formulário, sobrecarregando telas menores.
* O novo layout utiliza 100% da largura útil para exibir os livros cadastrados de forma limpa.
* **Ações Rápidas**: O botão "+ Novo Livro" fica estrategicamente posicionado no topo superior direito da tela, alinhado com o título principal. O botão de edição abre um modal inline para evitar trocas de contexto bruscas.

### Tratamento Inteligente de Informações (Tabela da Estante)
* **Coleções e Volumes**: Para evitar que títulos longos de coleções quebrem a estrutura da tabela, o componente trunca o nome exibindo apenas o início da coleção seguido por reticências (`...`) caso ultrapasse o espaço útil, enquanto o volume ganhou uma coluna individual para clareza visual.
* **Paginação Confortável**: A tabela limita a exibição a **8 itens por página** em visualizações desktop, o que garante que a página não estique excessivamente e os gráficos ou botões inferiores fiquem sempre facilmente alcançáveis.
* **Ordenação Direta**: Um seletor simples ao lado da busca permite ordenar reativamente por Título, Autor, Quantidade de Páginas ou Progresso de leitura em tempo real.

### Dashboard Reativo e Scoped
* O usuário pode alterar o escopo das estatísticas através de um seletor dinâmico de ano no topo. As estatísticas principais e o gráfico de conclusões temporais atualizam instantaneamente para fornecer uma visão clara do progresso daquele ciclo de leitura, mantendo a composição global da estante intacta para visualização do ecossistema de mídias e posse geral.
