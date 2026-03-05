import { FiRefreshCcw, FiSearch, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useContainerList } from "@/hooks";
import { useRef } from "react";

export default function Header() {
  const { containers, loading, refresh, search, setSearch } = useContainerList();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex items-center justify-between px-12 py-6 border-b border-[#333332]">
      <div className="flex gap-3 items-center">
        <span className="text-[#E8E8E6] text-xl font-bold">Dockerlens</span>
        <span className="text-[#6B6B6B] text-xl">/</span>
        <span className="text-[#6B6B6B] text-xl">
          local container ({containers.length})
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <FiSearch className="absolute left-2.5 text-[#6B6B6B] size-3.5 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search containers..."
            className="bg-[#1A1A1A] border border-[#333332] rounded-md pl-8 pr-8 py-1.5 text-sm text-[#E8E8E6] placeholder:text-[#525252] focus:outline-none focus:border-[#525252] w-56 transition-colors"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
              className="absolute right-2 text-[#6B6B6B] hover:text-[#E8E8E6] transition-colors"
            >
              <FiX className="size-3.5" />
            </button>
          )}
        </div>
        <Button size={"icon-lg"} className="action-btn" onClick={refresh}>
          <FiRefreshCcw
            className={`text-[#E8E8E6] ${loading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </header>
  );
}
