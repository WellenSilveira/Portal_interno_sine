# Portal Interno SINE - Documentação da Arquitetura

## 📋 Visão Geral

Projeto estruturado em componentes reutilizáveis com autenticação JWT segura e proteção de dados pessoais.

## 🏗️ Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── Input/              # Input genérico com validação
│   ├── Button/             # Botão com variantes
│   ├── Card/               # Container de conteúdo
│   ├── Tabs/               # Sistema de abas
│   └── PasswordInput/       # Input de senha com toggle
├── services/
│   └── apiService.js       # Serviço de chamadas à API
├── utils/
│   ├── cpfValidator.js     # Validação e formatação de CPF
│   ├── tokenManager.js     # Gerenciamento de JWT
│   └── validators.js       # Validadores gerais (email, senha)
├── view/
│   ├── LoginPage.jsx       # Versão original
│   └── LoginPageV2.jsx     # Nova versão com componentes
└── style/
    └── globals.css         # Estilos globais
```

## 🔐 Segurança e Privacidade

### Dados Sensíveis
- **CPF do usuário**: Validado no backend, nunca armazenado no frontend
- **Dados pessoais**: Armazenados apenas no banco de dados seguro, criptografados
- **Senhas**: Hash bcrypt no backend, nunca transmitidas em plain text
- **Token JWT**: Armazenado em localStorage com expiração

### Controle de Acesso
- Admin NUNCA tem acesso aos dados pessoais dos usuários
- Cada usuário só acessa seus próprios dados
- Token JWT valida cada requisição

## 📦 Componentes Reutilizáveis

### Input
```jsx
<Input
  label="CPF"
  placeholder="000.000.000-00"
  icon={IdCard}
  value={cpf}
  onChange={(e) => setCpf(e.target.value)}
  error={errors.cpf}
/>
```

### Button
```jsx
<Button
  variant="primary" | "secondary" | "ghost"
  size="small" | "medium" | "large"
  loading={isLoading}
  disabled={isDisabled}
  onClick={handleClick}
>
  Texto do botão
</Button>
```

### PasswordInput
```jsx
<PasswordInput
  label="Senha"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
/>
```

### Card
```jsx
<Card>
  Conteúdo do card
</Card>
```

### Tabs
```jsx
<Tabs
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  tabs={[
    { id: 'login', label: 'Login', content: <LoginForm /> },
    { id: 'signup', label: 'Cadastro', content: <SignupForm /> },
  ]}
/>
```

## 🔌 API Service

### Métodos Disponíveis

```javascript
// Autenticação
apiService.login(cpf, password)
apiService.register(cpf, email, password)
apiService.logout()

// Usuário
apiService.fetchUserDataByCPF(cpf)      // Busca dados do CPF
apiService.getCurrentUser()              // Obtém dados do usuário logado
apiService.updateUserData(userData)      // Atualiza dados do usuário

// Vagas/Candidaturas (exemplos)
apiService.getJobs()
apiService.applyForJob(jobId, data)
apiService.getUserApplications()
```

## 🛠️ Utilities

### CPF Validator
```javascript
import { formatCPF, unformatCPF, isValidCPF } from '@/utils/cpfValidator'

const formatted = formatCPF('12345678901')  // "123.456.789-01"
const clean = unformatCPF('123.456.789-01') // "12345678901"
const valid = isValidCPF('123.456.789-01')  // true/false
```

### Token Manager
```javascript
import { saveToken, getToken, removeToken, decodeToken } from '@/utils/tokenManager'

saveToken(token)
const token = getToken()
removeToken()
const decoded = decodeToken(token)
```

### Validators
```javascript
import { validatePassword, validateEmail } from '@/utils/validators'

const pwd = validatePassword('Senha123!')
// { isValid: true, errors: [] }

const email = validateEmail('user@example.com') // true/false
```

## 🔄 Fluxo de Autenticação

### 1. Cadastro
1. Usuário insere CPF
2. Backend valida CPF contra banco de dados do governo
3. Dados do usuário são buscados (nome, email)
4. Usuário confirma email e cria senha
5. Dados são armazenados no banco com criptografia

### 2. Login
1. Usuário insere CPF e senha
2. Backend valida credenciais
3. JWT é gerado com prazo de expiração (ex: 24h)
4. Token é armazenado no localStorage
5. Headers de requisição incluem o token

### 3. Requisições Autenticadas
Cada requisição inclui:
```
Authorization: Bearer {token}
```

Backend valida o token e retorna erro 401 se inválido.

## 🚀 Como Usar a Nova LoginPage

### No App.jsx
```jsx
import LoginPageV2 from './view/LoginPageV2'

export default function App() {
  return <LoginPageV2 />
}
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:
```
VITE_API_URL=http://localhost:3001/api
```

## ✅ Requisitos de Senha

- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%^&*)

## 🔗 Backend Necessário

O frontend espera um backend com os seguintes endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/users/cpf-lookup
GET    /api/users/me
PUT    /api/users/me
GET    /api/jobs
POST   /api/jobs/:id/apply
GET    /api/applications/me
```

Ver documentação de backend em [Backend Setup](#backend-setup).

## 🐛 Troubleshooting

### Token expirado?
O ApiService detecta automaticamente e solicita novo login.

### CPF inválido?
Use a função `isValidCPF()` para validar antes de enviar.

### CORS error?
Configure CORS no backend:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

---

**Desenvolvido com segurança em primeiro lugar** 🔒
