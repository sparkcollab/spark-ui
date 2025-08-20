import React, { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useLocation, useNavigate } from "react-router-dom";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { userState } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!userState?.token) {
      const isOnPublicPage =
        location.pathname === "/login" || location.pathname === "/onboarding";
      if (!isOnPublicPage) {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, location.pathname, userState]);

  if (!userState?.token) return null;
  return children;
};

export default AuthProvider;
