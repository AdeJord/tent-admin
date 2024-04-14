// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of your context state
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>(null!);

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Dummy credentials (You should replace these with your actual logic)
const DUMMY_USER = {
  username: 'admin',
  password: 'password123' // Note: Never store plain passwords like this in a real app
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username: string, password: string): boolean => {
    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
      setIsAuthenticated(true);
      return true;
    }
    setIsAuthenticated(false);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Pass the isAuthenticated state and login/logout functions down to components
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
