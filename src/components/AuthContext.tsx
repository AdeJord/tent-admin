import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('https://adejord.co.uk/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token); // Assuming the token is returned in the response
      localStorage.setItem('userName', username);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      throw error; // Rethrow the error if you want to handle it in the login form component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
