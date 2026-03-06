import { FiBox, FiImage } from "react-icons/fi";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { View } from "@/lib/utils";

const navItems: { label: string; icon: typeof FiBox; view: View }[] = [
  { label: "Containers", icon: FiBox, view: "containers" },
  { label: "Images", icon: FiImage, view: "images" },
];

export default function AppSidebar({
  activeView,
  onNavigate,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <Sidebar collapsible="icon" className="border-r border-[#333332]">
      <SidebarHeader className="px-3 py-4">
        <span className="text-[#E8E8E6] text-lg font-bold truncate group-data-[collapsible=icon]:hidden">
          Dockerlens
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={activeView === item.view}
                    tooltip={item.label}
                    onClick={() => onNavigate(item.view)}
                    className="text-[#A3A3A3] hover:text-[#E8E8E6] hover:bg-[#262626] data-[active=true]:bg-[#262626] data-[active=true]:text-[#E8E8E6] cursor-pointer"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
