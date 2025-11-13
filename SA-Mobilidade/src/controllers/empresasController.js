import pool from '../config/db.js';

// Listar todas as empresas
export const listarEmpresas = async (req, res) => {
  try {
    // Busca as enmpresas no banco
    const result = await pool.query('SaELECT * FROM empresas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar empresas' });
  }
};

// Adiciona nova empresa
export const adicionarEmpresa = async (req, res) => {
  const { nome, cidade } = req.body;
  try { 
    // Insere a empresa no banco
    await pool.query('INSERT INTO empresas (nome, cidade) VALUES ($1, $2)', [nome, cidade]);
    res.status(201).json({ mensagem: 'Empresa adicionada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao adicionar empresa' });
  }
};