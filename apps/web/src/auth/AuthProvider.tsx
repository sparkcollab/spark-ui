import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { userState, validateSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await validateSession();
      } catch (error) {
        console.error("Session validation failed:", error);
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/onboarding"
        ) {
          navigate("/login", { replace: true });
        }
      }
    };
    if (!userState?.token) checkSession();
  }, [validateSession, navigate, location.pathname, userState]);

  if (!userState?.token) return null;
  return children;
};

export default AuthProvider;
