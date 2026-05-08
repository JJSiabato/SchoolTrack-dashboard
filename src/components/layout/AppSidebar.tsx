"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  GraduationCap,
  ClipboardCheck,
  FileBarChart,
  School,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/useAuthStore"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Estudiantes",
    url: "/dashboard/students",
    icon: Users,
  },
  {
    title: "Docentes",
    url: "/dashboard/teachers",
    icon: GraduationCap,
  },
  {
    title: "Cursos",
    url: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Asistencias",
    url: "/dashboard/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Calificaciones",
    url: "/dashboard/grades",
    icon: FileBarChart,
  },
  {
    title: "Reportes",
    url: "/dashboard/reports",
    icon: FileBarChart, // can use PieChart or something, using FileBarChart
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex items-center gap-2 px-4 py-6">
        <div className="flex items-center justify-center rounded-lg bg-primary p-1">
          <School className="size-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">SchoolTrack</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-3 w-full py-2">
                      <item.icon className="size-5" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => logout()}>
              <LogOut className="size-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
