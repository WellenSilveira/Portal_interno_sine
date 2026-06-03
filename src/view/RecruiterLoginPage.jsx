import { useState } from 'react'
import { Mail, Lock, Building2, Phone, Eye, EyeOff } from 'lucide-react'
import './RecruiterLoginPage.css'
import Input from '@/components/Input'
import Button from '@/components/Button'
import PasswordInput from '@/components/PasswordInput'
import { useAuth } from '@/contexts/AuthContext'
import apiService, { ApiError } from '@/services/apiService'
import { validateEmail, validatePassword } from '@/utils/validators'

export default function RecruiterLoginSignup() {
  const { login } = useAuth()

  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Signup state
  const [signupEmail, setSignupEmail] = useState('')
  const [signupCompanyName, setSignupCompanyName] = useState('')
  const [signupCompanyPhone, setSignupCompanyPhone] = useState('')
  const [signupFullName, setSignupFullName] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [signupError, setSignupError] = useState('')
  const [signupTerms, setSignupTerms] = useState(false)

  // Format phone
  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 14)
  }

  const handlePhoneChange = (value, setPhone) => {
    setPhone(formatPhone(value))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      if (!validateEmail(loginEmail)) {
        setLoginError('Email inválido.')
        setLoading(false)
        return
      }

      if (!loginPassword) {
        setLoginError('Senha é obrigatória.')
        setLoading(false)
        return
      }

      const response = await apiService.recruiterLogin(loginEmail, loginPassword)
      login(response.token, response.user)
      alert('Login realizado com sucesso!')
    } catch (error) {
      if (error instanceof ApiError) {
        setLoginError(error.message)
      } else {
        setLoginError('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setSignupError('')
    setLoading(true)

    try {
      if (!signupFullName.trim()) {
        setSignupError('Nome completo é obrigatório.')
        setLoading(false)
        return
      }

      if (!validateEmail(signupEmail)) {
        setSignupError('Email inválido.')
        setLoading(false)
        return
      }

      if (!signupCompanyName.trim()) {
        setSignupError('Nome da empresa é obrigatório.')
        setLoading(false)
        return
      }

      const passwordValidation = validatePassword(signupPassword)
      if (!passwordValidation.isValid) {
        setSignupError(passwordValidation.errors[0])
        setLoading(false)
        return
      }

      if (signupPassword !== signupConfirmPassword) {
        setSignupError('Senhas não coincidem.')
        setLoading(false)
        return
      }

      if (!signupTerms) {
        setSignupError('Você deve aceitar os termos de uso e política de privacidade.')
        setLoading(false)
        return
      }

      const response = await apiService.recruiterRegister(
        signupEmail,
        signupCompanyName,
        signupFullName,
        signupPassword
      )

      login(response.token, response.user)
      alert('Cadastro realizado com sucesso!')
    } catch (error) {
      if (error instanceof ApiError) {
        setSignupError(error.message)
      } else {
        setSignupError('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setLoginError('')
    setSignupError('')
    setLoginEmail('')
    setLoginPassword('')
    setSignupEmail('')
    setSignupCompanyName('')
    setSignupCompanyPhone('')
    setSignupFullName('')
    setSignupPassword('')
    setSignupConfirmPassword('')
    setSignupTerms(false)
  }

  return (
    <div className="recruiter-login-page">
      <div className="recruiter-login-card">
        <div className="recruiter-login-card__header">
          <div>
            <h1>Portal do Recrutador</h1>
            <p>Gerencie vagas e candidatos</p>
          </div>
        </div>

        <div className="recruiter-login-card__tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabClick('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabClick('signup')}
          >
            Cadastro
          </button>
        </div>

        <div className="recruiter-login-card__body">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="form-grid">
              {loginError && <div className="form-error-message">{loginError}</div>}

              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu.email@empresa.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Senha</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-row form-row--space-between">
                <label className="checkbox-label">
                  <input type="checkbox" disabled={loading} />
                  <span>Lembrar-me</span>
                </label>
                <a href="#" className="link-secondary">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="button button--primary"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="form-grid">
              {signupError && <div className="form-error-message">{signupError}</div>}

              <div className="form-group">
                <label>Nome Completo</label>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="seu.email@empresa.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nome da Empresa</label>
                <div className="input-group">
                  <Building2 className="input-icon" />
                  <input
                    type="text"
                    value={signupCompanyName}
                    onChange={(e) => setSignupCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Telefone da Empresa</label>
                <div className="input-group">
                  <Phone className="input-icon" />
                  <input
                    type="text"
                    value={signupCompanyPhone}
                    onChange={(e) => handlePhoneChange(e.target.value, setSignupCompanyPhone)}
                    placeholder="(00) 0000-0000"
                    maxLength="14"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Senha</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Senha</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <label className="checkbox-label checkbox-label--wide">
                <input
                  type="checkbox"
                  checked={signupTerms}
                  onChange={(e) => setSignupTerms(e.target.checked)}
                  disabled={loading}
                />
                <span>Eu aceito os termos de uso e política de privacidade</span>
              </label>

              <button
                type="submit"
                className="button button--primary"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </form>
          )}
        </div>

        <div className="recruiter-login-card__footer">
          <p>
            {activeTab === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              className="link-action"
              onClick={() => handleTabClick(activeTab === 'login' ? 'signup' : 'login')}
              disabled={loading}
            >
              {activeTab === 'login' ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
          <a href="#" className="footer-link">
            Voltar para login de trabalhador
          </a>
        </div>
      </div>
    </div>
  )
}
