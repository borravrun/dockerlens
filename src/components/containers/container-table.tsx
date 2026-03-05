import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContainerList } from "@/hooks";
import type { AppContainer } from "@/types";
import ContainerRow from "./container-row";

interface ContainerTableProps {
  onSelectContainer: (container: AppContainer) => void;
}

export default function ContainerTable({
  onSelectContainer,
}: ContainerTableProps) {
  const { containers, loading } = useContainerList();

  if (containers.length === 0 && !loading) {
    return (
      <p className="text-[#525252] text-center py-12">No containers found</p>
    );
  }

  return (
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
            onOpen={onSelectContainer}
          />
        ))}
      </TableBody>
    </Table>
  );
}
