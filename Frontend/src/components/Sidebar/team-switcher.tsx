"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import memightyLogo from "../../assets/project_logo.jpg"

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

export function TeamSwitcher({ team }: { team: Team }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="bg-sidebar-accent text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            {/* <team.logo className="size-4" /> */}
            <img src={memightyLogo} alt="memighty" className="rounded" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{team.name}</span>
            <span className="truncate text-xs">{team.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
