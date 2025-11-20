#!/bin/bash

# 🚀 COMO RODAR O CLOUDTECH FRONTEND

echo "
╔════════════════════════════════════════════════════════════════════════════╗
║                        CLOUDTECH FRONTEND - START UP                      ║
║                                                                            ║
║         Guia completo para iniciar a aplicação em desenvolvimento          ║
╚════════════════════════════════════════════════════════════════════════════╝
"

echo "
📋 PRÉ-REQUISITOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Node.js v18+ instalado
✓ npm ou yarn disponível
✓ Backend rodando em http://localhost:4000 (opcional para teste)
✓ Terminal aberto na pasta /home/brezende/cloudtech/cloudtech-front

"

echo "
🎯 PASSO 1: INSTALAR DEPENDÊNCIAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute o comando:

    $ npm install

Isso instalará:
  • Next.js 14
  • React 18
  • TypeScript
  • Tailwind CSS
  • Axios
  • js-cookie
  • next-themes

Tempo estimado: 2-3 minutos

"

echo "
🔧 PASSO 2: CONFIGURAR VARIÁVEIS DE AMBIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Crie arquivo .env.local na raiz do projeto:

    $ touch .env.local

Adicione o conteúdo:

    NEXT_PUBLIC_API_URL=http://localhost:4000

Nota: Altere a URL se seu backend está em outro endereço

"

echo "
🚀 PASSO 3: INICIAR O SERVIDOR DE DESENVOLVIMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute:

    $ npm run dev

Você verá:

    > cloudtech-platform@0.1.0 dev
    > next dev -p 7000

    ▲ Next.js 14.0.4
    - Local: http://localhost:7000

O servidor está rodando! ✅

"

echo "
🌐 PASSO 4: ABRIR NO NAVEGADOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Abra em seu navegador:

    http://localhost:7000

Você será redirecionado automaticamente para /login

"

echo "
🧪 PASSO 5: TESTAR A APLICAÇÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Opção A - CRIAR CONTA (Recomendado para teste)
════════════════════════════════════════════════

1. Clique em 'Create Account'
2. Preencha:
   • Nome: Seu Nome
   • Email: seu@email.com
   • Senha: 123456 (ou maior)
   • Confirme Senha: 123456
3. Clique em 'Create Account'
4. Você será auto-loginado e levado ao dashboard

Opção B - FAZER LOGIN (Se já tiver conta)
═══════════════════════════════════════════

1. Em /login, preencha:
   • Email: seu@email.com
   • Senha: sua_senha
2. Clique em 'Sign In'
3. Dashboard carregará com suas empresas

"

echo "
🎮 FLUXO COMPLETO DE TESTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Após login, você vê o DASHBOARD
    • Clique em 'New Company' para criar empresa
    • Preencha nome e logo (opcional)
    • Clique 'Create Company'
    • Empresa aparece no grid

2️⃣  Clique na empresa para VER DETALHES
    • Vê a logo, nome e membros
    • Clique em 'Invite Member'
    • Preencha email e role
    • Clique 'Generate Invite Link'
    • Link aparece para copiar

3️⃣  Teste ACEITAR CONVITE
    • Copie o link
    • Abra em nova aba/navegador anônimo
    • Clique 'Accept Invitation'
    • Será redirecionado para login
    • Faça login (crie conta se necessário)

4️⃣  Teste DARK MODE
    • Clique no ícone sun/moon no header
    • Interface muda para escuro
    • Clique novamente para voltar

5️⃣  Teste LOGOUT
    • Clique no botão 'Logout' no header
    • Será levado para /login

6️⃣  Teste RESPONSIVIDADE
    • Abra DevTools (F12)
    • Clique no ícone de dispositivo
    • Teste em Mobile (375px), Tablet (768px), Desktop
    • Grid deve mudar (1, 2 e 3 colunas respectivamente)

"

echo "
🛠️  COMANDOS ÚTEIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Rodar linter
npm run lint

