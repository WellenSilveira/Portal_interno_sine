import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
import AuditLogModel from '../models/AuditLog.js'
import { isValidCPF, isValidEmail, validatePasswordStrength } from '../config/utils.js'
import { getClientIp } from '../middleware/auth.js'

// Registrar novo usuário
export const register = async (req, res) => {
  try {
    const { cpf, email, password, confirmPassword } = req.body
    const clientIp = getClientIp(req)

    // Validações
    if (!cpf || !email || !password) {
      return res.status(400).json({ message: 'CPF, email e senha são obrigatórios' })
    }

    if (!isValidCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Senhas não coincidem' })
    }

    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: 'Senha fraca',
        errors: passwordValidation.errors,
      })
    }

    // Verificar se usuário já existe
    UserModel.findByCPF(cpf, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao verificar CPF' })
      }

      if (user) {
        AuditLogModel.log(null, 'FAILED_REGISTRATION', { cpf, email, reason: 'CPF já existe' }, clientIp)
        return res.status(409).json({ message: 'CPF já cadastrado' })
      }

      // Verificar email
      UserModel.findByEmail(email, (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao verificar email' })
        }

        if (user) {
          AuditLogModel.log(null, 'FAILED_REGISTRATION', { cpf, email, reason: 'Email já existe' }, clientIp)
          return res.status(409).json({ message: 'Email já cadastrado' })
        }

        // Hash da senha
        bcryptjs.hash(password, 10, (err, passwordHash) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao processar senha' })
          }

          // Criar usuário
          UserModel.create({ cpf, email, passwordHash }, (err, result) => {
            if (err) {
              return res.status(500).json({ message: 'Erro ao criar usuário' })
            }

            AuditLogModel.log(result.id, 'USER_REGISTERED', { email }, clientIp)

            return res.status(201).json({
              message: 'Usuário criado com sucesso',
              userId: result.id,
            })
          })
        })
      })
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

// Login de usuário
export const login = async (req, res) => {
  try {
    const { cpf, password } = req.body
    const clientIp = getClientIp(req)

    // Validações
    if (!cpf || !password) {
      return res.status(400).json({ message: 'CPF e senha são obrigatórios' })
    }

    if (!isValidCPF(cpf)) {
      return res.status(400).json({ message: 'CPF ou senha inválidos' })
    }

    // Buscar usuário
    UserModel.findByCPF(cpf, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar usuário' })
      }

      if (!user) {
        AuditLogModel.log(null, 'FAILED_LOGIN', { cpf, reason: 'Usuário não encontrado' }, clientIp)
        return res.status(401).json({ message: 'CPF ou senha inválidos' })
      }

      if (!user.is_active) {
        AuditLogModel.log(user.id, 'FAILED_LOGIN', { reason: 'Usuário inativo' }, clientIp)
        return res.status(401).json({ message: 'Usuário inativo' })
      }

      // Verificar senha
      bcryptjs.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao verificar senha' })
        }

        if (!isMatch) {
          AuditLogModel.log(user.id, 'FAILED_LOGIN', { reason: 'Senha incorreta' }, clientIp)
          return res.status(401).json({ message: 'CPF ou senha inválidos' })
        }

        // Gerar JWT
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRY }
        )

        AuditLogModel.log(user.id, 'USER_LOGIN', { email: user.email }, clientIp)

        return res.json({
          message: 'Login bem-sucedido',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        })
      })
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

// Logout
export const logout = (req, res) => {
  const clientIp = getClientIp(req)
  AuditLogModel.log(req.user.userId, 'USER_LOGOUT', {}, clientIp)

  res.json({ message: 'Logout bem-sucedido' })
}
