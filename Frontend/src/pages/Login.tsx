import { LoginForm } from "@/components/Auth/login-form";
import React from "react";
import memightyLogo from "../assets/project_logo.jpg";
import background from "../assets/bg.49756b7c711696d95133fa95451f8e13.jpg";

const Login: React.FC = () => {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 bg-white/80 p-6 md:p-10 rounded-xl shadow-lg">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src={memightyLogo} alt="memighty" className="rounded" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Subscription
              </span>
              <span className="truncate text-xs text-gray-600 font-normal">
                Management
              </span>
            </div>
          </a>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
