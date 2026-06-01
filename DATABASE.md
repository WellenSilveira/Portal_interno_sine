# 📊 Banco de Dados - SINE Portal

## 🎯 Visão Geral

Sistema de armazenamento de dados de usuários com segurança máxima. Dados sensíveis (CPF, senhas) são criptografados e admin não tem acesso.

## 📦 Tecnologia Escolhida

**SQLite** (desenvolvimento) → **MySQL** (produção)

- ✅ SQLite: Perfeito para começar (arquivo local, sem servidor)
- ✅ Fácil migração para MySQL depois
- ✅ Suporta todas as operações necessárias

## 🗄️ Schema do Banco de Dados

### Tabela: `users`
Armazena dados dos usuários com criptografia

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf VARCHAR(255) UNIQUE NOT NULL,        -- Criptografado
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,     -- Hash bcrypt
  name VARCHAR(255),
  phone VARCHAR(20),
  birth_date DATE,
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `job_applications`
Candidaturas a vagas de emprego

```sql
CREATE TABLE job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  job_id INTEGER NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabela: `audit_logs`
Registro de segurança (quem acessou o quê)

```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action VARCHAR(100),           -- 'LOGIN', 'LOGOUT', 'UPDATE_PROFILE', etc
  details JSON,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## 🔐 Segurança de Dados

### ❌ NUNCA armazenar em texto plano:
- CPF
- Senhas
- Números de documento
- Dados financeiros

### ✅ SEMPRE fazer:
1. **Criptografia AES-256** para CPF
2. **Hash bcrypt** para senhas
3. **Admin NUNCA tem acesso** a dados sensíveis criptografados
4. **Audit logs** de todo acesso

## 📋 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Conexão com BD
│   │   └── encryption.js       # Funções de criptografia
│   ├── models/
│   │   ├── User.js
│   │   ├── JobApplication.js
│   │   └── AuditLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── jobController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── jobs.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── server.js
├── database.sqlite             # Arquivo do banco (git ignored)
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## 🚀 Setup Rápido

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Criar arquivo `.env`

```
PORT=3001
NODE_ENV=development
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRY=24h
DATABASE_URL=./database.sqlite
ENCRYPTION_KEY=sua_chave_de_criptografia_32_caracteres
```

### 3. Executar Servidor

```bash
npm run dev
```

## 💾 Operações Básicas com BD

### Criar Usuário (Cadastro)

```javascript
const db = require('./config/database')

const createUser = (cpf, email, passwordHash, name) => {
  const encryptedCPF = encrypt(cpf)
  
  db.run(
    `INSERT INTO users (cpf, email, password_hash, name) 
     VALUES (?, ?, ?, ?)`,
    [encryptedCPF, email, passwordHash, name],
    function(err) {
      if (err) console.error(err)
      console.log(`Usuário criado com ID: ${this.lastID}`)
    }
  )
}
```

### Buscar Usuário (Login)

```javascript
const getUserByCPF = (cpf, callback) => {
  const encryptedCPF = encrypt(cpf)
  
  db.get(
    `SELECT * FROM users WHERE cpf = ?`,
    [encryptedCPF],
    callback
  )
}
```

### Atualizar Usuário

```javascript
const updateUser = (userId, updates) => {
  const { email, phone, city } = updates
  
  db.run(
    `UPDATE users 
     SET email = ?, phone = ?, city = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [email, phone, city, userId]
  )
}
```

### Registrar Auditoria

```javascript
const logAction = (userId, action, details, ipAddress) => {
  db.run(
    `INSERT INTO audit_logs (user_id, action, details, ip_address)
     VALUES (?, ?, ?, ?)`,
    [userId, action, JSON.stringify(details), ipAddress]
  )
}
```

## 🔒 Exemplo: Fluxo de Cadastro com BD

```
1. Usuário preenche form (CPF, email, senha)
   ↓
2. Frontend valida e envia para backend
   ↓
3. Backend valida CPF (algoritmo checksum)
   ↓
4. Backend verifica se email/CPF já existe
   ↓
5. Backend faz hash da senha (bcrypt)
   ↓
6. Backend criptografa CPF (AES-256)
   ↓
7. Backend insere no DB (users table)
   ↓
8. Backend registra no audit_logs
   ↓
9. Backend gera JWT
   ↓
10. Frontend recebe token e armazena em localStorage
```

## 📊 Consultas Úteis

### Listar todos os usuários (sem dados sensíveis)

```sql
SELECT id, email, name, created_at, role 
FROM users 
WHERE is_active = 1;
```

**Nota:** CPF nunca deve aparecer em lista de admin!

### Buscar atividades de um usuário

```sql
SELECT action, details, created_at 
FROM audit_logs 
WHERE user_id = ? 
ORDER BY created_at DESC;
```

### Contar candidaturas por status

```sql
SELECT status, COUNT(*) as total 
FROM job_applications 
GROUP BY status;
```

## 🔄 Migração SQLite → MySQL (Depois)

Quando estiver pronto para produção:

```sql
-- Copiar dados do SQLite para MySQL é simples
-- Mesma sintaxe SQL, apenas mude a conexão
```

## ⚠️ Pontos Críticos de Segurança

1. **Nunca expor CPF completo** em API responses
2. **Admin não deve ter função** para descriptografar CPF
3. **Senhas nunca em logs** (apenas hash)
4. **Usar HTTPS** em produção
5. **Rate limiting** em endpoints de login
6. **2FA (autenticação dupla)** para admin
7. **Backups regulares** do banco de dados

## 🧪 Testar Banco de Dados

```bash
# Ver estrutura das tabelas
sqlite3 database.sqlite ".schema"

# Ver dados (cuidado - dados sensíveis!)
sqlite3 database.sqlite "SELECT id, email, name FROM users;"

# Exportar dados
sqlite3 database.sqlite ".mode csv" ".output backup.csv" "SELECT * FROM users;"
```

## 📞 Próximos Passos

1. ✅ Criar estrutura de pastas do backend
2. ⏳ Implementar conexão com SQLite
3. ⏳ Criar models (User, JobApplication, AuditLog)
4. ⏳ Implementar controllers de autenticação
5. ⏳ Conectar frontend ao backend
6. ⏳ Testar fluxo completo de cadastro e login

---

**Pronto para criar os arquivos do backend?** 🚀
