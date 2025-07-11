// src/components/AdminRoute.tsx
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type DecodedToken = {
  id: string;
  email: string;
  role: string;
  exp?: number;
  iat?: number;
};

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const token = Cookies.get("authToken");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch (err) {
    console.error(err);
    return <Navigate to="/login" replace />;
  }
}
