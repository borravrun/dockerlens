import { Button } from "@/components/ui/button";
import { FiDelete, FiPlay, FiRefreshCcw, FiStopCircle } from "react-icons/fi";
import type { AppContainer, ContainerActions } from "@/types";
import { Actions } from "@/types";
import { useContainerAction, useContainerList } from "@/hooks";
import { memo } from "react";

const DrawerActions = memo(function DrawerActions({
  container,
}: {
  container: AppContainer;
}) {
  const { action } = useContainerAction();
  const { loading } = useContainerList();

  function onClick(containerActions: ContainerActions) {
    action(containerActions);
  }

  return (
    <div className="flex justify-start items-center gap-1">
      {container.state !== "running" && (
        <Button
          disabled={loading}
          className="action-btn bg-[#262626] hover:bg-green-500/10"
          onClick={() => onClick({ id: container.id, action: Actions.START })}
        >
          <FiPlay className="text-[#E8E8E6] group-hover:text-green-500" />
          Start
        </Button>
      )}
      {container.state === "running" && (
        <>
          <Button
            disabled={loading}
            className="action-btn bg-[#262626] group hover:bg-yellow-500/10"
            onClick={() =>
              onClick({ id: container.id, action: Actions.RESTART })
            }
          >
            <FiRefreshCcw className="text-[#E8E8E6] group-hover:text-yellow-500" />
            Restart
          </Button>
          <Button
            disabled={loading}
            className="action-btn bg-[#262626] group hover:bg-red-500/10"
            onClick={() => onClick({ id: container.id, action: Actions.STOP })}
          >
            <FiStopCircle className="text-[#E8E8E6] group-hover:text-red-500" />
            Stop
          </Button>
        </>
      )}

      <Button
        disabled={loading}
        className="action-btn bg-[#262626] group hover:bg-red-500/10"
        onClick={() => onClick({ id: container.id, action: Actions.REMOVE })}
      >
        <FiDelete className="text-[#E8E8E6] group-hover:text-red-500" />
        Delete
      </Button>
    </div>
  );
});

export default DrawerActions;
