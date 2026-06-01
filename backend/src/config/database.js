import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, '../../database.sqlite')

// Criar conexão com banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message)
    process.exit(1)
  }
  console.log('✅ Conectado ao banco de dados SQLite')
  initializeDatabase()
})

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON')

// Inicializar tabelas
const initializeDatabase = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(20),
      birth_date DATE,
      address VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(2),
      zip_code VARCHAR(10),
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `

  const createJobApplicationsTable = `
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `

  const createAuditLogsTable = `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action VARCHAR(100),
      details TEXT,
      ip_address VARCHAR(45),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `

  db.serialize(() => {
    db.run(createUsersTable, (err) => {
      if (err) console.error('Erro ao criar tabela users:', err)
      else console.log('✅ Tabela users verificada/criada')
    })

    db.run(createJobApplicationsTable, (err) => {
      if (err) console.error('Erro ao criar tabela job_applications:', err)
      else console.log('✅ Tabela job_applications verificada/criada')
    })

    db.run(createAuditLogsTable, (err) => {
      if (err) console.error('Erro ao criar tabela audit_logs:', err)
      else console.log('✅ Tabela audit_logs verificada/criada')
    })
  })
}

export default db
