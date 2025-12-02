import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { loginUser, registerUser, logoutUser } from "../services/authService";

interface AuthContextType {
  user: string | null;
  userId: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Usuario autenticado
        const username = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario";
        setUser(username);
        setUserId(firebaseUser.uid);
      } else {
        // Usuario no autenticado
        setUser(null);
        setUserId(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      await loginUser(username, password);
      // onAuthStateChanged se encargará de actualizar el estado
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      setLoading(true);
      await registerUser(username, password);
      // onAuthStateChanged se encargará de actualizar el estado
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      // onAuthStateChanged se encargará de actualizar el estado
    } catch (error: any) {
      throw error;
    }
  };

  const isAuthenticated = user !== null && userId !== null;

  return (
    <AuthContext.Provider value={{ user, userId, login, signup, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
