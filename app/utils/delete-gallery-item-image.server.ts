import path from "node:path";
import { unlink } from "node:fs/promises";

export async function deleteGalleryItemImage(fileName: string): Promise<void> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "gallery",
    fileName,
  );

  try {
    await unlink(filePath);
  } catch (error) {
    // Ignore if the file doesn't exist.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return;
    }

    throw error;
  }
}
