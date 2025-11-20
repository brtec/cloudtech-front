# CloudTech Frontend - Guia Rápido de Uso

## 🎉 Tudo Pronto!

Todas as páginas e funcionalidades foram implementadas com sucesso. Aqui está o guia para usar a plataforma.

---

## 📍 Rotas Disponíveis

### Públicas (sem autenticação)
- `/` - Página inicial (redireciona para login ou dashboard)
- `/login` - Login
- `/signup` - Criar conta
- `/accept-invite/[token]` - Aceitar convite (usa token da URL)

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard com lista de empresas
- `/company/[id]` - Detalhes da empresa

---

## 🚀 Como Começar

### 1. Login
```
Acesse: http://localhost:7000/login
- Email: seu@email.com
- Senha: sua_senha
```

### 2. Criar Conta
```
Acesse: http://localhost:7000/signup
- Nome: Seu Nome
- Email: seu@email.com
- Senha: mínimo 6 caracteres
→ Auto-login após criar conta
```

### 3. Dashboard
```
Após login, você acessa automaticamente o dashboard
- Ver todas suas empresas em um grid responsivo
- Botão "New Company" para criar empresa
- Clicar no card da empresa para ver detalhes
```

### 4. Gerenciar Empresa
```
Na página de detalhes da empresa:
- Ver todos os membros em uma tabela
- Botão "Invite Member" para convidar
- Campo para selecionar role (MEMBER, ADMIN, OWNER)
- Link de convite é gerado automaticamente
- Copiar link e compartilhar
- Remover membros da equipe
```

### 5. Aceitar Convite
```
Compartilhe o link: http://localhost:7000/accept-invite/[token]
- Pessoa clica no link
- Clica em "Accept Invitation"
- É redirecionada para login
- Após login, tem acesso à empresa
```

---

## 🎨 Design

### Cores Principais
- **Primária**: Blue-600 (#2563eb)
- **Secundária**: Blue-700 (#1d4ed8)
- **Sucesso**: Green-600 (#16a34a)
- **Erro**: Red-600 (#dc2626)

### Componentes
- Cards com hover effects
- Modals para ações
- Tabelas responsivas
- Gradientes modernos
- Dark mode suportado

---

## ⚙️ Configurações

### Variável de Ambiente
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Porta de Desenvolvimento
```bash
npm run dev
# Acessa em http://localhost:7000
```

---

## 🔑 Funcionalidades Por Página

### Login
- ✅ Validação de email e senha
- ✅ Mensagens de erro claras
- ✅ Link para criar conta
- ✅ Logo CloudTech destaque

### Signup
- ✅ Validação de senhas iguais
- ✅ Mínimo 6 caracteres
- ✅ Verificação de email duplicado
- ✅ Auto-login após registro

### Dashboard
- ✅ Grid de 3 colunas
- ✅ Logo de cada empresa
- ✅ Contador de membros
- ✅ Paginação
- ✅ Criar nova empresa
- ✅ Estado vazio com CTA

### Detalhes da Empresa
- ✅ Logo e informações
- ✅ Tabela de membros
- ✅ Roles visíveis (badges)
- ✅ Remover membros
- ✅ Convidar novos membros
- ✅ Link de convite automático

### Aceitar Convite
- ✅ Design amigável
- ✅ Feedback de sucesso
- ✅ Mensagens de erro
- ✅ Link para login

---

## 🛠️ Troubleshooting

### Erro: "Failed to fetch companies"
- Verifique se o backend está rodando em `http://localhost:4000`
- Verifique se o token JWT é válido
- Verifique os logs do backend

### Token expirado
- Página redireciona automaticamente para login
- Faça login novamente

### Link de convite não funciona
- Verifique se o token está correto
- Verifique se o token não expirou
- Verifique se a rota está protegida no middleware

### Modo escuro não funciona
- Pressione F12 e mude em Dev Tools
- Ou use o theme switcher no header

---

## 📦 Dependências Principais

```json
{
  "next": "14.0.4",
  "react": "^18",
  "typescript": "^5",
  "tailwindcss": "^3.3.0",
  "axios": "^1.6.2",
  "js-cookie": "^3.0.5",
  "next-themes": "^0.2.1"
}
```

---

## 🎯 Próximos Passos

1. Integre com seu backend
2. Teste todos os fluxos
3. Configure variáveis de ambiente
4. Deploy em staging
5. Teste em produção

---

## 📸 Screenshots do Layout

### Login
- Gradient background
- Form centralizado
- Logo CloudTech
- Dark mode support

### Dashboard
- Grid de empresas
- Cards com hover
- Botão de criar empresa
- Header com logout

### Detalhes da Empresa
- Header com logo
- Tabela de membros
- Botão para convidar
- Link de convite gerado

---

## ✅ Checklist Final

- [x] Login funcionando
- [x] Signup funcionando
- [x] Dashboard listando empresas
- [x] Criar empresa funcionando
- [x] Detalhes da empresa funcionando
- [x] Convidar membro com link gerado
- [x] Aceitar convite funcionando
- [x] Header com logout
- [x] Dark mode suportado
- [x] Responsive design
- [x] Tratamento de erros
- [x] Validações
- [x] Loading states
- [x] Paginação

**Tudo pronto para uso! 🚀**
