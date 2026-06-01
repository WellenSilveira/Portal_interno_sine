import express from 'express'
import {
  getCurrentUser,
  updateUser,
  getAllUsers,
  deactivateUser,
} from '../controllers/userController.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Rotas do usuário logado
router.get('/me', authenticateToken, getCurrentUser)
router.put('/me', authenticateToken, updateUser)

// Rotas de admin
router.get('/all', authenticateToken, isAdmin, getAllUsers)
router.delete('/:userId', authenticateToken, isAdmin, deactivateUser)

export default router
