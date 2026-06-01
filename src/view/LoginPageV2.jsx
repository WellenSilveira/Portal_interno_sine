import { useState } from 'react'
import { IdCard, Mail } from 'lucide-react'
import Input from '../components/Input'
import Button from '../components/Button'
import PasswordInput from '../components/PasswordInput'
import Card from '../components/Card'
import Tabs from '../components/Tabs'
import apiService from '../services/apiService'
import { formatCPF, unformatCPF, isValidCPF } from '../utils/cpfValidator'
import { validateEmail, validatePassword } from '../utils/validators'
import './LoginPageV2.css'

export default function LoginPageV2() {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)

  // Estado do Login
  const [loginData, setLoginData] = useState({
    cpf: '',
    password: '',
  })
  const [loginErrors, setLoginErrors] = useState({})

  // Estado do Signup
  const [signupData, setSignupData] = useState({
    cpf: '',
    email: '',
    password: '',
    confirmPassword: '',
    userData: null, // Dados buscados do CPF
  })
  const [signupErrors, setSignupErrors] = useState({})

  // ========== LOGIN ==========
  const handleLoginChange = (field, value) => {
    setLoginData({ ...loginData, [field]: value })
    setLoginErrors({ ...loginErrors, [field]: '' })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!isValidCPF(loginData.cpf)) {
      errors.cpf = 'CPF inválido'
    }
    if (!loginData.password) {
      errors.password = 'Senha é obrigatória'
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }

    setLoading(true)
    try {
      const response = await apiService.login(
        unformatCPF(loginData.cpf),
        loginData.password
      )

      alert(`Login bem-sucedido! Bem-vindo, ${response.user.name}`)
      // Aqui você redirecionaria para o dashboard
    } catch (error) {
      alert(`Erro no login: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // ========== SIGNUP - PASSO 1: Validar CPF ==========
  const handleSignupCpfChange = (value) => {
    const formatted = formatCPF(value)
    setSignupData({ ...signupData, cpf: formatted })
    setSignupErrors({ ...signupErrors, cpf: '' })
  }

  const handleFetchCpfData = async () => {
    if (!isValidCPF(signupData.cpf)) {
      setSignupErrors({ ...signupErrors, cpf: 'CPF inválido' })
      return
    }

    setLoading(true)
    try {
      // Busca dados do CPF (de forma segura via backend)
      const userData = await apiService.fetchUserDataByCPF(
        unformatCPF(signupData.cpf)
      )

      setSignupData({
        ...signupData,
        userData: {
          name: userData.name,
          email: userData.email,
        },
      })
      alert('Dados carregados com sucesso!')
    } catch (error) {
      setSignupErrors({
        ...signupErrors,
        cpf: `${error.message}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // ========== SIGNUP - PASSO 2: Completar cadastro ==========
  const handleSignupChange = (field, value) => {
    setSignupData({ ...signupData, [field]: value })
    setSignupErrors({ ...signupErrors, [field]: '' })
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    const errors = {}

    if (!signupData.userData) {
      errors.cpf = 'Valide seu CPF primeiro'
    }
    if (!validateEmail(signupData.email)) {
      errors.email = 'Email inválido'
    }

    const passwordValidation = validatePassword(signupData.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors.join(', ')
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem'
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors)
      return
    }

    setLoading(true)
    try {
      await apiService.register(
        unformatCPF(signupData.cpf),
        signupData.email,
        signupData.password
      )

      alert('Cadastro realizado com sucesso! Faça login para continuar.')
      setActiveTab('login')
      setSignupData({
        cpf: '',
        email: '',
        password: '',
        confirmPassword: '',
        userData: null,
      })
    } catch (error) {
      alert(`Erro no cadastro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // ========== COMPONENTES DAS ABAS ==========
  const loginContent = (
    <form onSubmit={handleLoginSubmit} className="form">
      <h2>Login</h2>
      <p className="form-subtitle">Entre com seus dados de acesso</p>

      <Input
        label="CPF"
        placeholder="000.000.000-00"
        icon={IdCard}
        value={loginData.cpf}
        onChange={(e) => handleLoginChange('cpf', formatCPF(e.target.value))}
        error={loginErrors.cpf}
      />

      <PasswordInput
        label="Senha"
        placeholder="Digite sua senha"
        value={loginData.password}
        onChange={(e) => handleLoginChange('password', e.target.value)}
        error={loginErrors.password}
      />

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={loading}
        disabled={loading}
      >
        Entrar
      </Button>

      <p className="form-footer">
        Não tem conta? <a href="#signup">Cadastre-se aqui</a>
      </p>
    </form>
  )

  const signupContent = (
    <form onSubmit={handleSignupSubmit} className="form">
      <h2>Cadastro</h2>
      <p className="form-subtitle">Crie sua conta para candidatar-se</p>

      {!signupData.userData ? (
        <>
          <div className="cpf-verification">
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              icon={IdCard}
              value={signupData.cpf}
              onChange={(e) => handleSignupCpfChange(e.target.value)}
              error={signupErrors.cpf}
              disabled={loading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleFetchCpfData}
              loading={loading}
              disabled={loading || !signupData.cpf}
            >
              Verificar CPF
            </Button>
          </div>
          <p className="cpf-note">
            ℹ️ Verificaremos seus dados com segurança. Seus dados pessoais
            nunca serão acessíveis por administradores.
          </p>
        </>
      ) : (
        <>
          <div className="user-data-display">
            <div className="data-item">
              <strong>Nome:</strong>
              <span>{signupData.userData.name}</span>
            </div>
            <div className="data-item">
              <strong>Email Sugerido:</strong>
              <span>{signupData.userData.email}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="small"
              onClick={() =>
                setSignupData({
                  ...signupData,
                  userData: null,
                  cpf: '',
                })
              }
            >
              Usar outro CPF
            </Button>
          </div>

          <Input
            label="Email para Recuperação de Senha"
            placeholder="seu.email@example.com"
            type="email"
            icon={Mail}
            value={signupData.email}
            onChange={(e) => handleSignupChange('email', e.target.value)}
            error={signupErrors.email}
          />

          <PasswordInput
            label="Senha"
            placeholder="Digite uma senha forte"
            value={signupData.password}
            onChange={(e) => handleSignupChange('password', e.target.value)}
            error={signupErrors.password}
          />

          <PasswordInput
            label="Confirmar Senha"
            placeholder="Repita a senha"
            value={signupData.confirmPassword}
            onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
            error={signupErrors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading}
          >
            Criar Conta
          </Button>
        </>
      )}

      <p className="form-footer">
        Já tem conta? <a href="#login">Faça login aqui</a>
      </p>
    </form>
  )

  const tabs = [
    { id: 'login', label: 'Login', content: loginContent },
    { id: 'signup', label: 'Cadastro', content: signupContent },
  ]

  return (
    <div className="login-container">
      <Card>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      </Card>
    </div>
  )
}
