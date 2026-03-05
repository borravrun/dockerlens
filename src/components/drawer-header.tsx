import { SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Badge } from "./ui/badge";
import DrawerActions from "./drawer-actions";
import { useEffect } from "react";
import { useContainerContext } from "@/store/container-context";

export default function DrawerHeader({ id }: { id: string }) {
  const { selectedContainer, fetchContainerDetails } = useContainerContext();

  useEffect(() => {
    if (id) fetchContainerDetails(id);
  }, [id]);

  return (
    <SheetHeader className="border-b border-b-[#333332]">
      <div className="flex flex-row justify-between items-center">
        <div>
          <SheetTitle className="text-[#F5F5F5] text-2xl font-inter">
            {selectedContainer?.name || "Container Details"}
          </SheetTitle>
          <SheetDescription className="text-[#737373] text-lg">
            {selectedContainer?.image || "No image specified"}
          </SheetDescription>
        </div>
        <Badge
          className={`rounded text-sm ${selectedContainer?.state === "running" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          • {selectedContainer?.state === "running" ? "Running" : "Stopped"}
        </Badge>
      </div>
      {selectedContainer && <DrawerActions container={selectedContainer} />}
    </SheetHeader>
  );
}
