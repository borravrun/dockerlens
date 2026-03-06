import { createContext } from "react";
import type { AppImage } from "@/types";

export interface ImageListContextType {
  images: AppImage[];
  filtered: AppImage[];
  loading: boolean;
  search: string;
  setSearch: (query: string) => void;
  refresh: () => Promise<void>;
}

export const ImageListContext = createContext<ImageListContextType | null>(null);
