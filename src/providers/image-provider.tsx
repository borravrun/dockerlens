import { getImages } from "@/services";
import type { AppImage } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { ImageListContext } from "./image-contexts";

export function ImageProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<AppImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setImages(await getImages());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();

    let unlisten: (() => void) | null = null;
    let cancelled = false;

    listen<AppImage[]>("images-changed", (event) => {
      setImages(event.payload);
    }).then((fn) => {
      if (cancelled) { fn(); return; }
      unlisten = fn;
    });

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [fetchImages]);

  const filtered = useMemo(() => {
    if (!search) return images;
    const q = search.toLowerCase();
    return images.filter(
      (img) =>
        img.id.toLowerCase().includes(q) ||
        img.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [images, search]);

  const value = useMemo(
    () => ({ images, filtered, loading, search, setSearch, refresh: fetchImages }),
    [images, filtered, loading, search, fetchImages],
  );

  return (
    <ImageListContext.Provider value={value}>
      {children}
    </ImageListContext.Provider>
  );
}
