# Libris 📚

**Libris** é um refúgio analítico e gerenciador de leituras pessoal projetado para os amantes de livros. Desenvolvido com foco no minimalismo e em métricas ricas, a plataforma permite catalogar livros, acompanhar o progresso de leitura e visualizar gráficos estatísticos detalhados de maneira privada, livre do ruído de redes sociais, algoritmos de recomendação ou pressões por avaliações.

---

## 🚀 Tecnologias Utilizadas

A aplicação foi construída sobre uma stack moderna e extremamente otimizada:

* **React (com Vite)**: Criação da interface reativa rápida e ambiente de desenvolvimento ágil.
* **React Router Dom (v6)**: Gerenciamento de rotas e navegação fluida em sistema multi-páginas.
* **React Context API**: Estado global centralizado (`BooksContext`) para compartilhamento reativo das leituras entre componentes e páginas, eliminando *prop drilling*.
* **Recharts**: Geração de gráficos estatísticos responsivos e dinâmicos de alta fidelidade visual.
* **Tailwind CSS & DaisyUI**: Design premium responsivo, estilizado com tema escuro elegante, efeitos de glassmorphism, transições suaves e componentes modernos.
* **Lucide React**: Biblioteca de ícones minimalistas e consistentes.
* **LocalStorage**: Persistência local e automática dos dados cadastrados no navegador.

---

## 📂 Estrutura do Projeto

O código está organizado seguindo práticas consolidadas de modularidade:

```
Libris/
├── src/
│   ├── assets/          # Recursos visuais (logotipo oficial, etc.)
│   ├── components/      # Componentes reutilizáveis de interface
│   │   ├── BookForm.jsx    # Formulário dinâmico de cadastro/edição
│   │   ├── BookTable.jsx   # Tabela avançada da estante com filtros, ordenação e paginação
│   │   ├── Dashboard.jsx   # Renderização das estatísticas e gráficos do Recharts
│   │   └── Navbar.jsx      # Barra de navegação global
│   ├── context/         # Provedor de contexto global
│   │   └── BooksContext.jsx # BooksProvider e hook useBooksContext
│   ├── hooks/           # Hooks customizados para regras de negócio e persistência
│   │   ├── useBooks.js     # Lógica centralizada do CRUD de livros e cálculo de métricas
│   │   └── useLocalStorage.js # Persistência genérica no LocalStorage
│   ├── models/          # Modelagem de dados e esquemas de validação
│   │   └── book.js         # Validações, definições de tipos e higienização (criarLivro)
│   ├── pages/           # Visualizações completas vinculadas a rotas
│   │   ├── Sobre.jsx       # Landing page (Sobre o Site) na rota "/"
│   │   ├── DashboardPage.jsx # Página do Painel de Estatísticas na rota "/dashboard"
│   │   ├── EstantePage.jsx   # Página principal da estante na rota "/estante"
│   │   └── CadastroPage.jsx  # Página dedicada para adição de novos livros na rota "/cadastro"
│   ├── App.jsx          # Configuração das rotas e layout geral da aplicação
│   ├── index.css        # Configurações do Tailwind CSS
│   └── main.jsx         # Ponto de entrada do React
├── index.html           # Arquivo HTML principal do app
├── vite.config.js       # Configurações de build e servidor do Vite (Porta 3000)
├── tailwind.config.js   # Configurações de extensões de estilo e temas
├── package.json         # Scripts, metadados e dependências do projeto
└── README.md            # Documentação do projeto (este arquivo)
```

---

## ✨ Principais Funcionalidades

### 1. Landing Page Minimalista (`/`)
Uma tela de boas-vindas sofisticada que apresenta o propósito livre do Libris. Conta com um visual premium utilizando um layout grid assimétrico, o logotipo oficial e um botão de ação proeminente para acessar o painel principal.

### 2. Painel Analítico de Estatísticas (`/dashboard`)
* **Filtro de Ano Dinâmico**: Permite filtrar e focar nas leituras realizadas em anos específicos ou visualizar o acumulado geral clicando em "Todos os Anos". Ao selecionar o período, os cartões de progresso e o gráfico de linha são recalculados automaticamente.
* **Cartões de Métricas Rápidas**: Exibe o *Total de Livros* ativos no período, a quantidade de livros *Concluídos (Lidos)* com a respectiva taxa de conclusão e o número total de *Páginas Lidas* (somando livros lidos e progresso de livros lendo).
* **Três Gráficos de Alta Fidelidade (Recharts)**:
  1. **Distribuição de Posse (Rosca)**: Divisão granular entre livros que você possui (**Tenho Físico** e **Tenho Digital**) versus livros desejados (**Quero/Lista de Desejos**).
  2. **Mídias na Estante (Barras)**: Quantidade de itens categorizados por tipo de mídia (Livro, HQ, Mangá e Audiobook).
  3. **Conclusões por Mês (Linha)**: Histórico mensal de leituras concluídas no ano ou período selecionado.

### 3. Minha Estante (`/estante`)
* **Tabela Completa de Livros**: Ocupa a largura total da tela com colunas claras contendo Título, Autor, Mídia, Progresso de Leitura, Formato, Volume e Ações rápidas.
* **Barra de Busca e Filtros Rápidos**: Busca textual em tempo real (por título, autor ou coleção) combinada com filtros rápidos (Todos, HQs, Físicos Não Lidos e Desejos).
* **Ordenação Reativa**: Seleção rápida para ordenar por ordem alfabética (A-Z ou Z-A), autor, quantidade de páginas ou progresso percentual.
* **Paginação Inteligente**: Divisão automática de dados em páginas de até 8 itens para evitar sobrecarga visual em listas extensas.
* **Tratamento de Coleções**: Exibição abreviada e elegante de nomes longos de coleções (com reticências) e coluna dedicada para exibição do volume.
* **Modo Edição via Modal**: A edição de qualquer livro ocorre de forma ágil em um modal diretamente sobre a estante, mantendo a experiência do usuário.

### 4. Cadastro Dedicado (`/cadastro`)
* **Formulário de Entrada Higienizado**: Permite incluir novas leituras com validação inteligente de dados (ex: impedindo páginas atuais maiores que o total de páginas ou exigindo formato caso o usuário já possua o livro).
* **Fluxo de Redirecionamento Automático**: Ao concluir a criação com sucesso, o sistema redireciona o leitor automaticamente de volta para a Estante, acompanhado de um botão no cabeçalho para retorno manual rápido.

---

## 🛠️ Configuração e Execução

### Pré-requisitos

Certifique-se de ter o **Node.js** (versão 16+) instalado em sua máquina.

### Passos para Instalação

1. Clone ou baixe a pasta do repositório:
   ```bash
   cd Libris
   ```

2. Instale todas as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run dev
   ```

O servidor iniciará automaticamente no navegador padrão. Por padrão, o projeto está configurado para executar na porta **3000** (`http://localhost:3000`).

---

## 📦 Scripts Disponíveis

No diretório do projeto, você pode executar:

* **`npm run dev`**: Executa o app em modo de desenvolvimento na porta `http://localhost:3000`.
* **`npm run build`**: Compila a aplicação para produção na pasta `dist`, otimizando o build final.
* **`npm run preview`**: Permite pré-visualizar localmente o build de produção gerado.
