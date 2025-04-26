import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  clearToken,
  getStoredToken,
  getTokenFromUrl,
  getUserProfile,
  User,
} from "../services/spotifyAuth";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
  checkingAuth: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (token: string) => {
      try {
        const userProfile = await getUserProfile(token);
        setUser(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Check for token in URL (after Spotify redirect)
    const tokenFromUrl = getTokenFromUrl();
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl.accessToken);
      setIsAuthenticated(true);
      fetchUserProfile(tokenFromUrl.accessToken);
      // Clear hash from URL to prevent token exposure
      window.location.hash = "";
    } else {
      // Check for stored token
      const storedToken = getStoredToken();
      if (storedToken) {
        setAccessToken(storedToken);
        setIsAuthenticated(true);
        fetchUserProfile(storedToken);
      }
    }

    setCheckingAuth(false);
  }, []);

  const login = () => {
    // The actual redirection happens in the LoginPage component
    // This function is a placeholder for potential pre-login logic
  };

  const logout = () => {
    clearToken();
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    accessToken,
    login,
    logout,
    checkingAuth,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
