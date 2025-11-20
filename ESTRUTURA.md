# 📁 Estrutura do Projeto CloudTech Frontend

## Árvore do Projeto

```
cloudtech-front/
├── public/                     # Arquivos estáticos
│   └── assets/                # Logos, imagens, ícones
│
├── src/
│   ├── app/                   # Rotas Next.js (App Router)
│   │   ├── layout.tsx         # Layout raiz com providers
│   │   ├── globals.css        # Estilos globais
│   │   ├── page.tsx           # Página inicial (/)
│   │   ├── login/
│   │   │   └── page.tsx       # Página de login
│   │   ├── signup/
│   │   │   └── page.tsx       # Página de registro
│   │   ├── dashboard/
│   │   │   └── page.tsx       # Dashboard - lista de empresas
│   │   ├── company/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Detalhes da empresa
│   │   ├── accept-invite/
│   │   │   └── [token]/
│   │   │       └── page.tsx   # Aceitar convite
│   │   └── not-found.tsx      # Página 404
│   │
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Header.tsx         # Header com logo e logout
│   │   ├── Spinner.tsx        # Loading spinner
│   │   ├── ErrorMessage.tsx   # Mensagem de erro
│   │   ├── ThemeSwitcher.tsx  # Toggle light/dark mode
│   │   ├── CreateCompanyModal.tsx  # Modal para criar empresa
│   │   └── InviteUserModal.tsx     # Modal para convidar usuário
│   │
│   ├── context/               # Context API para estado global
│   │   ├── AuthContext.tsx    # Autenticação (login/logout)
│   │   └── ThemeContext.tsx   # Tema (light/dark)
│   │
│   ├── services/              # Integração com API
│   │   ├── api.ts             # Instância Axios com interceptors
│   │   └── companyService.ts  # Funções para empresas, membros, convites
│   │
│   └── middleware.ts          # Proteção de rotas
│
├── .env.local                 # Variáveis de ambiente
├── .gitignore                 # Arquivos ignorados no Git
├── next.config.js             # Configuração Next.js
├── tailwind.config.js         # Configuração Tailwind CSS
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências do projeto
└── README.md                  # Documentação principal

```

---

## 📄 Descrição dos Arquivos Principais

### `src/app/layout.tsx`
- Layout raiz do Next.js
- Provê `AuthProvider` e `ThemeProvider`
- Metadados da página (título, descrição)

### `src/app/page.tsx`
- Página inicial que redireciona para login ou dashboard
- Verifica se usuário está autenticado

### `src/app/login/page.tsx`
- Formulário de login
- Design moderno com gradiente
- Logo CloudTech

### `src/app/signup/page.tsx`
- Formulário de registro
- Validação de senhas
- Auto-login após registro

### `src/app/dashboard/page.tsx`
- Grid responsivo de empresas
- Botão para criar empresa
- Paginação

### `src/app/company/[id]/page.tsx`
- Detalhes da empresa
- Tabela de membros
- Modal para convidar
- Geração de link de convite

### `src/app/accept-invite/[token]/page.tsx`
- Página para aceitar convites
- Validação de token
- Redirecionamento automático

### `src/components/Header.tsx`
- Header com logo CloudTech
- Botão de logout
- Theme switcher

### `src/components/CreateCompanyModal.tsx`
- Modal para criar empresa
- Campo de nome e logo URL
- Preview da logo

### `src/components/InviteUserModal.tsx`
- Modal para convidar membro
- Seletor de role (MEMBER, ADMIN, OWNER)
- Geração de link de convite
- Botão de copiar link

### `src/services/api.ts`
- Instância Axios
- Request interceptor (adiciona token)
- Response interceptor (trata 401)

### `src/services/companyService.ts`
- `getCompanies()` - Listar empresas
- `createCompany()` - Criar empresa
- `getCompanyById()` - Get detalhes
- `updateCompany()` - Atualizar
- `deleteCompany()` - Deletar
- `switchCompany()` - Alternar ativa
- `createInvite()` - Gerar convite
- `acceptInvite()` - Aceitar convite
- `addMember()`, `updateMember()`, `removeMember()` - Gerenciar membros

### `src/context/AuthContext.tsx`
- Context para autenticação
- `useAuth()` hook customizado
- Funções `login()` e `logout()`

### `src/context/ThemeContext.tsx`
- Context para tema
- Integração com next-themes
- Suporte a dark mode

### `src/middleware.ts`
- Proteção de rotas
- Verifica token em cookies
- Redireciona para login se necessário
- Permite `/accept-invite/*` sem autenticação

---

## 🎨 Tailwind CSS

### Classes Utilizadas

#### Cores
- `bg-blue-600`, `bg-blue-700` - Primárias
- `text-white`, `text-gray-900` - Textos
- `dark:bg-gray-800` - Modo escuro
- `hover:bg-blue-700` - Hover states

#### Layout
- `flex`, `grid`, `absolute`, `relative`
- `px-4`, `py-2` - Padding
- `mt-4`, `mb-6` - Margin
- `w-full`, `h-screen` - Dimensões

#### Responsividade
- `sm:`, `md:`, `lg:` - Breakpoints
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Grid responsivo

