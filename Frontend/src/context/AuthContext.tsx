import { createContext, useCallback, useState } from 'react';
import { authService } from '../services/auth.service';

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    authService.setToken(response.token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    authService.removeToken();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
