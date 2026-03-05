import { FiRefreshCcw } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useContainerList } from "@/hooks";

export default function Header() {
  const { containers, loading, refresh } = useContainerList();

  return (
    <header className="flex items-center justify-between px-12 py-6 border-b border-[#333332]">
      <div className="flex gap-3">
        <span className="text-[#E8E8E6] text-xl font-bold">Dockerlens</span>
        <span className="text-[#6B6B6B] text-xl">/</span>
        <span className="text-[#6B6B6B] text-xl">
          local container ({containers.length})
        </span>
      </div>
      <Button size={"icon-lg"} className="action-btn" onClick={refresh}>
        <FiRefreshCcw
          className={`text-[#E8E8E6] ${loading ? "animate-spin" : ""}`}
        />
      </Button>
    </header>
  );
}
