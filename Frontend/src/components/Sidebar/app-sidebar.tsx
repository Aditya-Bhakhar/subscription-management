"use client";

import * as React from "react";
import {
  Home,
  UserRound,
  BriefcaseBusiness,
  ShoppingCart,
  ReceiptIndianRupee,
  ChartNoAxesCombined,
  // SquareUser,
  GalleryVerticalEnd,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  team: {
    name: "Subscription",
    logo: GalleryVerticalEnd,
    plan: "Management",
  },
  navMain: [
    {
      title: "Home",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Users",
          url: "/user",
        },
        {
          title: "Roles",
          url: "/user-role",
        },
      ],
      icon: Home,
      isActive: true,
    },
    {
      title: "Customers",
      items: [
        {
          title: "Customers",
          url: "/customer",
        },
      ],
      icon: UserRound,
    },
    {
      title: "Product Catalogue",
      items: [
        {
          title: "Items",
          url: "/item",
        },
        {
          title: "Subscription Plans",
          url: "/subscription-plan",
        },
      ],
      icon: BriefcaseBusiness,
    },
    {
      title: "Sales",
      items: [
        {
          title: "Subscriptions",
          url: "/subscription",
        },
        {
          title: "Invoices",
          url: "/invoice",
        },
      ],
      icon: ShoppingCart,
    },
    {
      title: "Expenses",
      items: [
        {
          title: "Expenses",
          url: "/expense",
        },
      ],
      icon: ReceiptIndianRupee,
    },
    {
      title: "Reports",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
      icon: ChartNoAxesCombined,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    role: string;
  };
}) {
  let filteredNavMain = [...data.navMain];
  filteredNavMain = filteredNavMain.map((section) => {
    if (section.title === "Home") {
      const filteredItems = section.items.filter((item) => {
        if (["Users"].includes(item.title)) {
          return user.role === "admin";
        }
        return true;
      });
      return { ...section, items: filteredItems };
    }
    return section;
  });
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
