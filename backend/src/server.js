import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import db from './config/database.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor rodando' })
})

// Rotas da API
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Rota padrão
app.get('/', (req, res) => {
  res.json({ message: 'SINE Portal API', version: '1.0.0' })
})

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' })
})

// Tratamento de erros geral
app.use((err, req, res, next) => {
  console.error('Erro:', err)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📡 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`✅ Banco de dados pronto\n`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Encerrando servidor...')
  db.close((err) => {
    if (err) console.error('Erro ao fechar banco de dados:', err)
    process.exit(0)
  })
})

export default app
