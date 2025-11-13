import pool from '../config/db.js';

// Lista os cartões
export const listarCartoes = async (req, res) => {
  // Esta é uma rota de admin, não precisa de filtro de usuário
  try { 
    const result = await pool.query(`
      SELECT c.id_cartao, c.numero_cartao, c.saldo, u.nome AS usuario
      FROM cartoes c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar cartões (admin):', err);
    res.status(500).json({ erro: 'Erro ao listar cartões' });
  }
};

// --- MUDANÇA PRINCIPAL AQUI ---
// Lista os cartões do usuário LOGADO
export const listarMeusCartoes = async (req, res) => {
  // O req.id_usuario é injetado pelo middleware 'proteger'
  const id_usuario_logado = req.id_usuario;

  try {
    // Esta query agora busca o cartão E a data da última recarga
    const result = await pool.query(`
      SELECT 
        c.id_cartao, 
        c.numero_cartao, 
        c.saldo,
        (SELECT MAX(r.data_recarga) 
         FROM recargas r 
         WHERE r.id_cartao = c.id_cartao) AS ultima_recarga
      FROM 
        cartoes c
      WHERE 
        c.id_usuario = $1
    `, [id_usuario_logado]);
    
    // O resultado (result.rows) agora terá [ { id_cartao: 1, ..., ultima_recarga: "2025-11-13T14:30:00Z" } ]
    res.json(result.rows);

  } catch (err) {
    console.error('Erro ao listar meus cartões:', err);
    res.status(500).json({ mensagem: 'Erro ao buscar dados dos cartões.' });
  }
};


// Adiciona os cartões
export const adicionarCartao = async (req, res) => { 
  const { numero_cartao } = req.body;
  // Pega o ID do usuário logado (do token)
  const id_usuario_logado = req.id_usuario;

  if (!numero_cartao) {
    return res.status(400).json({ erro: 'O número do cartão é obrigatório.' });
  }

  try {
    // Verifica se o cartão já está cadastrado
    const existente = await pool.query('SELECT * FROM cartoes WHERE numero_cartao = $1', [numero_cartao]);
    if (existente.rows.length > 0) {
      return res.status(400).json({ erro: 'Este cartão já foi cadastrado.' });
    }

    // Insere o cartão
    await pool.query(
      'INSERT INTO cartoes (id_usuario, numero_cartao) VALUES ($1, $2)',
      [id_usuario_logado, numero_cartao]
    );
    res.status(201).json({ mensagem: 'Cartão criado com sucesso' });
  } catch (err) {
    console.error('Erro ao adicionar cartão:', err);
    res.status(500).json({ erro: 'Erro ao criar cartão' });
  }
};