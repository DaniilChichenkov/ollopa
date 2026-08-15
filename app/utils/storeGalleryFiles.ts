import path from "node:path";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { db } from "~/db/db.server";

export async function storeGalleryFiles(
  galleryId: number,
  files: File[],
): Promise<void> {
  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "gallery",
  );

  await mkdir(uploadDirectory, { recursive: true });

  const insertMetadata = db.prepare(`
    INSERT INTO gallery_item (
      gallery_id,
      file_name
    )
    VALUES (?, ?)
  `);

  for (const file of files) {
    const extension = path.extname(file.name).toLowerCase();

    const fileName = `${galleryId}-${randomUUID()}${extension}`;

    const filePath = path.join(uploadDirectory, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    try {
      insertMetadata.run(galleryId, fileName);
    } catch (error) {
      await unlink(filePath).catch(() => {});

      throw error;
    }
  }
}
