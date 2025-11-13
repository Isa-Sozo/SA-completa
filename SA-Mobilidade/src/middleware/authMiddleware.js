import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const proteger = async (req, res, next) => {
  let token;
  
  // Verifica se o cabeçalho de autorização existe e começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pega o token (formato: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];
      
      // Verifica e decodifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Pega o ID do usuário de dentro do token e anexa ao 'req'
      // para que as próximas rotas possam usá-lo
      req.id_usuario = decoded.id; 
      
      next(); // Continua para a rota solicitada
    } catch (error) {
      console.error('Erro de token:', error);
      res.status(401).json({ mensagem: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ mensagem: 'Não autorizado, sem token' });
  }
};