// src/components/RequireAuth.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // Kein Token => Weiterleitung zum Login
      navigate("/login");
    }
  }, [token, navigate]);

  // Zeige Kinder nur, wenn ein Token vorhanden ist.
  return <>{token && children}</>;
}

export default RequireAuth;
