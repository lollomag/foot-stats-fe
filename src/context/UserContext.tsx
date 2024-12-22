'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserData } from '../lib/strapi';

type UserContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Aggiorna lo stato dell'utente
  const refreshUser = async () => {
    const jwt = Cookies.get('jwt');
    if (jwt) {
      try {
        const userData = await getUserData(jwt);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Errore durante l\'aggiornamento dei dati utente:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
