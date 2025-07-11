import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";
import Cookies from "js-cookie";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = Cookies.get("authToken");
  console.log("isAuthenticated: ", isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
