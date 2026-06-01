import { getToken, saveToken, removeToken, isTokenExpired } from '../utils/tokenManager'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

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

  // Requisição genérica
  async request(endpoint, options = {}) {
    const { method = 'GET', body, ...customOptions } = options

    const isValidToken = await this.checkTokenValidity()
    if (!isValidToken) {
      throw new Error('Token expirado. Faça login novamente.')
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

      if (response.status === 401) {
        removeToken()
        throw new Error('Sessão expirada. Faça login novamente.')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `Erro na requisição: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro na requisição:', error)
      throw error
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

  async logout() {
    removeToken()
  }

  // ========== CPF/USUARIO ==========
  // Busca dados do usuário a partir do CPF (apenas durante cadastro)
  async fetchUserDataByCPF(cpf) {
    // IMPORTANTE: Isso deve fazer uma chamada segura ao backend
    // O backend que vai consultar a API do governo/BD seguro
    return this.request('/users/cpf-lookup', {
      method: 'POST',
      body: { cpf },
    })
  }

  // Obtém dados do usuário logado (dados pessoais criptografados)
  async getCurrentUser() {
    return this.request('/users/me')
  }

  // Atualiza dados do usuário (apenas o próprio usuário)
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

export default new ApiService()