#### Estados
- `hover:`, `focus:`, `disabled:`, `dark:`
- `transition-all`, `animate-spin` - Animações

---

## 🔐 Fluxo de Autenticação

```
1. Usuário vai para /login
2. Faz request POST /auth/login
3. Backend retorna accessToken
4. Token é salvo em cookie 'auth-token'
5. useAuth().login() atualiza estado
6. Redireciona para /dashboard
7. Middleware adiciona token automaticamente em todas as requisições
8. Se token expirar (401), redireciona para /login
```

---

## 🔄 Fluxo de Convidar Membro

```
1. Usuário vai para /company/[id]
2. Clica em "Invite Member"
3. Modal abre com campos email, role
4. Submete form
5. createInvite() é chamado
6. API gera link de convite
7. Link é exibido no modal
8. Usuário copia e compartilha
9. Destinatário acessa /accept-invite/[token]
10. Clica "Accept Invitation"
11. acceptInvite() é chamado
12. Redireciona para /login
13. Após login, tem acesso à empresa
```

---

## 🌙 Dark Mode

```
ThemeContext (next-themes)
    ↓
Detecta sistema operacional
    ↓
Aplica classe 'dark' ao elemento <html>
    ↓
Tailwind CSS aplica estilos dark:*
    ↓
Componentes usam dark:bg-gray-800, dark:text-white, etc
```

---

## 📱 Responsividade

```
Mobile (< 640px)
├── 1 coluna no grid
├── Full width em modals
└── Stacked layout

Tablet (640px - 1024px)
├── 2 colunas no grid
├── Sidebar visível
└── Tabelas scrolláveis

Desktop (> 1024px)
├── 3 colunas no grid
├── Layout completo
└── Todos elementos visíveis
```

---

## 🧩 Composição de Componentes

```
layout.tsx (raiz)
    ├── ThemeProvider
    │   └── AuthProvider
    │       └── Página (página.tsx)
    │           ├── Header (se protegida)
    │           ├── Main Content
    │           └── Modal (opcional)
    │               ├── Spinner
    │               └── ErrorMessage
    │
    └── Scripts Globais (se houver)
```

---

## 🔌 Hooks Customizados

### useAuth()
```typescript
const { isAuthenticated, login, logout } = useAuth();
```

### useTheme() (next-themes)
```typescript
const { theme, setTheme } = useTheme();
```

### useRouter() (next/navigation)
```typescript
const router = useRouter();
router.push('/dashboard');
```

---

## 📦 Dependências Principais

```json
{
  "next": "14.0.4",           // Framework
  "react": "^18",              // Library
  "typescript": "^5",          // Tipagem
  "tailwindcss": "^3.3.0",     // Estilos
  "axios": "^1.6.2",           // HTTP Client
  "js-cookie": "^3.0.5",       // Cookies
  "next-themes": "^0.2.1"      // Dark Mode
}
```

---

## ⚙️ Configurações

### `next.config.js`
- Configurações do Next.js
- Plugins, builds, otimizações

### `tsconfig.json`
- Configurações TypeScript
- Path aliases (`@/`)
- Strict mode habilitado

### `tailwind.config.js`
- Customizações de cores
- Plugins (formulários, tipografia)
- Extensões de variantes

### `postcss.config.js`
- Tailwind CSS e Autoprefixer
- Processamento de CSS

---

## 🚀 Scripts Available

```bash
npm run dev      # Inicia dev server na porta 7000
npm run build    # Build para produção
npm start        # Inicia servidor produção
npm run lint     # Executa ESLint
```

---

## 📝 Convenções de Código

### Nomenclatura
- Componentes: `PascalCase` (e.g., `Header.tsx`)
- Funções: `camelCase` (e.g., `handleSubmit()`)
- Constantes: `UPPER_SNAKE_CASE` (e.g., `API_URL`)

### Imports
```typescript
// Services
import { getCompanies } from '@/services/companyService';

// Componentes
import Header from '@/components/Header';

// Context
import { useAuth } from '@/context/AuthContext';

// APIs
import api from '@/services/api';
```

### Tipos
```typescript
interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  members?: Member[];
}

type Role = 'MEMBER' | 'ADMIN' | 'OWNER';
```

---

## 🔍 Debug

### Console do Navegador
- Erros do Axios aparecem em vermelho
- Token é visível em Cookies (Dev Tools)
- Modo dark aparece em html[class~="dark"]

### Network
- Verifique os headers (Authorization: Bearer token)
- Verifique status code (200, 401, 500, etc)
- Verifique payload (request/response)

### React DevTools
- Verifique state em componentes
- Verifique props passadas
- Verifique re-renders

---

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

## ✅ Checklist de Desenvolvimento

- [ ] Instalar dependências (`npm install`)
- [ ] Configurar `.env.local`
- [ ] Iniciar dev server (`npm run dev`)
- [ ] Testar login/signup
- [ ] Testar criar empresa
- [ ] Testar convidar membro
- [ ] Testar aceitar convite
- [ ] Testar dark mode
- [ ] Testar responsividade
- [ ] Testar logout
- [ ] Build para produção (`npm run build`)

---

**Projeto bem estruturado e pronto para produção! 🚀**
