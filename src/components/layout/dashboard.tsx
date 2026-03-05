import { useCallback, useState } from "react";
import { useSelectedContainer } from "@/hooks";
import type { AppContainer } from "@/types";
import Header from "@/components/layout/header";
import ContainerTable from "@/components/containers/container-table";
import ContainerDrawer from "@/components/drawer/container-drawer";

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedContainer, setSelectedContainer } = useSelectedContainer();

  const handleSelectContainer = useCallback(
    (container: AppContainer) => {
      setSelectedContainer(container);
      setIsOpen(true);
    },
    [setSelectedContainer],
  );

  return (
    <>
      <Header />
      <main className="px-12 pt-4">
        <ContainerTable onSelectContainer={handleSelectContainer} />
      </main>
      <ContainerDrawer
        containerId={selectedContainer?.id || ""}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
