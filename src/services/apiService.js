import { getToken, saveToken, removeToken, isTokenExpired } from '../utils/tokenManager'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Callback para executar quando token expirar (redirect para login)
let onUnauthorized = null

export const setUnauthorizedCallback = (callback) => {
  onUnauthorized = callback
}

// Classe para gerenciar chamadas à API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Adiciona token no header se existir
  getHeaders() {
    const token = getToken()
    const headers = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // Verifica se token expirou e remove se necessário
  async checkTokenValidity() {
    const token = getToken()
    if (token && isTokenExpired(token)) {
      removeToken()
      return false
    }
    return true
  }

  // Requisição genérica com tratamento robusto de erros
  async request(endpoint, options = {}) {
    const { method = 'GET', body, ...customOptions } = options

    const isValidToken = await this.checkTokenValidity()
    if (!isValidToken) {
      removeToken()
      if (onUnauthorized) {
        onUnauthorized()
      }
      throw new ApiError('Token expirado. Faça login novamente.', 401)
    }

    const url = `${this.baseURL}${endpoint}`
    const headers = this.getHeaders()

    const config = {
      method,
      headers,
      ...customOptions,
    }

    if (body) {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json().catch(() => ({}))

      // Tratamento específico por status code
      if (response.status === 401) {
        removeToken()
        if (onUnauthorized) {
          onUnauthorized()
        }
        throw new ApiError('Sessão expirada. Faça login novamente.', 401)
      }

      if (response.status === 403) {
        throw new ApiError('Você não tem permissão para realizar esta ação.', 403)
      }

      if (response.status === 404) {
        throw new ApiError(data.message || 'Recurso não encontrado.', 404)
      }

      if (response.status === 400) {
        throw new ApiError(
          data.message || 'Dados inválidos. Verifique o formulário.',
          400
        )
      }

      if (response.status >= 500) {
        throw new ApiError(
          'Erro no servidor. Tente novamente mais tarde.',
          response.status
        )
      }

      if (!response.ok) {
        throw new ApiError(
          data.message || `Erro na requisição: ${response.status}`,
          response.status
        )
      }

      return data
    } catch (error) {
      // Se for erro de rede (não fetch)
      if (error instanceof TypeError) {
        console.error('Erro de rede:', error)
        throw new ApiError(
          'Erro de conexão. Verifique sua internet.',
          'NETWORK_ERROR'
        )
      }

      // Se for erro já tratado
      if (error instanceof ApiError) {
        throw error
      }

      // Erro genérico
      console.error('Erro na requisição:', error)
      throw new ApiError('Erro desconhecido. Tente novamente.', 'UNKNOWN_ERROR')
    }
  }

  // ========== AUTH ==========
  async register(cpf, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { cpf, email, password },
    })
  }

  async login(cpf, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { cpf, password },
    })

    // Salva token se receber
    if (response.token) {
      saveToken(response.token)
    }

    return response
  }

  async recruiterLogin(email, password) {
    const response = await this.request('/auth/recruiter/login', {
      method: 'POST',
      body: { email, password },
    })

    if (response.token) {
      saveToken(response.token)
    }

    return response
  }

  async recruiterRegister(email, companyName, fullName, password) {
    return this.request('/auth/recruiter/register', {
      method: 'POST',
      body: { email, companyName, fullName, password },
    })
  }

  async logout() {
    removeToken()
  }

  // ========== CPF/USUARIO ==========
  // Busca dados do usuário a partir do CPF (apenas durante cadastro)
  async fetchUserDataByCPF(cpf) {
    return this.request('/users/cpf-lookup', {
      method: 'POST',
      body: { cpf },
    })
  }

  // Obtém dados do usuário logado
  async getCurrentUser() {
    return this.request('/users/me')
  }

  // Atualiza dados do usuário
  async updateUserData(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: userData,
    })
  }

  // ========== CANDIDATURAS/VAGAS ==========
  async getJobs() {
    return this.request('/jobs')
  }

  async applyForJob(jobId, applicationData) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: applicationData,
    })
  }

  async getUserApplications() {
    return this.request('/applications/me')
  }
}

// Classe customizada de erro de API
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export default new ApiService()

