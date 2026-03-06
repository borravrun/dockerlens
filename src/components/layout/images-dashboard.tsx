import { FiRefreshCcw, FiSearch, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useImageList } from "@/hooks";
import { useRef } from "react";
import ImageTable from "@/components/images/image-table";

export default function ImagesDashboard() {
  const { images, loading, refresh, search, setSearch } = useImageList();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-6 border-b border-[#333332]">
        <div className="flex gap-3 items-center">
          <SidebarTrigger className="text-[#6B6B6B] hover:text-[#E8E8E6] hover:bg-transparent size-5 cursor-pointer" />
          <span className="text-[#6B6B6B] text-xl">/</span>
          <span className="text-[#6B6B6B] text-xl">
            images ({images.length})
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
              placeholder="Search images..."
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
      <main className="flex-1 overflow-auto px-12 pt-4">
        <ImageTable />
      </main>
    </div>
  );
}
