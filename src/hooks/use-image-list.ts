import { useContext } from "react";
import { ImageListContext } from "@/providers/image-contexts";

export function useImageList() {
  const context = useContext(ImageListContext);
  if (!context) {
    throw new Error("useImageList must be used within an ImageProvider");
  }
  return context;
}
