import UserModel from '../models/User.js'
import AuditLogModel from '../models/AuditLog.js'
import { getClientIp } from '../middleware/auth.js'

// Obter dados do usuário logado
export const getCurrentUser = (req, res) => {
  UserModel.findById(req.user.userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuário' })
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    res.json({ user })
  })
}

// Atualizar dados do usuário
export const updateUser = (req, res) => {
  const clientIp = getClientIp(req)
  const { email, phone, birth_date, address, city, state, zip_code } = req.body

  UserModel.update(
    req.user.userId,
    { email, phone, birth_date, address, city, state, zip_code },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar usuário' })
      }

      if (result.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      AuditLogModel.log(req.user.userId, 'USER_PROFILE_UPDATED', { email, phone, city }, clientIp)

      res.json({ message: 'Usuário atualizado com sucesso' })
    }
  )
}

// Listar todos os usuários (apenas admin)
export const getAllUsers = (req, res) => {
  UserModel.getAll((err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao listar usuários' })
    }

    res.json({ users })
  })
}

// Deativar usuário (apenas admin)
export const deactivateUser = (req, res) => {
  const clientIp = getClientIp(req)
  const { userId } = req.params

  UserModel.deactivate(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao desativar usuário' })
    }

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    AuditLogModel.log(req.user.userId, 'USER_DEACTIVATED', { targetUserId: userId }, clientIp)

    res.json({ message: 'Usuário desativado com sucesso' })
  })
}
