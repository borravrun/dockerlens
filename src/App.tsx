import { FiRefreshCcw } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import ContainerRow from "./components/container-row";
import { useContainerContext } from "./store/container-context";
import {
  Sheet,
  SheetContent,
} from "./components/ui/sheet";
import { useState } from "react";
import ContainerDrawer from "./components/container-drawer";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { containers, loading, refresh, selectedContainer, setSelectedContainer } = useContainerContext();
  
  

  return (
    <div className="bg-primary w-screen h-screen">
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
      <main className="px-12 pt-4">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-[#333332] [&>th]:text-[#6B6B6B] [&>th:nth-child(-n+4)]:text-center [&>th]:uppercase [&>th]:font-inter [&>th]:font-medium">
              <TableHead className="w-7.5"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {containers.map((container) => (
              <ContainerRow
                key={container.id}
                container={container}
                onOpen={() => {
                  setSelectedContainer((container));
                  setIsOpen(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </main>
      <Sheet open={isOpen} onOpenChange={setIsOpen} >
        <SheetContent className="w-3/5 bg-primary border-l border-[#333332]" showCloseButton={false}>
          <ContainerDrawer selectedContainer={selectedContainer} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
