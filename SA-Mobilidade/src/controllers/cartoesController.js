import pool from '../config/db.js';

// --- NOVA FUNÇÃO ---
// Lista os cartões APENAS do usuário que está logado
export const listarMeusCartoes = async (req, res) => {
  // req.id_usuario é injetado pelo middleware 'proteger'
  const id_usuario_logado = req.id_usuario; 

  try {
    const result = await pool.query(
      `SELECT id_cartao, numero_cartao, saldo 
       FROM cartoes 
       WHERE id_usuario = $1`,
      [id_usuario_logado]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar meus cartões:', err);
    res.status(500).json({ erro: 'Erro ao listar cartões do usuário' });
  }
};


// --- FUNÇÕES ORIGINAIS (MODIFICADAS/MANTIDAS) ---

// Lista TODOS os cartões (agora uma rota de admin)
export const listarCartoes = async (req, res) => {
  try {  
    const result = await pool.query(`
      SELECT c.id_cartao, c.numero_cartao, c.saldo, u.nome AS usuario
      FROM cartoes c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar cartões:', err);
    res.status(500).json({ erro: 'Erro ao listar cartões' });
  }
};

// Adiciona os cartões (AGORA MAIS SEGURO)
export const adicionarCartao = async (req, res) => { 
  // Pega o ID do usuário logado (do token)
  const id_usuario_logado = req.id_usuario;
  // Pega o número do cartão do body
  const { numero_cartao } = req.body; 

  if (!numero_cartao) {
    return res.status(400).json({ erro: 'O número do cartão é obrigatório.' });
  }

  try {
    await pool.query(
      'INSERT INTO cartoes (id_usuario, numero_cartao) VALUES ($1, $2)',
      [id_usuario_logado, numero_cartao] // Usa o ID do token!
    );
    res.status(201).json({ mensagem: 'Cartão criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar cartão:', err);
    res.status(500).json({ erro: 'Erro ao criar cartão' });
  }
};