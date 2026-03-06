import type { AppImage } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import ImageActions from "./image-actions";
import { formatBytes, parseImageTag } from "@/lib/utils";
import { memo } from "react";

function formatDate(timestamp: number): string {
  if (!timestamp) return "N/A";
  return new Date(timestamp * 1000).toLocaleDateString();
}

const ImageRow = memo(function ImageRow({ image, onRefresh }: { image: AppImage; onRefresh: () => void }) {
  const tag = image.tags[0] || "<none>";
  const [repo, version] = parseImageTag(tag);

  return (
    <TableRow className="[&>td]:text-center border-b-[#333332] hover:bg-[#1A1A1A]/50">
      <TableCell
        className={`text-3xl ${image.containers > 0 ? "text-green-500" : "text-red-500"}`}
      >
        •
      </TableCell>
      <TableCell className="text-[#E8E8E6]">{repo}</TableCell>
      <TableCell className="text-[#A3A3A3] font-mono">{version}</TableCell>
      <TableCell className="text-[#A3A3A3] font-mono">{image.id}</TableCell>
      <TableCell className="text-[#A3A3A3]">{formatBytes(image.size)}</TableCell>
      <TableCell className="text-[#A3A3A3]">{formatDate(image.created)}</TableCell>
      <ImageActions image={image} onRefresh={onRefresh} />
    </TableRow>
  );
});

export default ImageRow;
