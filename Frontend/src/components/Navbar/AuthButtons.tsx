import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ role: string }>({ role: "finance" });
  type DecodedToken = {
    id: string;
    email: string;
    role: string;
    exp?: number;
    iat?: number;
  };
  useEffect(() => {
    // const token = localStorage.getItem("authToken");
    const token = Cookies.get("authToken");

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded:", decoded);

      setUser({ role: decoded?.role });
    }
  }, []);
  return (
    <div className="flex gap-2">
      {user && user.role === "admin" && (
        <button
          className="px-3 py-1 rounded cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-200 hover:border hover:border-slate-700 hover:text-slate-700 transition"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      )}
      <button
        className="px-3 py-1 rounded cursor-pointer border border-slate-400 text-slate-700 hover:bg-slate-200 hover:text-slate-700 transition"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
};

export default AuthButtons;
