# Guia de Componentes e Utilitários

Este documento serve como referência técnica para o ecossistema de componentes reutilizáveis, funções utilitárias e integração de serviços da aplicação. 

---

## Componentes de Interface (UI)

### 1. Input
Componente de entrada de texto genérico com suporte a rótulos (labels), ícones dinâmicos e estados de erro.

```jsx
import Input from '@/components/Input'
import { IdCard } from 'lucide-react'

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

#### Propriedades (Props)
| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `label` | `string` | — | Texto de identificação posicionado acima do input. |
| `placeholder` | `string` | — | Texto de ajuda exibido internamente quando o campo está vazio. |
| `type` | `string` | `"text"` | Tipo nativo do input (ex: `text`, `email`, `number`). |
| `icon` | `LucideIcon` | — | Componente de ícone da biblioteca `lucide-react`. |
| `value` | `string` | — | Valor controlado do componente. |
| `onChange` | `function` | — | Callback disparado a cada alteração no valor do campo. |
| `error` | `string` | — | Mensagem de validação. Se fornecida, altera o estilo do input para o estado de erro. |
| `disabled` | `boolean` | `false` | Se `true`, desabilita a interação com o campo. |

---

### 2. Button
Componente de ação configurável por variantes estéticas e estados de carregamento.

```jsx
import Button from '@/components/Button'

export function MyForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    // Lógica assíncrona aqui
    setLoading(false)
  }

  return (
    <>
      {/* Variante Primary (Padrão do sistema) */}
      <Button onClick={handleSubmit} loading={loading}>
        Enviar
      </Button>

      {/* Variante Secondary */}
      <Button variant="secondary">Cancelar</Button>

      {/* Variante Ghost */}
      <Button variant="ghost">Voltar</Button>

      {/* Variações de Tamanho */}
      <Button size="small">Pequeno</Button>
      <Button size="medium">Médio</Button>
      <Button size="large">Grande (Full Width)</Button>
    </>
  )
}
```

#### Propriedades (Props)
| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Define o estilo visual e a precedência do botão. |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Define as dimensões e o comportamento de largura do botão. |
| `loading` | `boolean` | `false` | Se `true`, exibe um indicador de progresso (spinner) e desabilita interações. |
| `disabled` | `boolean` | `false` | Se `true`, impossibilita o clique e altera a opacidade do elemento. |
| `onClick` | `function` | — | Callback disparado ao clicar no botão. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Define o comportamento nativo do elemento HTML. |
| `children` | `ReactNode` | — | Conteúdo ou texto interno a ser renderizado. |

---

### 3. PasswordInput
Componente especializado para captura de senhas, contendo controle nativo de visibilidade e validações de segurança.

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

#### Propriedades (Props)
| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `"Senha"` | Texto de identificação do campo. |
| `placeholder` | `string` | — | Texto de ajuda interno. |
| `value` | `string` | — | Valor controlado do componente. |
| `onChange` | `function` | — | Callback disparado a cada alteração no valor. |
| `error` | `string` | — | Mensagem de validação de erro. |

#### Funcionalidades Inclusas
* Alternador visual integrado (exibir/ocultar senha) utilizando ícones `Eye` e `EyeOff`.
* Indicador visual integrado para análise de força/complexidade de senha.

---

### 4. Card
Container estrutural utilizado para agrupar conteúdos relacionados e segmentar layouts.

```jsx
import Card from '@/components/Card'

