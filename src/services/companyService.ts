import api from './api';

export interface Member {
  id: number;
  name?: string; // Name is not in AddMemberDto, but likely in response
  email: string;
  role?: string;
}

export interface Company {
  id: number;
  name: string;
  logoUrl?: string; // Swagger says logoUrl
  members?: Member[];
}

export const getCompanies = async (page = 1, pageSize = 10): Promise<Company[]> => {
  const response = await api.get('/companies', { params: { page, pageSize } });
  return response.data;
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};

// Renamed to reflect the actual action and endpoint
export const addMember = async (id: string, email: string, role = 'MEMBER'): Promise<void> => {
  await api.post(`/company/${id}/members`, { email, role });
};

// Keeping this for backward compatibility if used elsewhere, but updating implementation
export const inviteUser = async (id: string, email: string): Promise<void> => {
  await addMember(id, email);
};
