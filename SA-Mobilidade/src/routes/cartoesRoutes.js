import express from 'express';
// Importa as funções atualizadas do controller de cartões
import { listarCartoes, adicionarCartao, listarMeusCartoes } from '../controllers/cartoesController.js'; 
// Importa as funções do controller de uso (como no original do usuário)
import { usarCartao, verExtratoUsos } from '../controllers/usoCartaoController.js';
// Importa o middleware de proteção
import { proteger } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- ATENÇÃO ---
// Todas as rotas abaixo desta linha agora vão exigir um token JWT
// O middleware 'proteger' será executado para todas elas
router.use(proteger);

// --- NOVAS ROTAS ---
// Rota para o dashboard buscar os cartões do usuário logado
// GET /api/cartoes/meus-cartoes
router.get('/meus-cartoes', listarMeusCartoes);

// Rota para um usuário logado adicionar um cartão PARA SI MESMO
// POST /api/cartoes/
router.post('/', adicionarCartao);


// --- ROTAS ANTIGAS (AGORA PROTEGIDAS) ---
// Rota para usar um cartão
// POST /api/cartoes/usar
router.post('/usar', usarCartao);

// Rota para ver o extrato de um cartão específico
// GET /api/cartoes/:id_cartao/extrato
router.get('/:id_cartao/extrato', verExtratoUsos);


// --- ROTA DE ADMIN ---
// Rota para listar TODOS os cartões (rota de admin)
// GET /api/cartoes/admin/todos
router.get('/admin/todos', listarCartoes);

export default router;