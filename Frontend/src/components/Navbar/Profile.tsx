import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleUserRound, LayoutDashboard, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none hover:cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-xl hover:bg-gray-100 ">
                    <CircleUserRound strokeWidth={1.5} size={25} className="" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Aditya Bhakhar</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              handleNavigate("/dashboard");
            }}
            className=""
          >
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleNavigate("/my-profile");
            }}
            className=""
          >
            <CircleUserRound />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await axios.post(
                `${apiUrl}/auth/logout`,
                {},
                {
                  withCredentials: true,
                }
              );
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
            className=""
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
