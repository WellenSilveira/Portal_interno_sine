# 🚀 Backend - SINE Portal

Backend Node.js + Express com autenticação JWT e banco de dados SQLite.

## 📦 Instalação

```bash
cd backend
npm install
```

## 🔧 Configuração

1. Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis (opcionalmente):
```
PORT=3001
NODE_ENV=development
JWT_SECRET=sua_chave_super_secreta (mínimo 32 caracteres)
JWT_EXPIRY=24h
FRONTEND_URL=http://localhost:5173
```

## 🚀 Executar

**Desenvolvimento** (com nodemon):
```bash
npm run dev
```

**Produção**:
```bash
npm start
```

O servidor rodará em `http://localhost:3001`

## 📡 Endpoints da API

### Autenticação

#### 1. Registrar (Cadastro)
```http
POST /api/auth/register
Content-Type: application/json

{
  "cpf": "12345678901",
  "email": "usuario@example.com",
  "password": "Senha123!@",
  "confirmPassword": "Senha123!@"
}
```

**Respostas:**
- ✅ 201: Usuário criado com sucesso
- ❌ 400: Dados inválidos
- ❌ 409: CPF ou email já cadastrado

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "cpf": "12345678901",
  "password": "Senha123!@"
}
```

**Resposta (200):**
```json
{
  "message": "Login bem-sucedido",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "João Silva",
    "role": "user"
  }
}
```

---

#### 3. Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

---

### Usuário

#### 4. Obter Dados Logado
```http
GET /api/users/me
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "João Silva",
    "phone": "(11) 98765-4321",
    "birth_date": "1990-05-15",
    "address": "Rua X, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567",
    "role": "user",
    "created_at": "2026-06-01T14:00:00Z"
  }
}
```

---

#### 5. Atualizar Dados
```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "novo@example.com",
  "phone": "(11) 99999-8888",
  "city": "Rio de Janeiro",
  "state": "RJ"
}
```

---

### Admin

#### 6. Listar Todos os Usuários
```http
GET /api/users/all
Authorization: Bearer {token_admin}
```

**Resposta (200):**
```json
{
  "users": [
    {
      "id": 1,
      "email": "usuario@example.com",
      "name": "João Silva",
      "role": "user",
      "is_active": 1,
      "created_at": "2026-06-01T14:00:00Z"
    }
  ]
}
```

---

#### 7. Desativar Usuário
```http
DELETE /api/users/{userId}
Authorization: Bearer {token_admin}
```

---

## 📂 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Conexão SQLite
│   │   └── utils.js         # Criptografia e validação
│   ├── models/
│   │   ├── User.js
│   │   └── AuditLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── database.sqlite          # Banco de dados (criado automaticamente)
├── .env                     # Variáveis de ambiente
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Segurança Implementada

✅ **Autenticação JWT** - Token com expiração
✅ **Hash de Senhas** - bcryptjs
✅ **CPF Criptografado** - AES-256
✅ **Validação de Entrada** - CPF, email, força de senha
✅ **Audit Logs** - Todas as ações registradas
✅ **CORS** - Apenas frontend autorizado
✅ **Admin Protegido** - Sem acesso a dados sensíveis

## 🧪 Testar Endpoints

### Com cURL

```bash
# Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "email": "teste@example.com",
    "password": "Senha123!@",
    "confirmPassword": "Senha123!@"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "password": "Senha123!@"
  }'

# Obter dados
curl -X GET http://localhost:3001/api/users/me \
  -H "Authorization: Bearer {seu_token_aqui}"
```

### Com Postman

1. Abra [Postman](https://www.postman.com/downloads/)
2. Importe a coleção ou crie requisições manualmente
3. Use os exemplos acima

## 🐛 Troubleshooting

### Erro: "Banco de dados não encontra"
- Certifique-se de que o arquivo `.env` existe
- Verifique se `DATABASE_PATH` está correto

### Erro: "Token inválido"
- Token pode estar expirado (24h)
- Faça login novamente

### Erro: "CORS error"
- Verifique `FRONTEND_URL` no `.env`
- Certifique-se que o frontend está em `http://localhost:5173`

## 📊 Ver Banco de Dados

```bash
# Instalar sqlite3 (Windows PowerShell)
choco install sqlite

# Ver tabelas
sqlite3 database.sqlite ".tables"

# Ver dados
sqlite3 database.sqlite "SELECT * FROM users LIMIT 5;"

# Ver schema
sqlite3 database.sqlite ".schema users"
```

## 🔄 Próximos Passos

1. ✅ Backend criado
2. ⏳ Conectar frontend ao backend
3. ⏳ Testar fluxo completo
4. ⏳ Implementar mais features (vagas, candidaturas, etc)
5. ⏳ Deploy em produção

---

**Documentação completa em [DATABASE.md](../DATABASE.md) e [BACKEND_SETUP.md](../BACKEND_SETUP.md)**
