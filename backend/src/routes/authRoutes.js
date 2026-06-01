import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Registro
router.post('/register', register)

// Login
router.post('/login', login)

// Logout (requer autenticação)
router.post('/logout', authenticateToken, logout)

export default router
