import { FiAlertTriangle, FiRefreshCcw } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useDockerStatus } from "@/hooks";

export default function DockerError() {
  const { connected, retry } = useDockerStatus();
  const checking = connected === null;

  return (
    <div className="bg-primary w-screen h-screen flex flex-col items-center justify-center gap-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10">
        <FiAlertTriangle className="text-red-500 text-3xl" />
      </div>
      <div className="text-center">
        <h1 className="text-[#E8E8E6] text-2xl font-bold font-inter">
          Docker Engine Not Running
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-2 max-w-sm">
          Please start Docker Desktop or the Docker daemon to manage your
          containers.
        </p>
      </div>
      <Button
        className="action-btn bg-[#262626] gap-2"
        onClick={retry}
        disabled={checking}
      >
        <FiRefreshCcw
          className={`text-[#E8E8E6] ${checking ? "animate-spin" : ""}`}
        />
        {checking ? "Connecting..." : "Retry Connection"}
      </Button>
    </div>
  );
}
