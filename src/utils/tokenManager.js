// Salva token no localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token)
}

// Recupera token do localStorage
export const getToken = () => {
  return localStorage.getItem('authToken')
}

// Remove token do localStorage
export const removeToken = () => {
  localStorage.removeItem('authToken')
}

// Decodifica JWT (sem validar assinatura - apenas para leitura local)
export const decodeToken = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const decoded = JSON.parse(atob(parts[1]))
    return decoded
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}

// Verifica se token está expirado
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  return Date.now() >= decoded.exp * 1000
}

// Obtém ID do usuário do token
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token)
  return decoded?.userId || null
}
