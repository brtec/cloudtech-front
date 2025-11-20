import api from './api';

export interface Member {
  id: number;
  name: string;
  email: string;
}

export interface Company {
  id: number;
  name: string;
  logo: string;
  members: Member[];
}

export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/companies');
  return response.data;
};

export const getCompanyById = async (id: string): Promise<Company> => {
  const response = await api.get(`/company/${id}`);
  return response.data;
};

export const inviteUser = async (id: string, email: string): Promise<void> => {
  await api.post(`/company/${id}/invite`, { email });
};
