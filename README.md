#  SA Mobilidade - Backend

Sistema de gerenciamento para cartões de transporte urbano unificado.

##  Como Usar

### 1. Instalar



```bash

npm install


2. Banco de Dados
sql

-- Execute no PostgreSQL:
psql -U postgres -f database.sql


3. Configurar
Crie arquivo .env:
env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=mobilidade
DB_PORT=5432
JWT_SECRET=secreto
PORT=3000

4. Executar
bash
npm start


📋 Endpoints Principais

🔐 Autenticação
POST /auth/register - Cadastrar usuário

POST /auth/login - Fazer login

💳 Cartões
GET /cartoes - Listar cartões

POST /cartoes - Criar cartão

POST /cartoes/usar - Usar cartão em empresa

GET /cartoes/:id/extrato - Ver extrato

💰 Recargas
GET /recargas - Listar recargas

POST /recargas - Fazer recarga

🏢 Empresas
GET /empresas - Listar empresas

POST /empresas - Adicionar empresa

🎯 Funcionalidades

 Cartão unificado: pode ser usado em várias empresas integradas.

 Recarga e saldo centralizado: saldo único entre todos os transportes.

 Histórico de recargas e usos.

 Autenticação JWT segura.

 Senhas criptografadas com bcrypt.

 Banco de dados relacional PostgreSQL.


🧪 Teste Rápido
Cadastrar usuário:

json
POST /auth/register
{"nome": "Teste", "email": "teste@email.com", "senha": "123456"}
Criar cartão:

json
POST /cartoes
{"id_usuario": 1, "numero_cartao": "CARTAO_001"}
Recarregar:

json
POST /recargas
{"id_cartao": 1, "valor": 50.00}
Usar cartão:

json
POST /cartoes/usar
{"id_cartao": 1, "id_empresa": 1, "valor_passagem": 4.50}
Desenvolvido para Sistemas de Apoio - 3ºB



## 📁 **Estrutura de Arquivos Necessários:**

Seu projeto precisa ter:
SA-Mobilidade/
├── README.md (este arquivo)
├── package.json
├── app.js
├── database.sql
├── .env.example
├── config/
│ └── db.js
├── controllers/
│ ├── authController.js
│ ├── usuariosController.js
│ ├── empresasController.js
│ ├── cartoesController.js
│ ├── recargasController.js
│ └── usoCartaoController.js
└── routes/
├── authRoutes.js
├── usuariosRoutes.js
├── empresasRoutes.js
├── cartoesRoutes.js
└── recargasRoutes.js
└── middleware/
├── authMiddleware.js
SA-Mobilidade-front/
index.html
dashboard.html
register.html


