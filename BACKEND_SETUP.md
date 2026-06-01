# Backend Setup - SINE Portal

Este é um template para criar o backend da aplicação SINE com segurança máxima.

## 📦 Dependências

```bash
npm install express cors dotenv bcryptjs jsonwebtoken axios
npm install --save-dev nodemon
```

## 📁 Estrutura Recomendada

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── jobController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── jobs.js
│   ├── middleware/
│   │   ├── auth.js          # Validação JWT
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── database.js      # Conexão BD
│   │   ├── encryption.js    # Criptografia de dados
│   │   └── cpfValidator.js  # Validação de CPF
│   └── server.js
├── .env
├── .env.example
└── package.json
```

## 🔑 Arquivo .env

```
PORT=3001
NODE_ENV=development
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRY=24h

# Database
DB_HOST=localhost
DB_USER=sine_user
DB_PASSWORD=sua_senha_segura
DB_NAME=sine_db

# APIs Externas (exemplo)
CPF_API_URL=https://api-governo.gov.br/cpf
CPF_API_KEY=sua_chave_api

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🔐 Middleware de Autenticação

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' })
    }
    req.user = user
    next()
  })
}
```

## 🔐 Criptografia de Dados Sensíveis

```javascript
// utils/encryption.js
import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const secretKey = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = (text) => {
  const parts = text.split(':')
  const iv = Buffer.from(parts.shift(), 'hex')
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
  let decrypted = decipher.update(Buffer.from(parts.join(':'), 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
```

## 👤 Exemplo: Auth Controller

```javascript
// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateCPF, fetchCPFData } from '../utils/cpfValidator.js'
import { encrypt } from '../utils/encryption.js'
import db from '../utils/database.js'

export const register = async (req, res) => {
  try {
    const { cpf, email, password } = req.body

    // Validações
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' })
    }

    // Verifica se usuário já existe
    const existingUser = db.query('SELECT id FROM users WHERE cpf = ?', [cpf])
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'CPF já cadastrado' })
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10)

    // Criptografa dados sensíveis
    const encryptedCPF = encrypt(cpf)

    // Insere usuário no BD
    db.query(
      'INSERT INTO users (cpf, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [encryptedCPF, email, passwordHash]
    )

    return res.status(201).json({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    console.error('Erro no registro:', error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const login = async (req, res) => {
  try {
    const { cpf, password } = req.body

    // Valida CPF
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'CPF ou senha inválidos' })
    }

    // Busca usuário
    const encryptedCPF = encrypt(cpf)
    const users = db.query('SELECT * FROM users WHERE cpf = ?', [encryptedCPF])
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'CPF ou senha inválidos' })
    }

    const user = users[0]

    // Valida senha
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'CPF ou senha inválidos' })
    }

    // Gera JWT
    const token = jwt.sign(
      { userId: user.id, cpf: cpf }, // NUNCA coloque dados sensíveis aqui
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
```

## 🏢 Lookup de CPF (Dados do Governo)

```javascript
// controllers/userController.js
export const lookupCPF = async (req, res) => {
  try {
    const { cpf } = req.body

    // Valida CPF
    if (!validateCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' })
    }

    // Chamada segura à API do governo/BD interno
    // NUNCA exponha dados completos, apenas o necessário
    const userData = await fetchCPFData(cpf) // Você implementa isso

    return res.json({
      name: userData.name,
      email: userData.email,
      // Nunca retorne dados como RG, filiação, endereço completo, etc.
    })
  } catch (error) {
    console.error('Erro no lookup:', error)
    return res.status(500).json({ message: 'CPF não encontrado' })
  }
}

// Obter dados do usuário logado (com proteção)
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId

    const users = db.query('SELECT id, name, email FROM users WHERE id = ?', [userId])
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.json({ user: users[0] })
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
```

## 🔒 Boas Práticas de Segurança

1. ✅ Senhas sempre com hash bcrypt
2. ✅ CPF e dados sensíveis criptografados no BD
3. ✅ JWT com expiração curta (24h)
4. ✅ Logs de acesso e tentativas falhadas
5. ✅ Rate limiting para login
6. ✅ Validação de entrada em todos os endpoints
7. ✅ HTTPS em produção
8. ✅ Headers de segurança (HSTS, CSP, X-Frame-Options)
9. ✅ Admin NUNCA pode acessar dados de usuário criptografados
10. ✅ Cada usuário só acessa seus próprios dados

## 🗄️ Schema do Banco de Dados (SQL)

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cpf VARCHAR(255) UNIQUE NOT NULL, -- Criptografado
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL, -- Hash bcrypt
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255),
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🚀 Servidor Básico

```javascript
// server.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import authRoutes from './src/routes/auth.js'
import userRoutes from './src/routes/users.js'
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}))
app.use(express.json())

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
```

## 📋 Checklist de Segurança

- [ ] Senhas com hash bcrypt
- [ ] CPF criptografado no BD
- [ ] JWT com expiração
- [ ] Validação de entrada
- [ ] CORS configurado
- [ ] Rate limiting ativo
- [ ] Logs de auditoria
- [ ] Tratamento de erros adequado
- [ ] Dados sensíveis nunca no JWT
- [ ] Dados pessoais criptografados
- [ ] Admin sem acesso a dados criptografados
- [ ] HTTPS em produção

---

**Sempre coloque segurança em primeiro lugar!** 🔒
