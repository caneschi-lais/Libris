import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/libris';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Conexão com o MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// 1. Schema do Contador para Autoincremento
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

/**
 * Função utilitária para obter o próximo ID incremental.
 * 
 * @param {string} name Nome do sequenciador (ex: 'bookId')
 * @returns {Promise<number>} O próximo número sequencial
 */
async function getNextSequenceValue(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// 2. Schema do Livro (mantendo ID numérico incremental)
const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // ID de negócio sequencial
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, required: true, trim: true },
  tipo_midia: { type: String, required: true, enum: ['Livro', 'HQ', 'Mangá', 'Audiobook'] },
  total_paginas: { type: Number, required: true, min: 1 },
  status_leitura: { type: String, required: true, enum: ['Não Lido', 'Lendo', 'Lido'] },
  pagina_atual: { type: Number, default: 0 },
  data_inicio: { type: String, default: null },
  data_termino: { type: String, default: null },
  possui_o_livro: { type: Boolean, default: false },
  formato: { type: String, default: null },
  e_colecao: { type: Boolean, default: false },
  nome_colecao: { type: String, default: null },
  volume_colecao: { type: String, default: null }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

// === ROTAS DA API ===

// GET: Retornar todos os livros
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar livros.', error: err.message });
  }
});

// POST: Cadastrar um livro individual ou lote (append)
app.post('/api/books', async (req, res) => {
  try {
    const dados = req.body;
    
    if (Array.isArray(dados)) {
      // Inserção em lote (append)
      const livrosFormatados = [];
      for (const item of dados) {
        if (item.id === undefined || item.id === null) {
          item.id = await getNextSequenceValue('bookId');
        } else {
          item.id = Number(item.id);
        }
        livrosFormatados.push(item);
      }
      const livrosSalvos = await Book.insertMany(livrosFormatados);
      return res.status(201).json(livrosSalvos);
    }

    // Cadastro individual
    if (dados.id === undefined || dados.id === null) {
      dados.id = await getNextSequenceValue('bookId');
    } else {
      dados.id = Number(dados.id);
    }

    const novoLivro = new Book(dados);
    await novoLivro.save();
    res.status(201).json(novoLivro);
  } catch (err) {
    console.error("Erro ao salvar livro(s):", err);
    res.status(400).json({ message: 'Erro ao cadastrar livro(s).', error: err.message });
  }
});

// PUT: Atualizar um livro por ID de negócio (numérico)
app.put('/api/books/:id', async (req, res) => {
  try {
    const idNegocio = Number(req.params.id);
    const novosDados = req.body;
    
    // Força o ID a permanecer o mesmo
    novosDados.id = idNegocio;

    const livroAtualizado = await Book.findOneAndUpdate(
      { id: idNegocio },
      novosDados,
      { new: true, runValidators: true }
    );

    if (!livroAtualizado) {
      return res.status(404).json({ message: 'Livro não encontrado.' });
    }

    res.json(livroAtualizado);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar livro.', error: err.message });
  }
});

// DELETE: Remover um livro por ID de negócio (numérico)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const idNegocio = Number(req.params.id);
    const livroRemovido = await Book.findOneAndDelete({ id: idNegocio });

    if (!livroRemovido) {
      return res.status(404).json({ message: 'Livro não encontrado.' });
    }

    res.json({ message: 'Livro removido com sucesso!', book: livroRemovido });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover livro.', error: err.message });
  }
});

// POST: Importar múltiplos livros em lote (Backup JSON)
app.post('/api/books/import', async (req, res) => {
  try {
    const livros = req.body;

    if (!Array.isArray(livros)) {
      return res.status(400).json({ message: 'O corpo da requisição deve ser uma lista de livros.' });
    }

    // 1. Limpa livros e sequenciadores anteriores
    await Book.deleteMany({});
    await Counter.findByIdAndUpdate('bookId', { seq: livros.length }, { upsert: true });

    // 2. Formata todos os livros reindexando seus IDs de 1 a N
    const livrosFormatados = livros.map((item, index) => {
      // Normaliza propriedades booleanas e relacionais
      const possui = !!item.possui_o_livro;
      const eColecao = !!item.e_colecao;

      return {
        id: index + 1,
        titulo: (item.titulo || '').trim(),
        autor: (item.autor || '').trim(),
        tipo_midia: ['Livro', 'HQ', 'Mangá', 'Audiobook'].includes(item.tipo_midia) ? item.tipo_midia : 'Livro',
        total_paginas: Math.max(1, Number(item.total_paginas) || 0),
        status_leitura: ['Não Lido', 'Lendo', 'Lido'].includes(item.status_leitura) ? item.status_leitura : 'Não Lido',
        pagina_atual: Math.max(0, Number(item.pagina_atual) || 0),
        data_inicio: item.data_inicio || null,
        data_termino: item.data_termino || null,
        possui_o_livro: possui,
        formato: possui ? item.formato : null,
        e_colecao: eColecao,
        nome_colecao: eColecao ? (item.nome_colecao || '').trim() : null,
        volume_colecao: eColecao ? item.volume_colecao || '' : null,
      };
    });

    // 3. Insere todos em lote no banco
    const livrosSalvos = await Book.insertMany(livrosFormatados);
    res.json(livrosSalvos);
  } catch (err) {
    console.error("Erro na importação em lote:", err);
    res.status(500).json({ message: 'Erro ao importar lote de livros.', error: err.message });
  }
});

// Iniciando o servidor Express
app.listen(PORT, () => {
  console.log(`Servidor rodando e escutando na porta ${PORT}`);
});
