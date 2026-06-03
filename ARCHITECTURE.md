# Documentação de Arquitetura - Portal Interno SINE

## Visão Geral do Sistema

O Portal Interno SINE é uma aplicação SPA (Single Page Application) desenvolvida sobre o ecossistema Vite e React. A arquitetura foi desenhada para priorizar a modularidade de componentes de interface, centralização de serviços de rede e conformidade rigorosa com boas práticas de segurança no manejo de dados cadastrais sensíveis.

---

## Estrutura Atual do Projeto

Mapeamento completo do diretório do projeto seguindo a árvore real de arquivos da aplicação:

```
PORTAL_INTERNO_SINE/
├── .github/                 # Workflows de CI/CD e automações do repositório
├── dist/                    # Artefatos compilados para produção (Build final)
├── node_modules/            # Dependências de terceiros gerenciadas via npm
├── src/                     # Código-fonte principal da aplicação
│   ├── components/          # Biblioteca interna de componentes modulares
│   │   ├── Button/          # Botão dinâmico com tratamento de variantes e estados
│   │   ├── Card/            # Container estrutural para agrupamento de blocos
│   │   ├── Checkbox/        # Componente de seleção binária de estado
│   │   ├── Input/           # Campo de texto genérico com tratamento de erros
│   │   ├── PasswordInput/   # Entrada de senha com alternador de visibilidade nativo
│   │   └── Tabs/            # Alternador de contexto em abas de navegação
│   ├── services/
│   │   └── apiService.js    # Camada centralizadora de consumo e interceptação de APIs HTTP
│   ├── style/
│   │   └── globals.css      # Folha de estilos globais e configurações do Tailwind
│   ├── utils/
│   │   ├── cpfValidator.js  # Utilitários de higienização, formatação e checksum de CPF
│   │   ├── tokenManager.js  # Abstração para persistência e verificação de tokens JWT
│   │   └── validators.js    # Validadores de regras de complexidade de e-mail e senha
│   ├── view/                # Páginas de escopo de rotas da aplicação (ex: Login, Cadastro)
│   ├── App.jsx              # Componente estrutural raiz do ecossistema React
│   └── main.jsx             # Ponto de entrada de renderização do Virtual DOM
├── .env                     # Definição local de variáveis de ambiente (Ignorado no Git)
├── .env.example             # Modelo de distribuição para configuração de ambiente
├── .gitignore               # Configurações de exclusão do controle de versão
├── AGENTS.md                # Documentação técnica focada em agentes do ecossistema
├── ARCHITECTURE.md          # Esta documentação de especificação de arquitetura
├── COMPONENTS_GUIDE.md      # Manual técnico de uso da biblioteca de componentes
├── index.html               # Arquivo HTML principal e casca de montagem da SPA
├── package-lock.json        # Árvore de resolução exata das dependências do ecossistema
├── package.json             # Manifest do projeto, scripts e controle de versões de pacotes
└── vite.config.js           # Arquivo de configuração de build e plugins do bundler Vite
```

---

## Diretrizes de Segurança e Privacidade

### Proteção de Dados Pessoais (LGPD)
* **CPF do Usuário:** Para mitigar riscos de vazamento de dados, o CPF nunca é mantido em estado persistente no ecossistema do navegador (`localStorage` ou `sessionStorage`). O dado reside estritamente em memória volátil durante a submissão de formulários.
* **Segurança de Credenciais:** Senhas de usuários em texto limpo não são trafegadas ou armazenadas; as rotas de envio operam estritamente sob criptografia de transporte TLS/HTTPS.

### Modelo de Autenticação JWT
* O armazenamento do token JWT de sessão é gerenciado pelo módulo `tokenManager.js` na camada de `localStorage`.
* Requisições autenticadas anexam automaticamente o token sob o formato padrão da indústria:
```http
Authorization: Bearer {token}
```

---

## Biblioteca de Componentes de Interface

Abaixo constam as abstrações mínimas para o reuso de componentes estruturados em `src/components/`:

* **Input:** Coleta de dados com suporte a máscaras visuais, estados dinâmicos de erro e injeção de ícones vetoriais.
* **Button:** Acionador de eventos parametrizável por variantes (`primary`, `secondary`, `ghost`), tamanhos (`small`, `medium`, `large`) e indicador síncrono de carregamento (`loading`).
* **PasswordInput:** Encapsula o estado local de visibilidade e regras de legibilidade de caracteres da senha.
* **Checkbox:** Utilizado para captura de consentimentos, termos de uso e validações binárias.
* **Card & Tabs:** Componentes de alto nível focados no particionamento visual de formulários de autenticação.

---

## Contrato de Integração com o Backend

O frontend consome uma arquitetura RESTful que expõe os seguintes serviços essenciais:

| Método | Endpoint da API | Contexto do Serviço |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Autenticação do trabalhador e devolução de token JWT. |
| `POST` | `/api/auth/register` | Registro cadastral de novas credenciais. |
| `POST` | `/api/auth/logout` | Encerramento e invalidação de sessão ativa. |
| `POST` | `/api/users/cpf-lookup` | Validação de restrições ou duplicidade cadastral de CPF. |
| `GET` | `/api/users/me` | Coleta de dados do perfil do usuário em sessão. |
| `GET` | `/api/jobs` | Consulta de vagas ativas integradas ao SINE. |

---

## Política de Governança de Código

1. **Validação Redundante:** Validações de máscara e formato feitas no frontend têm propósito exclusivo de melhorar a experiência do usuário (UX). É obrigatório que o backend processe a validação lógica final de todas as entradas.
2. **Ciclo de Vida do Token:** Qualquer reposta HTTP com status `401 Unauthorized` mapeada pelo `apiService.js` deve disparar a limpeza de cache via `removeToken()` e forçar o redirecionamento imediato do usuário para a página de login.
3. **Gerenciamento de Variáveis:** Configurações de chaves de API e URLs de microsserviços devem ser resolvidas dinamicamente via objeto `import.meta.env.VITE_API_URL` abstraído no arquivo `.env`.