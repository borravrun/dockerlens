import type { AppContainer } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import ContainerAction from "./container-actions";
import { memo, useCallback } from "react";

const ContainerRow = memo(function ContainerRow({
  container,
  onOpen,
}: {
  container: AppContainer;
  onOpen: (container: AppContainer) => void;
}) {
  const handleClick = useCallback(() => onOpen(container), [onOpen, container]);

  return (
    <TableRow
      className="[&>td]:text-center border-b-[#333332] hover:bg-transparent cursor-pointer"
      onClick={handleClick}
    >
      <TableCell
        className={`text-3xl ${container.state === "running" ? "text-green-500" : "text-red-500"}`}
      >
        •
      </TableCell>
      <TableCell className="text-[#E8E8E6]">{container.name}</TableCell>
      <TableCell className="text-[#E8E8E6] font-mono">
        {container.image}
      </TableCell>
      <TableCell className="text-[#E8E8E6]">
        {container.status.split(" ")[0]}
      </TableCell>
      <ContainerAction container={container} />
    </TableRow>
  );
});

export default ContainerRow;
