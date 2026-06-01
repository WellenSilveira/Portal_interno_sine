import db from '../config/database.js'

export class AuditLogModel {
  // Registrar ação
  static log(userId, action, details, ipAddress, callback) {
    const detailsJson = typeof details === 'string' ? details : JSON.stringify(details)

    db.run(
      `INSERT INTO audit_logs (user_id, action, details, ip_address) 
       VALUES (?, ?, ?, ?)`,
      [userId, action, detailsJson, ipAddress],
      function (err) {
        if (callback) {
          callback(err, { id: this.lastID })
        }
      }
    )
  }

  // Buscar logs de um usuário
  static getByUserId(userId, callback) {
    db.all(
      `SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId],
      (err, rows) => {
        callback(err, rows)
      }
    )
  }

  // Buscar todos os logs
  static getAll(callback) {
    db.all(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`,
      (err, rows) => {
        callback(err, rows)
      }
    )
  }
}

export default AuditLogModel
