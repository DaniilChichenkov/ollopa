import type { Route } from "./+types/getGalleryItemImage";
import path from "path";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  try {
    const fs = await import("fs/promises");

    const { name } = params;

    const pathToFile = path.join(
      process.cwd(),
      "public",
      "uploads",
      "gallery",
      name,
    );

    const fileBuffer = await fs.readFile(pathToFile);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": getImageContentType(name),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    throw new Response("Image file not found", { status: 404 });
  }
};

function getImageContentType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
