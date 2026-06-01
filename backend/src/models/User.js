import db from '../config/database.js'
import { encryptCPF } from '../config/utils.js'

export class UserModel {
  // Criar usuário
  static create(userData, callback) {
    const { cpf, email, passwordHash, name } = userData
    const encryptedCPF = encryptCPF(cpf)

    db.run(
      `INSERT INTO users (cpf, email, password_hash, name) 
       VALUES (?, ?, ?, ?)`,
      [encryptedCPF, email, passwordHash, name],
      function (err) {
        if (err) {
          callback(err, null)
        } else {
          callback(null, { id: this.lastID })
        }
      }
    )
  }

  // Buscar usuário por CPF (criptografado)
  static findByCPF(cpf, callback) {
    const encryptedCPF = encryptCPF(cpf)

    db.get(
      `SELECT * FROM users WHERE cpf = ?`,
      [encryptedCPF],
      (err, row) => {
        callback(err, row)
      }
    )
  }

  // Buscar usuário por email
  static findByEmail(email, callback) {
    db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (err, row) => {
        callback(err, row)
      }
    )
  }

  // Buscar usuário por ID
  static findById(id, callback) {
    db.get(
      `SELECT id, email, name, phone, birth_date, address, city, state, zip_code, role, created_at FROM users WHERE id = ?`,
      [id],
      (err, row) => {
        callback(err, row)
      }
    )
  }

  // Atualizar usuário
  static update(userId, updates, callback) {
    const { email, phone, birth_date, address, city, state, zip_code } = updates
    const fields = []
    const values = []

    if (email !== undefined) {
      fields.push('email = ?')
      values.push(email)
    }
    if (phone !== undefined) {
      fields.push('phone = ?')
      values.push(phone)
    }
    if (birth_date !== undefined) {
      fields.push('birth_date = ?')
      values.push(birth_date)
    }
    if (address !== undefined) {
      fields.push('address = ?')
      values.push(address)
    }
    if (city !== undefined) {
      fields.push('city = ?')
      values.push(city)
    }
    if (state !== undefined) {
      fields.push('state = ?')
      values.push(state)
    }
    if (zip_code !== undefined) {
      fields.push('zip_code = ?')
      values.push(zip_code)
    }

    if (fields.length === 0) {
      callback(new Error('Nenhum campo para atualizar'), null)
      return
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(userId)

    db.run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values,
      function (err) {
        callback(err, { changes: this.changes })
      }
    )
  }

  // Listar todos os usuários (sem CPF)
  static getAll(callback) {
    db.all(
      `SELECT id, email, name, role, is_active, created_at FROM users`,
      (err, rows) => {
        callback(err, rows)
      }
    )
  }

  // Desativar usuário
  static deactivate(userId, callback) {
    db.run(
      `UPDATE users SET is_active = 0 WHERE id = ?`,
      [userId],
      function (err) {
        callback(err, { changes: this.changes })
      }
    )
  }
}

export default UserModel
