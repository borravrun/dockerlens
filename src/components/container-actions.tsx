import { TableCell } from "./ui/table";
import { Button } from "./ui/button";
import { FiDelete, FiPlay, FiRefreshCcw, FiStopCircle } from "react-icons/fi";
import { Container } from "@/lib/types";

export default function ContainerAction({
  container,
}: {
  container: Container;
}) {
  return (
    <TableCell className="flex justify-end items-center gap-2">
      {container.state !== "running" && (
        <Button
          size={"icon-lg"}
          className="action-btn group hover:bg-green-500/10"
        >
          <FiPlay className="text-[#E8E8E6] group-hover:text-green-500" />
        </Button>
      )}
      {container.state === "running" && (
        <>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-yellow-500/10"
          >
            <FiRefreshCcw className="text-[#E8E8E6] group-hover:text-yellow-500" />
          </Button>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-red-500/10"
          >
            <FiStopCircle className="text-[#E8E8E6] group-hover:text-red-500" />
          </Button>
        </>
      )}

      <Button size={"icon-lg"} className="action-btn group hover:bg-red-500/10">
        <FiDelete className="text-[#E8E8E6] group-hover:text-red-500" />
      </Button>
    </TableCell>
  );
}
