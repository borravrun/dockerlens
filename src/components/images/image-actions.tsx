import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FiDelete, FiDownload, FiPlay } from "react-icons/fi";
import type { AppImage } from "@/types";
import { runImage, deleteImage, pullImage } from "@/services";
import { memo, type MouseEvent } from "react";

const ImageActions = memo(function ImageActions({
  image,
  onRefresh,
}: {
  image: AppImage;
  onRefresh: () => void;
}) {
  const tag = image.tags[0] || "";

  async function handleAction(e: MouseEvent, fn: () => Promise<unknown>) {
    e.stopPropagation();
    try {
      await fn();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <TableCell className="flex justify-end items-center gap-1">
      {tag && (
        <Button
          size="icon-lg"
          className="action-btn group hover:bg-green-500/10"
          onClick={(e) => handleAction(e, () => runImage(tag))}
        >
          <FiPlay className="text-[#E8E8E6] group-hover:text-green-500" />
        </Button>
      )}
      {tag && (
        <Button
          size="icon-lg"
          className="action-btn group hover:bg-blue-500/10"
          onClick={(e) => handleAction(e, () => pullImage(tag))}
        >
          <FiDownload className="text-[#E8E8E6] group-hover:text-blue-500" />
        </Button>
      )}
      <Button
        size="icon-lg"
        className="action-btn group hover:bg-red-500/10"
        onClick={(e) => handleAction(e, () => deleteImage(image.id))}
      >
        <FiDelete className="text-[#E8E8E6] group-hover:text-red-500" />
      </Button>
    </TableCell>
  );
});

export default ImageActions;
