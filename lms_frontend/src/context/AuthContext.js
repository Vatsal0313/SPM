import { createContext, useContext, useEffect, useState } from "react";
import { checkauth } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // default to false

  // ✅ Load localStorage after mount (avoids SSR crash)
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const logIin = async () => {
    try {
      const response = await checkauth();
      console.log("Auth Check:", response.data.user);
      if (response.data) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      }
    } catch (err) {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
    }
  };

  const logOout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logIin, logOout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
