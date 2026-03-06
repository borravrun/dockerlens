import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useImageList } from "@/hooks";
import ImageRow from "./image-row";

export default function ImageTable() {
  const { filtered, loading, search, refresh } = useImageList();

  if (filtered.length === 0 && !loading) {
    return (
      <p className="text-[#525252] text-center py-12">
        {search ? "No images match your search" : "No images found"}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-b-[#333332] [&>th]:text-[#6B6B6B] [&>th]:text-center [&>th]:uppercase [&>th]:font-inter [&>th]:font-medium">
          <TableHead></TableHead>
          <TableHead>Repository</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Image ID</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((image) => (
          <ImageRow key={image.id} image={image} onRefresh={refresh} />
        ))}
      </TableBody>
    </Table>
  );
}
