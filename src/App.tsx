import { FiLoader } from "react-icons/fi";
import { useDockerStatus } from "@/hooks";
import { ContainerProvider } from "@/providers";
import DockerError from "@/components/layout/docker-error";
import Dashboard from "@/components/layout/dashboard";

export default function App() {
  const { connected } = useDockerStatus();

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
    <div className="bg-primary w-screen h-screen">
      <ContainerProvider>
        <Dashboard />
      </ContainerProvider>
    </div>
  );
}
