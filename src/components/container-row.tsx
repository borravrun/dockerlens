import { Container } from "@/lib/types";
import { TableCell, TableRow } from "./ui/table";
import ContainerAction from "./container-actions";

export default function ContainerRow({
  container,
  onOpen,
}: {
  container: Container;
  onOpen: () => void;
}) {
  return (
    <TableRow
      key={container.id}
      className="[&>td]:text-center border-b-[#333332] hover:bg-transparent cursor-pointer"
      onClick={onOpen}
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
}
