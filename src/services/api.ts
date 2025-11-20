import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://apialtaa.cloudqi.com.br',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
