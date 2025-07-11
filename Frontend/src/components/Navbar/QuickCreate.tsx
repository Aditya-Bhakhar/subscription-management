import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Component,
  Plus,
  ShoppingBag,
  ShoppingCart,
  SquarePlus,
} from "lucide-react";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const QuickCreate: React.FC = () => {
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
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-xl hover:bg-gray-100 cursor-pointer">
                    <SquarePlus strokeWidth={1.5} size={25} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick Create</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit flex p-2 gap-5 mr-4">
          <div>
            <DropdownMenuLabel className="flex gap-2 items-center">
              <Component strokeWidth={1.3} size={20} />
              GENERAL
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1" />
            <div className="pl-1">
              {user && user.role === "admin" && (
                <DropdownMenuItem
                  className="flex gap-2 icons-center"
                  onClick={() => handleNavigation("/user")}
                >
                  <Plus
                    size={25}
                    strokeWidth={5}
                    className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
                  />
                  User
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex gap-2 icons-center"
                onClick={() => handleNavigation("/item")}
              >
                <Plus
                  size={25}
                  strokeWidth={5}
                  className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
                />
                Item
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex gap-2 icons-center"
                onClick={() => handleNavigation("/subscription-plan")}
              >
                <Plus
                  size={25}
                  strokeWidth={5}
                  className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
                />
                Subscription Plan
              </DropdownMenuItem>
            </div>
          </div>
          <div>
            <DropdownMenuLabel className="flex gap-2 items-center">
              <ShoppingCart strokeWidth={1.3} size={20} />
              SALES
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2 icons-center"
              onClick={() => handleNavigation("/customer")}
            >
              {" "}
              <Plus
                size={25}
                strokeWidth={5}
                className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
              />
              Customer
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex gap-2 icons-center"
              onClick={() => handleNavigation("/subscription")}
            >
              {" "}
              <Plus
                size={25}
                strokeWidth={5}
                className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
              />
              Subscription
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex gap-2 icons-center"
              onClick={() => handleNavigation("/invoice")}
            >
              {" "}
              <Plus
                size={25}
                strokeWidth={5}
                className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
              />
              Invoice
            </DropdownMenuItem>
          </div>
          <div>
            <DropdownMenuLabel className="flex gap-2 items-center">
              <ShoppingBag strokeWidth={1.3} size={20} />
              EXPENSES
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigation("/expense")}>
              {" "}
              <Plus
                size={25}
                strokeWidth={5}
                className="h-5 w-5 bg-gray-400 rounded-full p-0.5 text-white hover:bg-green-500"
              />
              Expenses
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickCreate;
