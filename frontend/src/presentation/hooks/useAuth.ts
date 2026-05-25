import { useState, useEffect } from "react";
import { loginUseCase } from "../../infrastructure/di/container";
import { BrowserStorage } from "../../infrastructure/storage/BrowserStorage";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!BrowserStorage.getToken());

    const handleStorageChange = () => {
      setIsLoggedIn(!!BrowserStorage.getToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUseCase.execute({ username, password });
      BrowserStorage.setToken(data.access_token);
      setIsLoggedIn(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro de conexão com o servidor.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    BrowserStorage.removeToken();
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    login,
    logout,
    loading,
    error,
  };
}
