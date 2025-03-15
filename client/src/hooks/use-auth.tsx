import { createContext, ReactNode, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication
      if (username === "demo" && password === "demo") {
        setUser({ id: 1, username });
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock registration
      setUser({ id: 1, username });
      toast({
        title: "Success",
        description: "Registered successfully",
      });
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
