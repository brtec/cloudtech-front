'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId?: string;
  login: (token: string, userId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const token = Cookies.get('auth-token');
    const storedUserId = Cookies.get('user-id');
    
    console.log('AuthContext mount - token:', !!token, 'storedUserId:', storedUserId);
    
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setIsAuthenticated(true);
      
      // Se tem userId salvo, usar
      if (storedUserId) {
        console.log('Setting userId from cookie:', storedUserId);
        setUserId(storedUserId);
      } else {
        // Tentar extrair do token JWT
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const extractedUserId = decodedToken.sub || decodedToken.id || decodedToken.userId;
          if (extractedUserId) {
            console.log('Extracted userId from token:', extractedUserId);
            setUserId(extractedUserId);
            Cookies.set('user-id', extractedUserId, { expires: 7 });
          }
        } catch (e) {
          console.error('Could not decode token:', e);
        }
      }
    }
  }, []);

  const login = (token: string, userId?: string) => {
    console.log('Login called with token and userId:', userId);
    Cookies.set('auth-token', token, { expires: 7 });
    if (userId) {
      console.log('Setting user-id cookie:', userId);
      Cookies.set('user-id', userId, { expires: 7 });
      setUserId(userId);
    } else {
      // Tentar extrair do token se não foi passado userId
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const extractedUserId = decodedToken.sub || decodedToken.id || decodedToken.userId;
        if (extractedUserId) {
          console.log('Extracted and setting userId from token:', extractedUserId);
          Cookies.set('user-id', extractedUserId, { expires: 7 });
          setUserId(extractedUserId);
        }
      } catch (e) {
        console.error('Could not extract userId from token');
      }
    }
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('auth-token');
    Cookies.remove('user-id');
    delete api.defaults.headers.Authorization;
    setIsAuthenticated(false);
    setUserId(undefined);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
