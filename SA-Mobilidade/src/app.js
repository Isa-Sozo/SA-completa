import express from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors'; // 1. Importe o cors
    import usuariosRoutes from './routes/usuariosRoutes.js';
    import authRoutes from './routes/authRoutes.js';
    import cartoesRoutes from './routes/cartoesRoutes.js';
    import empresasRoutes from './routes/empresasRoutes.js';
    import recargasRoutes from './routes/recargasRoutes.js';

    dotenv.config();

    const app = express();

    // 2. Use o middleware do CORS
    // Isso permitirá requisições de qualquer origem (bom para desenvolvimento)
    app.use(cors()); 

    app.use(express.json()); // Middleware para parsear JSON

    // Rota principal
    app.get('/', (req, res) => res.send('API SA-Mobilidade está no ar!'));

    // Rotas da aplicação
    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/cartoes', cartoesRoutes);
    app.use('/api/empresas', empresasRoutes);
    app.use('/api/recargas', recargasRoutes);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () =>
      console.log(`Servidor rodando na porta ${PORT}`)
    );