# Limpar cache Next.js
rm -rf .next

# Instalar dependência individual
npm install nome-pacote

# Desinstalar dependência
npm uninstall nome-pacote

"

echo "
🐛 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 'EADDRINUSE: address already in use :::7000'
   → Porta 7000 já em uso
   → Solução: npm run dev -p 8000 (mudar porta)
   → Ou: Matar processo: pkill -f 'next dev'

❌ 'Cannot find module...'
   → Dependências não instaladas
   → Solução: npm install

❌ 'EACCES: permission denied'
   → Permissão negada
   → Solução: sudo npm install (se necessário)

❌ 'Connection refused on localhost:4000'
   → Backend não está rodando
   → Verifique se backend está ligado
   → Ou configure NEXT_PUBLIC_API_URL correto

❌ Erro ao fazer login
   → Verifique credenciais
   → Verifique se backend está respondendo
   → Abra DevTools (F12) > Network > veja erros

❌ Página branca/erro de compilação
   → Verifique console (F12)
   → Procure por erros em vermelho
   → Tente: npm run build

"

echo "
💻 ESTRUTURA DO PROJETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cloudtech-front/
├── public/              # Arquivos estáticos
├── src/
│   ├── app/             # Rotas e páginas
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Estado global (Auth, Theme)
│   ├── services/        # API e serviços
│   └── middleware.ts    # Proteção de rotas
├── .env.local           # Variáveis de ambiente (seu)
├── next.config.js       # Config Next.js
├── tsconfig.json        # Config TypeScript
├── tailwind.config.js   # Config Tailwind
└── package.json         # Dependências

"

echo "
📚 DOCUMENTAÇÃO ADICIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 GUIA_RAPIDO.md       - Guia rápido de funcionalidades
📄 IMPLEMENTACAO.md     - Detalhes técnicos
📄 EXEMPLOS_USO.md      - Exemplos de código
📄 ESTRUTURA.md         - Estrutura completa do projeto
📄 CHECKLIST.md         - O que foi implementado
📄 README.md            - Documentação original

"

echo "
🎯 ENDPOINTS DA API (REFERÊNCIA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST   /auth/login                  - Fazer login
POST   /auth/signup                 - Criar conta
POST   /auth/accept-invite          - Aceitar convite

GET    /companies                   - Listar empresas (auth)
POST   /companies                   - Criar empresa (auth)
GET    /companies/:id               - Get empresa (auth)
PATCH  /companies/:id               - Atualizar empresa (auth)
DELETE /companies/:id               - Deletar empresa (auth)
POST   /companies/:id/switch        - Alternar empresa (auth)

POST   /company/:id/members         - Adicionar membro (auth)
PATCH  /company/:id/members/:memId  - Atualizar membro (auth)
DELETE /company/:id/members/:memId  - Remover membro (auth)

POST   /company/:id/invite          - Criar convite (auth)

"

echo "
✨ FEATURES IMPLEMENTADAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Login/Signup com validações
✅ Dashboard com grid de empresas
✅ Criar/editar/deletar empresas
✅ Gerenciar membros (adicionar, editar role, remover)
✅ Gerar convites com links únicos
✅ Aceitar convites com tokens
✅ Dark mode em toda aplicação
✅ Design responsivo (mobile, tablet, desktop)
✅ Logo CloudTech em destaque
✅ Tratamento de erros completo
✅ Loading states em requisições
✅ Paginação de empresas
✅ Proteção de rotas
✅ Session persistence
✅ Token JWT automático

"

echo "
🚀 INICIAR AGORA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute os comandos:

    $ npm install
    $ echo 'NEXT_PUBLIC_API_URL=http://localhost:4000' > .env.local
    $ npm run dev

Pronto! Abra http://localhost:7000 e comece a usar! 🎉

"

echo "
═══════════════════════════════════════════════════════════════════════════════

                        Tudo pronto para começar! 🚀

═══════════════════════════════════════════════════════════════════════════════
"
