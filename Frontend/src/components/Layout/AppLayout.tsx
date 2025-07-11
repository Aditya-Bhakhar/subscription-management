import { Outlet } from "react-router";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import QuickCreate from "../Navbar/QuickCreate";
import Notifications from "../Navbar/Notifications";
// import Searchbar from "../Navbar/Searchbar";
import Profile from "../Navbar/Profile";
import AuthButtons from "../Navbar/AuthButtons";
import BreadcrumbComponent from "../Navbar/Breadcrumb";
import { useEffect, useState } from "react";
// import { useLocation } from "react-router";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export default function Page() {
  // const { location } = useLocation();
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
    <SidebarProvider>
      <AppSidebar user={{ role: user?.role }} />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-transparent/50 backdrop-blur-[15px] shadow-md flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center h-6">
              <Separator
                orientation="vertical"
                className="mr-2 w-px h-full bg-gray-300"
              />
            </div>
            <div className="w-full flex items-center justify-between ">
              <BreadcrumbComponent />
              <div className="flex items-center justify-center gap-1">
                {/* <Searchbar />
                <div className="flex items-center h-6">
                  <Separator
                    orientation="vertical"
                    className="mx-2 w-px h-full bg-gray-300"
                  />
                </div> */}
                <AuthButtons />
                <div className="flex items-center h-6">
                  <Separator
                    orientation="vertical"
                    className="mx-2 w-px h-full bg-gray-300"
                  />
                </div>
                <QuickCreate />
                <Notifications />
                <Profile />
              </div>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
