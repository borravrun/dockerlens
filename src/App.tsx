import { FiLoader } from "react-icons/fi";
import { useState } from "react";
import { useDockerStatus } from "@/hooks";
import { ContainerProvider } from "@/providers";
import { ImageProvider } from "@/providers/image-provider";
import DockerError from "@/components/layout/docker-error";
import Dashboard from "@/components/layout/dashboard";
import ImagesDashboard from "@/components/layout/images-dashboard";
import AppSidebar from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { View } from "@/lib/utils";

export default function App() {
  const { connected } = useDockerStatus();
  const [activeView, setActiveView] = useState<View>("containers");

  if (connected === null) {
    return (
      <div className="bg-primary w-screen h-screen flex items-center justify-center">
        <FiLoader className="text-[#6B6B6B] text-2xl animate-spin" />
      </div>
    );
  }

  if (!connected) {
    return <DockerError />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <SidebarInset className="bg-primary">
        <ContainerProvider>
          <div className={activeView === "containers" ? undefined : "hidden"}>
            <Dashboard />
          </div>
        </ContainerProvider>
        <ImageProvider>
          <div className={activeView === "images" ? undefined : "hidden"}>
            <ImagesDashboard />
          </div>
        </ImageProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
