import { useState } from 'react'
import { User, Lock, IdCard, Eye, EyeOff } from 'lucide-react'
import './LoginPage.css'

export default function LoginSignup() {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginCpf, setLoginCpf] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupCpf, setSignupCpf] = useState('')
  const [adminMode, setAdminMode] = useState(false)

  const ADMIN_CPF = '12345678901'
  const ADMIN_PASSWORD = 'Admin123!'

  // Formata CPF com máscara
  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14)
  }

  // Remove máscara do CPF
  const unformatCPF = (value) => {
    return value.replace(/\D/g, '')
  }

  // Valida CPF
  const isValidCPF = (cpf) => {
    const cleanCpf = unformatCPF(cpf)
    return cleanCpf.length === 11 && /^\d{11}$/.test(cleanCpf)
  }

  const handleCpfChange = (value, setCpf) => {
    setCpf(formatCPF(value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (activeTab === 'login' && adminMode) {
      const cleanCpf = unformatCPF(loginCpf)
      if (cleanCpf === ADMIN_CPF && loginPassword === ADMIN_PASSWORD) {
        alert('Admin logado com sucesso!')
      } else {
        alert('Credenciais admin incorretas.')
      }
      return
    }

    if (activeTab === 'login') {
      if (!isValidCPF(loginCpf)) {
        alert('CPF inválido. Digite um CPF válido com 11 dígitos.')
        return
      }
      alert('Login feito com CPF: ' + loginCpf)
    } else {
      if (!isValidCPF(signupCpf)) {
        alert('CPF inválido. Digite um CPF válido com 11 dígitos.')
        return
      }
      alert('Cadastro concluído com CPF: ' + signupCpf)
    }
  }

  const handleAdminLogin = () => {
    setActiveTab('login')
    setAdminMode(true)
    setLoginCpf('')
    setLoginPassword('')
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setAdminMode(false)
    if (tab !== 'login') {
      setLoginCpf('')
      setLoginPassword('')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <div>
            <h1>Portal do Trabalhador</h1>
            <p>Bem-vindo de volta!</p>
          </div>
        </div>

        <div className="login-card__tabs">
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

        <div className="login-card__body">
          {activeTab === 'login' ? (
            <form onSubmit={handleSubmit} className="form-grid">
              {adminMode && (
                <div className="admin-note">
                  Login admin ativado. Use as credenciais salvas.
                </div>
              )}
              <div className="form-group">
                <label>CPF</label>
                <div className="input-group">
                  <IdCard className="input-icon" />
                  <input
                    type="text"
                    value={loginCpf}
                    onChange={(e) => handleCpfChange(e.target.value, setLoginCpf)}
                    placeholder="000.000.000-00"
                    maxLength="14"
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
                    onChange={(e) => {
                      setLoginPassword(e.target.value)
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-row form-row--space-between">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Lembrar-me</span>
                </label>
                <a href="#" className="link-secondary">
                  Esqueceu a senha?
                </a>
              </div>

              <button type="submit" className="button button--primary">
                Entrar
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-group">
                <label>Nome Completo</label>
                <div className="input-group">
                  <User className="input-icon" />
                  <input type="text" placeholder="Seu nome completo" />
                </div>
              </div>

              <div className="form-group">
                <label>CPF</label>
                <div className="input-group">
                  <IdCard className="input-icon" />
                  <input
                    type="text"
                    value={signupCpf}
                    onChange={(e) => handleCpfChange(e.target.value, setSignupCpf)}
                    placeholder="000.000.000-00"
                    maxLength="14"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Senha</label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowPassword(!showPassword)}
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
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="visibility-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <label className="checkbox-label checkbox-label--wide">
                <input type="checkbox" />
                <span>
                  Eu aceito os termos de uso e política de privacidade
                </span>
              </label>

              <button type="submit" className="button button--primary">
                Criar Conta
              </button>
            </form>
          )}
        </div>

        <div className="login-card__footer">
          <p>
            {activeTab === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              className="link-action"
              onClick={() => handleTabClick(activeTab === 'login' ? 'signup' : 'login')}
            >
              {activeTab === 'login' ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
          <button
            type="button"
            className="footer-admin-login-btn"
            onClick={handleAdminLogin}
          >
            Login Admin
          </button>
        </div>
      </div>
    </div>
  )
}