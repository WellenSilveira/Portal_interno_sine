import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.JWT_SECRET.slice(0, 32).padEnd(32, '0')
const ALGORITHM = 'aes-256-cbc'

// Criptografar CPF
export const encryptCPF = (cpf) => {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(cpf, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return iv.toString('hex') + ':' + encrypted
  } catch (error) {
    console.error('Erro ao criptografar CPF:', error)
    return null
  }
}

// Descriptografar CPF (apenas admin)
export const decryptCPF = (encryptedCPF) => {
  try {
    const parts = encryptedCPF.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(parts[1], 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Erro ao descriptografar CPF:', error)
    return null
  }
}

// Validar CPF (algoritmo checksum)
export const isValidCPF = (cpf) => {
  const cleanCpf = cpf.replace(/\D/g, '')

  // Verificar formato
  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
    return false
  }

  // Verificar primeiro dígito
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i)
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder

  if (parseInt(cleanCpf[9]) !== firstDigit) return false

  // Verificar segundo dígito
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i)
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder

  if (parseInt(cleanCpf[10]) !== secondDigit) return false

  return true
}

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar força de senha
export const validatePasswordStrength = (password) => {
  const errors = []

  if (password.length < 8) errors.push('Mínimo 8 caracteres')
  if (!/[A-Z]/.test(password)) errors.push('Ao menos 1 letra maiúscula')
  if (!/[a-z]/.test(password)) errors.push('Ao menos 1 letra minúscula')
  if (!/[0-9]/.test(password)) errors.push('Ao menos 1 número')
  if (!/[!@#$%^&*]/.test(password)) errors.push('Ao menos 1 caractere especial')

  return {
    isValid: errors.length === 0,
    errors,
  }
}
