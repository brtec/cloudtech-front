import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  members?: Member[];
}

export interface InviteResponse {
  token: string;
  inviteLink: string;
}

// Companies
export const getCompanies = async (page = 1, pageSize = 10): Promise<Company[]> => {
  try {
    const response = await api.get('/companies', { params: { page, pageSize } });
    const data = Array.isArray(response.data) ? response.data : response.data.data || [];
    return data.map((company: any) => ({
      ...company,
      members: company.members || []
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const response = await api.get(`/companies/${id}`);
    const data = response.data?.data || response.data;
    
    return {
      ...data,
      members: data.members || []
    };
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const createCompany = async (name: string, logoUrl?: string): Promise<Company> => {
  const response = await api.post('/companies', { name, logoUrl });
  return response.data?.data || response.data;
};

export const updateCompany = async (id: string, name?: string, logoUrl?: string): Promise<Company> => {
  const response = await api.patch(`/companies/${id}`, { name, logoUrl });
  return response.data?.data || response.data;
};

export const deleteCompany = async (id: string): Promise<void> => {
  await api.delete(`/companies/${id}`);
};

export const switchCompany = async (id: string): Promise<void> => {
  await api.post(`/companies/${id}/switch`);
};

// Members - Manage existing members
export const updateMember = async (companyId: string, memberId: string, role: string): Promise<Member> => {
  const response = await api.patch(`/company/${companyId}/members/${memberId}`, { role });
  return response.data?.data || response.data;
};

export const removeMember = async (companyId: string, memberId: string): Promise<void> => {
  await api.delete(`/company/${companyId}/members/${memberId}`);
};

// Invites - Add new members via invitation
export const createInvite = async (companyId: string, email: string, role = 'MEMBER'): Promise<InviteResponse> => {
  const response = await api.post(`/company/${companyId}/invite`, { email, role });
  return response.data?.data || response.data;
};

// Auth - Accept Invite
export const acceptInvite = async (token: string): Promise<void> => {
  await api.post('/auth/accept-invite', { token });
};
