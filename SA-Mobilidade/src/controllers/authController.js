import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  // 1. Receba o CPF
  const { nome, email, senha, cpf } = req.body; // << ADICIONE O CPF

  try {
    // 2. (Opcional) Verifique se o CPF já existe
    if (cpf) {
        const cpfResult = await pool.query('SELECT * FROM usuarios WHERE cpf = $1', [cpf]);
        if (cpfResult.rows.length > 0) {
            return res.status(400).json({ mensagem: 'CPF já cadastrado' });
        }
    }

    // Verifica se o e-mail já existe
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Insere o usuário no banco (com CPF)
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cpf) VALUES ($1, $2, $3, $4)', // << ATUALIZE A QUERY
      [nome, email, senhaHash, cpf] // << ADICIONE O CPF
    );

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ mensagem: 'Erro no registro', erro: err.message });
  }
};

// Login do usuário
export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }

    const usuario = result.rows[0];

    // Compara senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Gera token JWT com expiração de 1h
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso',token,usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ mensagem: 'Erro no login', erro: err.message });
  }
};