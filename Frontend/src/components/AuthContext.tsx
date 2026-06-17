import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  username: string;
  role: "Admin" | "User"; // Zgodnie z wymaganiami z PDF [cite: 109]
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funkcja dekodująca token JWT od Microsoft Identity
  const decodeAndSetUser = (jwtToken: string) => {
    try {
      const decoded: any = jwtDecode(jwtToken);
      
      // Mapowanie standardowych claimów .NET Core na nasz obiekt
      const loggedUser: User = {
        id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        username: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User"
      };
      
      setUser(loggedUser);
      setToken(jwtToken);
    } catch (error) {
      console.error("Błąd dekodowania tokenu:", error);
      logout();
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      decodeAndSetUser(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    decodeAndSetUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};