export function MyPage() {
  return (
    <Card>
      <h2>Título do Card</h2>
      <p>Conteúdo interno estruturado.</p>
    </Card>
  )
}
```

#### Propriedades (Props)
| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | — | Conteúdo a ser encapsulado pelo container. |
| `className` | `string` | — | Classes CSS adicionais (Tailwind) para customização pontual. |

---

### 5. Tabs
Componente de navegação local para alternar blocos de conteúdo na mesma visualização.

```jsx
import Tabs from '@/components/Tabs'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')

  const tabs = [
    { id: 'login', label: 'Login', content: <LoginForm /> },
    { id: 'signup', label: 'Cadastro', content: <SignupForm /> }
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

#### Propriedades (Props)
| Prop | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `activeTab` | `string` | — | ID da aba atualmente ativa no painel. |
| `setActiveTab` | `function` | — | Função disparada para atualizar o estado da aba ativa. |
| `tabs` | `Array<TabItem>` | — | Lista de objetos contendo as configurações de cada aba (veja estrutura abaixo). |

#### Estrutura do Objeto `TabItem`
```typescript
{
  id: string;       // Identificador exclusivo da aba
  label: string;    // Rótulo de texto exibido no botão da aba
  content: ReactNode; // Componente ou elemento renderizado ao ativar a aba
}
```

---

## Módulos Utilitários (Utilities)

### Validador e Formatador de CPF (`@/utils/cpfValidator`)
Funções focadas no tratamento e validação de strings contendo CPFs.

```jsx
import { formatCPF, unformatCPF, isValidCPF } from '@/utils/cpfValidator'

// Formata string numérica para o padrão visual: "000.000.000-00"
const formatted = formatCPF('12345678901') 

// Remove caracteres especiais, retornando apenas os dígitos (higienização para API)
const clean = unformatCPF('123.456.789-01') 

// Valida matematicamente os dígitos verificadores do CPF (retorna boolean)
const isValid = isValidCPF('123.456.789-01') 
```

### Validadores Genéricos (`@/utils/validators`)
Funções utilitárias para validação de regras de negócio em formulários.

```jsx
import { validatePassword, validateEmail } from '@/utils/validators'

// Valida os critérios mínimos de segurança de senhas
const pwdResult = validatePassword('Abc123!@')
// Retorno esperado: { isValid: boolean, errors: string[] }

// Valida a estrutura sintática de endereços de e-mail (retorna boolean)
const emailResult = validateEmail('user@example.com')
```

### Gerenciador de Tokens de Autenticação (`@/utils/tokenManager`)
Abstração para persistência e leitura de tokens JWT no ecossistema da aplicação.

```jsx
import {
  saveToken,
  getToken,
  removeToken,
  decodeToken,
  isTokenExpired,
  getUserIdFromToken,
} from '@/utils/tokenManager'

saveToken(token)              // Armazena o token na camada de persistência local
const token = getToken()       // Recupera o token ativo
removeToken()                 // Remove o token (operação de Logout)

const decoded = decodeToken(token) 
// Retorna o payload decodificado: { userId: number, cpf: string, exp: number, ... }

const expired = isTokenExpired(token) // Verifica se o tempo de expiração (`exp`) foi atingido
const userId = getUserIdFromToken(token) // Extrai diretamente o identificador do usuário
```

---

## Serviço de API (`@/services/apiService`)

O `apiService` encapsula as chamadas HTTP da aplicação. O gerenciamento de tokens é transparente e tratado automaticamente pelas camadas internas do serviço após o login.

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
      const response = await apiService.login(cpf, password)
      console.log('Autenticado com sucesso:', response.user.name)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
      <Button loading={loading} type="submit">Entrar</Button>
    </form>
  )
}
```

### Métodos Disponíveis

#### Autenticação & Registro
* `apiService.login(cpf, password)`: Realiza a autenticação e persiste o token de sessão.
* `apiService.register(cpf, email, password)`: Cria uma nova conta de usuário.
* `apiService.logout()`: Remove as credenciais de acesso da memória e armazenamento.

#### Gerenciamento de Usuário
* `apiService.fetchUserDataByCPF(cpf)`: Busca informações de um perfil específico via CPF.
* `apiService.getCurrentUser()`: Retorna os dados cadastrais do usuário autenticado.
* `apiService.updateUserData(userData)`: Atualiza as informações do perfil do usuário.

#### Vagas & Inscrições
* `apiService.getJobs()`: Lista as vagas disponíveis no sistema.
* `apiService.applyForJob(jobId, data)`: Registra a candidatura do usuário a uma vaga específica.
* `apiService.getUserApplications()`: Retorna o histórico de candidaturas feitas pelo usuário logado.

---

## Exemplo Prático: Formulário de Cadastro Completo

Abaixo está uma implementação padrão demonstrando a integração de componentes, regras de validação e comunicação com o serviço de API.

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

  const validateForm = () => {
    const newErrors = {}

    if (!isValidCPF(cpf)) newErrors.cpf = 'CPF inválido.'
    if (!validateEmail(email)) newErrors.email = 'E-mail inválido.'
    
    const pwdValidation = validatePassword(password)
    if (!pwdValidation.isValid) {
      newErrors.password = pwdValidation.errors.join(', ')
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      await apiService.register(
        unformatCPF(cpf),
        email,
        password
      )
      alert('Cadastro realizado com sucesso!')
    } catch (error) {
      alert(`Erro na operação: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2>Cadastro de Usuário</h2>

        <Input
          label="CPF"
          placeholder="000.000.000-00"
          icon={IdCard}
          value={cpf}
          onChange={(e) => setCpf(formatCPF(e.target.value))}
          error={errors.cpf}
        />

        <Input
          label="E-mail"
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

## Próximas Etapas de Desenvolvimento

1. [x] Homologar e documentar a estrutura básica de componentes de UI.
2. [x] Integrar utilitários de validação nas telas de autenticação.
3. [ ] Acoplamento e testes de segurança da camada de Backend.
4. [ ] Implementação de logs na camada de validação e persistência do CPF.
5. [ ] Garantir conformidade com diretrizes de privacidade de dados sensíveis (LGPD).

Para mais detalhes sobre a arquitetura global ou provisionamento do ambiente, consulte os guias complementar: [ARCHITECTURE.md](./ARCHITECTURE.md) e [BACKEND_SETUP.md](./BACKEND_SETUP.md).