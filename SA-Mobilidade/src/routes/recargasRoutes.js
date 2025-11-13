import express from 'express';
import { listarRecargas, adicionarRecarga } from '../controllers/recargasController.js';

// 1. Importa o middleware de proteção
import { proteger } from '../middleware/authMiddleware.js';

const router = express.Router();

// 2. USA O MIDDLEWARE
// Todas as rotas neste arquivo agora exigirão um token
router.use(proteger);

// 3. Rotas agora estão protegidas
router.get('/', listarRecargas);
router.post('/', adicionarRecarga);

export default router;