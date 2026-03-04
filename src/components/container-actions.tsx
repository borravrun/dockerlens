import { TableCell } from "./ui/table";
import { Button } from "./ui/button";
import { FiDelete, FiPlay, FiRefreshCcw, FiStopCircle } from "react-icons/fi";
import { Container, Actions } from "@/lib/types";
import { useContainerContext } from "@/store/container-context";

export default function ContainerAction({
  container,
}: {
  container: Container;
}) {
  const { action } = useContainerContext();
  return (
    <TableCell className="flex justify-end items-center gap-1">
      {container.state !== "running" && (
        <Button
          size={"icon-lg"}
          className="action-btn group hover:bg-green-500/10"
          onClick={() => action({ id: container.id, action: Actions.START })}
        >
          <FiPlay className="text-[#E8E8E6] group-hover:text-green-500" />
        </Button>
      )}
      {container.state === "running" && (
        <>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-yellow-500/10"
            onClick={() =>
              action({ id: container.id, action: Actions.RESTART })
            }
          >
            <FiRefreshCcw className="text-[#E8E8E6] group-hover:text-yellow-500" />
          </Button>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-red-500/10"
            onClick={() => action({ id: container.id, action: Actions.STOP })}
          >
            <FiStopCircle className="text-[#E8E8E6] group-hover:text-red-500" />
          </Button>
        </>
      )}

      <Button
        size={"icon-lg"}
        className="action-btn group hover:bg-red-500/10"
        onClick={() => action({ id: container.id, action: Actions.REMOVE })}
      >
        <FiDelete className="text-[#E8E8E6] group-hover:text-red-500" />
      </Button>
    </TableCell>
  );
}
