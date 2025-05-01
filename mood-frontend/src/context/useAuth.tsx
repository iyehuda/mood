import { createContext, useContext } from "react";
import { User } from "../services/spotifyAuth.ts";

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  logout: () => void;
  checkingAuth: boolean;
  user: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
