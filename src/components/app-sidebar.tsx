"use client";

import * as React from "react";
import {
  Waves,
  TowerControl,
  Download,
  LayoutDashboard,
  Settings2,
  AppWindow,
  House,
  Siren,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: House,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: AppWindow,
    },
    {
      title: "Layouts",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "มิเตอร์น้ำระบบบำบัด",
          url: "/treatmentWater",
        },
        {
          title: "มิเตอร์กิจกรรมการใช้น้ำ",
          url: "/waterUsage",
        },
      ],
    },
    {
      title: "Power meter",
      url: "#",
      icon: TowerControl,
      items: [
        {
          title: "บ่อบำบัด",
          url: "/treatmentPond",
        },
        {
          title: "บ่อสูบน้ำเสียอาคาร 1",
          url: "/wastewaterPumpBuilding1",
        },
        {
          title: "บ่อสูบน้ำเสียอาคาร 2",
          url: "/wastewaterPumpBuilding2",
        },
      ],
    },
    {
      title: "Water meter",
      url: "#",
      icon: Waves,
      items: [
        {
          title: "น้ำเข้า",
          url: "/waterIn",
        },
        {
          title: "น้ำออก",
          url: "/waterOut",
        },
        {
          title: "น้ำใช้อาคาร 2",
          url: "/waterUsageBuilding2",
        },
        {
          title: "น้ำแอร์รังผึ้งอาคาร 2",
          url: "/airCoolingWaterBuilding2",
        },
        {
          title: "น้ำบำบัดกลับมาใช้ใหม่",
          url: "/reusedTreatedWater",
        },
        {
          title: "น้ำดื่ม",
          url: "/drinkingWater",
        },
        {
          title: "น้ำแอร์รังผึ้งอาคาร 1",
          url: "/airCoolingWaterBuilding1",
        },
        {
          title: "น้ำใช้อาคาร 1",
          url: "/waterUsageBuilding1",
        },
      ],
    },
    {
      title: "Export",
      url: "#",
      icon: Download,
      items: [
        {
          title: "มิเตอร์ไฟฟ้าระบบบำบัด",
          url: "exportPower",
        },
        {
          title: "มิเตอร์น้ำระบบบำบัด",
          url: "exportWater",
        },
        {
          title: "มิเตอร์กิจกรรมการใช้น้ำ",
          url: "exportWaterbuilding",
        },
      ],
    },
        {
      title: "บันทึกการปิดใช้งาน Alarm",
      url: "/alarm",
      icon: Siren,
    },
    {
      title: "Settings",
      url: "/setting",
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
