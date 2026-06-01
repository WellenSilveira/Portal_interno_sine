# 📚 Guia Rápido de Componentes

## 🎯 Como Usar os Componentes

### 1️⃣ Input (Campo de texto genérico)

```jsx
import Input from '@/components/Input'
import { IdCard, Mail } from 'lucide-react'

export function MyForm() {
  const [cpf, setCpf] = useState('')
  const [error, setError] = useState('')

  return (
    <Input
      label="CPF"
      placeholder="000.000.000-00"
      icon={IdCard}
      value={cpf}
      onChange={(e) => setCpf(e.target.value)}
      error={error}
      disabled={false}
    />
  )
}
```

**Props:**
- `label` - Texto do label
- `placeholder` - Placeholder
- `type` - Tipo de input (default: "text")
- `icon` - Componente de ícone (lucide-react)
- `value` - Valor do input
- `onChange` - Função ao mudar
- `error` - Mensagem de erro
- `disabled` - Desabilitar input

---

### 2️⃣ Button (Botão reutilizável)

```jsx
import Button from '@/components/Button'

export function MyForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    // Fazer algo
    setLoading(false)
  }

  return (
    <>
      {/* Variante Primary (vermelho - padrão) */}
      <Button onClick={handleSubmit} loading={loading}>
        Enviar
      </Button>

      {/* Variante Secondary (cinza) */}
      <Button variant="secondary">
        Cancelar
      </Button>

      {/* Variante Ghost (sem fundo) */}
      <Button variant="ghost">
        Voltar
      </Button>

      {/* Tamanhos */}
      <Button size="small">Pequeno</Button>
      <Button size="medium">Médio (padrão)</Button>
      <Button size="large">Grande (full width)</Button>
    </>
  )
}
```

**Props:**
- `variant` - "primary" | "secondary" | "ghost"
- `size` - "small" | "medium" | "large"
- `loading` - Mostra spinner e desabilita
- `disabled` - Desabilita o botão
- `onClick` - Função ao clicar
- `type` - Tipo de botão (padrão: "button")
- `children` - Conteúdo do botão

---

### 3️⃣ PasswordInput (Input de senha com toggle)

```jsx
import PasswordInput from '@/components/PasswordInput'

export function MyForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  return (
    <PasswordInput
      label="Senha"
      placeholder="Digite sua senha"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      error={error}
    />
  )
}
```

**Props:**
- `label` - Texto do label (padrão: "Senha")
- `placeholder` - Placeholder
- `value` - Valor da senha
- `onChange` - Função ao mudar
- `error` - Mensagem de erro

**Features:**
- ✅ Toggle para mostrar/esconder senha
- ✅ Ícone de olho (Eye/EyeOff do lucide-react)
- ✅ Validação de força da senha

---

### 4️⃣ Card (Container de conteúdo)

```jsx
import Card from '@/components/Card'

export function MyPage() {
  return (
    <Card>
      <h2>Título do Card</h2>
      <p>Conteúdo aqui...</p>
    </Card>
  )
}
```

**Props:**
- `children` - Conteúdo do card
- `className` - Classes CSS adicionais

---

### 5️⃣ Tabs (Sistema de abas)

```jsx
import Tabs from '@/components/Tabs'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')

  const tabs = [
    {
      id: 'login',
      label: 'Login',
      content: <LoginForm />,
    },
    {
      id: 'signup',
      label: 'Cadastro',
      content: <SignupForm />,
    },
  ]

  return (
    <Tabs 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      tabs={tabs}
    />
  )
}
```

**Props:**
- `activeTab` - ID da aba ativa
- `setActiveTab` - Função para mudar aba
- `tabs` - Array de abas
  - `id` - Identificador único
  - `label` - Texto da aba
  - `content` - Componente/conteúdo

---

## 🛠️ Utilities

### CPF Validator

```jsx
import { 
  formatCPF, 
  unformatCPF, 
  isValidCPF 
} from '@/utils/cpfValidator'

// Formatar para exibição
const formatted = formatCPF('12345678901')
// "123.456.789-01"

// Remover máscara para enviar
const clean = unformatCPF('123.456.789-01')
// "12345678901"

// Validar CPF com checksum
const isValid = isValidCPF('123.456.789-01')
// true/false
```

### Validators

```jsx
import { 
  validatePassword, 
  validateEmail 
} from '@/utils/validators'

// Validar senha (retorna objeto com erros)
const pwd = validatePassword('Abc123!@')
// {
//   isValid: true,
//   errors: []
// }

// Validar email
const email = validateEmail('user@example.com')
// true/false
```

### Token Manager

```jsx
import {
  saveToken,
  getToken,
  removeToken,
  decodeToken,
  isTokenExpired,
  getUserIdFromToken,
} from '@/utils/tokenManager'

// Salvar token
saveToken(token)

// Recuperar token
const token = getToken()

// Remover token
removeToken()

// Decodificar token (sem validação)
const decoded = decodeToken(token)
// { userId: 123, cpf: '***', iat: 1234, exp: 5678 }

// Verificar se expirou
const expired = isTokenExpired(token)
// true/false

// Obter ID do usuário
const userId = getUserIdFromToken(token)
// 123
```

---

## 📡 API Service

```jsx
import apiService from '@/services/apiService'

export function LoginForm() {
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Login
      const response = await apiService.login(cpf, password)
      console.log('Bem-vindo!', response.user.name)
      // Token é salvo automaticamente
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <Button loading={loading} type="submit">
        Entrar
      </Button>
    </form>
  )
}
```

**Métodos:**

```javascript
// Auth
apiService.login(cpf, password)
apiService.register(cpf, email, password)
apiService.logout()

// User
apiService.fetchUserDataByCPF(cpf)
apiService.getCurrentUser()
apiService.updateUserData(userData)

// Jobs
apiService.getJobs()
apiService.applyForJob(jobId, data)
apiService.getUserApplications()
```

---

## 🎨 Exemplo Completo: Formulário de Cadastro

```jsx
import { useState } from 'react'
import { IdCard, Mail } from 'lucide-react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import PasswordInput from '@/components/PasswordInput'
import Card from '@/components/Card'
import apiService from '@/services/apiService'
import { formatCPF, unformatCPF, isValidCPF } from '@/utils/cpfValidator'
import { validatePassword, validateEmail } from '@/utils/validators'

export function SignupForm() {
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validações
    if (!isValidCPF(cpf)) newErrors.cpf = 'CPF inválido'
    if (!validateEmail(email)) newErrors.email = 'Email inválido'
    
    const pwdValidation = validatePassword(password)
    if (!pwdValidation.isValid) {
      newErrors.password = pwdValidation.errors.join(', ')
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await apiService.register(
        unformatCPF(cpf),
        email,
        password
      )
      alert('Cadastro realizado com sucesso!')
    } catch (error) {
      alert(`Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2>Cadastro</h2>

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          icon={IdCard}
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          error={errors.cpf}
        />

        <Input
          label="Email"
          placeholder="seu@email.com"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <PasswordInput
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <PasswordInput
          label="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button 
          type="submit" 
          size="large" 
          loading={loading}
        >
          Criar Conta
        </Button>
      </form>
    </Card>
  )
}
```

---

## 📖 Próximos Passos

1. ✅ Entender a estrutura de componentes
2. ✅ Usar componentes nos seus formulários
3. ⏳ Criar backend com segurança
4. ⏳ Integrar API de validação de CPF
5. ⏳ Implementar proteção de dados sensíveis

Ver mais em [ARCHITECTURE.md](./ARCHITECTURE.md) e [BACKEND_SETUP.md](./BACKEND_SETUP.md)
