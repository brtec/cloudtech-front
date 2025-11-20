// EXEMPLOS DE USO DOS SERVIÇOS

// ============================================
// AUTENTICAÇÃO
// ============================================

import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.accessToken;
    login(token); // Usar a função do AuthContext
    // O token é automaticamente adicionado a todos os requests
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Signup
const handleSignup = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', { 
      name, 
      email, 
      password 
    });
    const token = response.data.accessToken;
    login(token);
  } catch (error) {
    console.error('Signup failed:', error);
  }
};

// Logout
const handleLogout = () => {
  logout(); // Limpa o token e cookies
  router.push('/login');
};

// ============================================
// EMPRESAS
// ============================================

import { 
  getCompanies, 
  createCompany, 
  getCompanyById, 
  updateCompany, 
  deleteCompany,
  switchCompany 
} from '@/services/companyService';

// Listar empresas com paginação
const companies = await getCompanies(page = 1, pageSize = 10);
// Retorna: Company[]

// Criar empresa
const newCompany = await createCompany('Minha Empresa', 'https://logo.png');
// Retorna: Company

// Get uma empresa
const company = await getCompanyById('123');
// Retorna: Company com membros

// Atualizar empresa
const updated = await updateCompany('123', 'Novo Nome', 'nova-logo.png');
// Retorna: Company

// Deletar empresa
await deleteCompany('123');

// Alternar empresa ativa
await switchCompany('123');

// ============================================
// MEMBROS
// ============================================

import { 
  addMember, 
  updateMember, 
  removeMember 
} from '@/services/companyService';

// Adicionar membro
await addMember('company-id', 'user@email.com', 'ADMIN');
// Roles: 'MEMBER' | 'ADMIN' | 'OWNER'

// Atualizar role do membro
await updateMember('company-id', 'member-id', 'ADMIN');

// Remover membro
await removeMember('company-id', 'member-id');

// ============================================
// CONVITES
// ============================================

import { 
  createInvite, 
  acceptInvite 
} from '@/services/companyService';

// Criar convite (gera link)
const inviteResponse = await createInvite('company-id', 'user@email.com', 'MEMBER');
// Retorna: { token: 'abc123', inviteLink: 'http://...' }

// Aceitar convite
await acceptInvite('token-from-link');

// ============================================
// EXEMPLO DE COMPONENTE
// ============================================

import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany } from '@/services/companyService';
import CreateCompanyModal from '@/components/CreateCompanyModal';

export default function MyCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await getCompanies(1, 10);
      setCompanies(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (name: string, logoUrl?: string) => {
    try {
      const newCompany = await createCompany(name, logoUrl);
      setCompanies([newCompany, ...companies]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Create Company
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {companies.map((company) => (
            <div key={company.id}>
              <h3>{company.name}</h3>
              <p>{company.members?.length} members</p>
            </div>
          ))}
        </div>
      )}

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCompany}
      />
    </div>
  );
}

// ============================================
// TIPOS
// ============================================

interface Company {
  id: number;
  name: string;
  logoUrl?: string;
  members?: Member[];
}

interface Member {
  id: number;
  name?: string;
  email: string;
  role?: string; // 'MEMBER' | 'ADMIN' | 'OWNER'
}

interface InviteResponse {
  token: string;
  inviteLink: string;
}

// ============================================
// TRATAMENTO DE ERROS
// ============================================

try {
  const company = await getCompanyById('123');
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Company not found');
  } else if (error.response?.status === 401) {
    console.log('Unauthorized - token expired?');
    // Será redirecionado automaticamente para login
  } else {
    console.log('Unknown error:', error.message);
  }
}

// ============================================
// EXEMPLO COM HOOKS
// ============================================

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// ============================================
// AXIOS INTERCEPTOR (já configurado)
// ============================================

// O arquivo @/services/api.ts já tem:
// 
// 1. Request Interceptor:
//    - Adiciona token JWT automaticamente em Authorization header
//    - Bearer token é adicionado de Cookies
//
// 2. Response Interceptor:
//    - Se 401 (Unauthorized): limpa token e redireciona para login
//    - Mantém cookies limpos

// Você NÃO precisa adicionar headers manualmente!
// Só use: await api.post(...), await api.get(...), etc

// ============================================
// EXEMPLO COMPLETO: CONVIDAR MEMBRO
// ============================================

import React, { useState } from 'react';
import { createInvite } from '@/services/companyService';
import InviteUserModal from '@/components/InviteUserModal';

export default function CompanyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleInvite = async (email: string, role: string) => {
    const response = await createInvite('company-id', email, role);
    setInviteLink(response.inviteLink);
    return response;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copiado!');
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Invite Member
      </button>

      {inviteLink && (
        <div>
          <p>Link: {inviteLink}</p>
          <button onClick={copyLink}>Copy</button>
        </div>
      )}

      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

// ============================================
// DARK MODE COM NEXT-THEMES
// ============================================

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle {theme} mode
    </button>
  );
}

// ============================================
// DICAS E BOAS PRÁTICAS
// ============================================

// 1. Sempre envolver em try/catch
try {
  await api.post(...);
} catch (error) {
  // handle error
}

// 2. Mostrar loading states
const [loading, setLoading] = useState(false);
setLoading(true);
try {
  // API call
} finally {
  setLoading(false);
}

// 3. Validar inputs antes de enviar
if (!email || !email.includes('@')) {
  setError('Invalid email');
  return;
}

// 4. Usar o AuthContext para verificar autenticação
const { isAuthenticated } = useAuth();
if (!isAuthenticated) {
  return <p>Please login first</p>;
}

// 5. Limpar modals após sucesso
try {
  await createCompany(name);
  setName('');
  onClose(); // fecha modal
} catch (error) {
  // handle error
}

// ============================================
// TESTANDO LOCALMENTE
// ============================================

// Terminal 1: Frontend
npm run dev
// Acessa: http://localhost:7000

// Terminal 2: Backend (assumindo que está em outra pasta)
npm run dev
// Acessa: http://localhost:4000

// Use Postman/Insomnia para testar endpoints manualmente
// Endpoints da API documentados em OPENAPI.json
