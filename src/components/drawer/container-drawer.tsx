import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiActivity, FiTerminal } from "react-icons/fi";
import DrawerHeader from "./drawer-header";
import DrawerDetails from "./drawer-details";
import DrawerLogs from "./drawer-logs";
import DrawerStats from "./drawer-stats";

interface ContainerDrawerProps {
  containerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContainerDrawer({
  containerId,
  open,
  onOpenChange,
}: ContainerDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-2/5 bg-primary border-l border-[#333332] flex flex-col gap-0"
        showCloseButton={false}
      >
        <DrawerHeader id={containerId} />
        <DrawerDetails />
        <Tabs defaultValue="logs" className="flex flex-col flex-1 min-h-0 gap-0">
          <TabsList
            variant="line"
            className="w-full justify-start rounded-none border-b border-[#333332] bg-transparent h-auto"
          >
            <TabsTrigger
              value="logs"
              className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold uppercase text-[#737373] data-[state=active]:border-[#E5E5E5] data-[state=active]:text-[#E5E5E5] data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:text-[#A3A3A3]"
            >
              <FiTerminal className="size-3.5" />
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="rounded-none border-b-2 border-transparent px-3 py-2 text-xs font-semibold uppercase text-[#737373] data-[state=active]:border-[#E5E5E5] data-[state=active]:text-[#E5E5E5] data-[state=active]:shadow-none data-[state=active]:bg-transparent hover:text-[#A3A3A3]"
            >
              <FiActivity className="size-3.5" />
              Stats
            </TabsTrigger>
          </TabsList>
          <TabsContent value="logs" className="flex flex-col flex-1 min-h-0 mt-0">
            <DrawerLogs id={containerId} />
          </TabsContent>
          <TabsContent value="stats" className="flex flex-col flex-1 min-h-0 mt-0">
            <DrawerStats id={containerId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
