'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllDomains } from '@/actions/education';

interface GlobalStateContextType {
  loading: boolean;
  error: string | null;
  domains: string[];
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setDomains: (value: string[]) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchDomains = async () => {
      try {
        const data = await fetchAllDomains();
        if (isMounted) setDomains(data || []);
      } catch (err) {
        console.error('Failed to fetch global domains:', err);
      }
    };
    fetchDomains();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ loading, error, domains, setLoading, setError, setDomains }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
