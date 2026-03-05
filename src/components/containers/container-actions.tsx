import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiDelete, FiPlay, FiRefreshCcw, FiStopCircle } from "react-icons/fi";
import type { AppContainer, ContainerActions } from "@/types";
import { Actions } from "@/types";
import { useContainerAction } from "@/hooks";
import { memo, type MouseEvent } from "react";

const ContainerAction = memo(function ContainerAction({
  container,
}: {
  container: AppContainer;
}) {
  const { action } = useContainerAction();

  function onClick(e: MouseEvent, containerActions: ContainerActions) {
    e.stopPropagation();
    action(containerActions);
  }

  return (
    <TableCell className="flex justify-end items-center gap-1">
      {container.state !== "running" && (
        <Button
          size={"icon-lg"}
          className="action-btn group hover:bg-green-500/10"
          onClick={(e) =>
            onClick(e, { id: container.id, action: Actions.START })
          }
        >
          <FiPlay className="text-[#E8E8E6] group-hover:text-green-500" />
        </Button>
      )}
      {container.state === "running" && (
        <>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-yellow-500/10"
            onClick={(e) =>
              onClick(e, { id: container.id, action: Actions.RESTART })
            }
          >
            <FiRefreshCcw className="text-[#E8E8E6] group-hover:text-yellow-500" />
          </Button>
          <Button
            size={"icon-lg"}
            className="action-btn group hover:bg-red-500/10"
            onClick={(e) =>
              onClick(e, { id: container.id, action: Actions.STOP })
            }
          >
            <FiStopCircle className="text-[#E8E8E6] group-hover:text-red-500" />
          </Button>
        </>
      )}

      <Button
        size={"icon-lg"}
        className="action-btn group hover:bg-red-500/10"
        onClick={(e) =>
          onClick(e, { id: container.id, action: Actions.REMOVE })
        }
      >
        <FiDelete className="text-[#E8E8E6] group-hover:text-red-500" />
      </Button>
    </TableCell>
  );
});

export default ContainerAction;
