# AGENTS.md - Portal Interno SINE

Guia para agentes de IA trabalharem produtivamente neste repositório.

## 🎯 Visão Geral do Projeto

**Portal Interno SINE** é uma plataforma de emprego (job portal) que conecta usuários com vagas de emprego.

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + React Router
- **Stack**: axios para API, Lucide React para ícones, JWT para autenticação

## 🚀 Workflow de Desenvolvimento

### Iniciar o servidor de desenvolvimento
```bash
npm install          # Instalar dependências
npm run dev          # Inicia Vite na porta 3000
```

### Build para produção
```bash
npm run build        # Compila TypeScript + Vite
npm run preview      # Preview da build
```

### Qualidade de código
```bash
npm run lint         # Verifica com ESLint
npm run format       # Formata com Prettier
```

**Nota**: Vite está configurado com `@` como alias para `src/` no `vite.config.js`.

## 🏗️ Estrutura e Convenções

### Componentes Reutilizáveis
Todos em `src/components/` com estrutura padrão:
```
components/
├── Button/
│   ├── Button.jsx       # Componente principal
│   ├── Button.css       # Estilos isolados
│   └── index.js         # Exporta Button.jsx
```

**Variantes de Button**: `primary` (padrão), `secondary`, `ghost`  
**Tamanhos**: `small`, `medium` (padrão), `large`

Veja [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md) para uso detalhado de:
- **Input**: Campo genérico com ícone e validação
- **PasswordInput**: Input de senha com toggle de visibilidade
- **Card**: Container de conteúdo
- **Tabs**: Sistema de abas

### Serviços e Utilitários
- **`src/services/apiService.js`**: Gerencia requisições HTTP com JWT automático
- **`src/utils/cpfValidator.js`**: Validação e formatação de CPF
- **`src/utils/tokenManager.js`**: Gerenciamento de JWT (salva/remove em localStorage)
- **`src/utils/validators.js`**: Validadores genéricos (email, senha, etc)

## 🔐 Regras de Segurança (CRÍTICO)

**NUNCA** fazer no frontend:
- ❌ Armazenar CPF ou dados sensíveis no localStorage (exceto JWT token)
- ❌ Enviar CPF em texto plano para a API
- ❌ Exibir dados sensíveis em console.log em produção
- ❌ Assumir que validações frontend são suficientes (sempre validar no backend)

**SEMPRE** fazer:
- ✅ Validar input do usuário com funções de `src/utils/validators.js`
- ✅ Usar `apiService` para todas as requisições (inclui JWT automaticamente)
- ✅ Usar `tokenManager` para salvar/verificar JWT
- ✅ Remover token se estiver expirado

Detalhes: Veja [ARCHITECTURE.md](ARCHITECTURE.md#-segurança-e-privacidade)

## 📋 Padrões Comuns

### Buscar dados da API
```jsx
import apiService from '@/services/apiService'

const response = await apiService.request('/users/profile', {
  method: 'GET'
})
```

### Salvar token após login
```jsx
import { saveToken } from '@/utils/tokenManager'

const { token } = await apiService.request('/auth/login', {
  method: 'POST',
  body: { cpf, password }
})
saveToken(token)
```

### Validar CPF antes de enviar
```jsx
import { validateCPF } from '@/utils/cpfValidator'

if (!validateCPF(cpf)) {
  setError('CPF inválido')
  return
}
```

### Criar formulário com componentes reutilizáveis
Use `LoginPage.jsx` como exemplo. Padrão:
1. Import dos componentes em `src/components/`
2. State para valores e erros
3. Função de validação antes de submit
4. Usar `apiService` para requisição
5. Mostrar erros com prop `error` dos componentes

## 📍 Arquivos-chave

| Arquivo | Propósito |
|---------|-----------|
| [src/App.jsx](src/App.jsx) | Ponto de entrada da aplicação |
| [src/main.jsx](src/main.jsx) | Renderização do React |
| [vite.config.js](vite.config.js) | Config Vite (alias `@` → `src/`) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitetura, componentes, segurança |
| [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md) | Como usar cada componente |


## 💡 Quando Modificar Componentes

1. **Novo componente reutilizável**: Criar pasta em `src/components/{NomeComponente}/` com estrutura padrão
2. **Bug em componente**: Verificar CSS isolado antes de tocar no JavaScript
3. **Nova variante**: Adicionar prop no componente e documentar em [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md)

## 🔄 Integração com API

Toda integração é feita via `apiService`:
1. Usar `apiService.request()` com header JWT automático
2. Tratar erros e expiração de token (veja `tokenManager.checkTokenValidity()`)
3. Validar dados no frontend com `src/utils/validators.js`

## 🐛 Debugging

- Verificar console do navegador (devtools)
- Token expirado? Limpar localStorage e fazer login novamente
- Componente quebrado? Conferir props necessárias em [COMPONENTS_GUIDE.md](COMPONENTS_GUIDE.md)

## ❓ Dúvidas Comuns

**P: Por que usar `@/` para imports?**  
R: Alias definido em `vite.config.js`, melhora legibilidade (`@/components/Button` vs `../../../components/Button`)

**P: Onde armazenar dados do usuário logado?**  
R: Token JWT em localStorage via `tokenManager.saveToken()`. Dados sensíveis (CPF, etc) NUNCA no frontend.

**P: Como adicionar novo validador?**  
R: Adicionar função em `src/utils/validators.js` seguindo padrão existente.

**P: Como configurar a URL da API?**  
R: Via variável de ambiente `VITE_API_URL` no `.env` (padrão: `http://localhost:3001/api`)
