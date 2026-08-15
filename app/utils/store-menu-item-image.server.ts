import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export type StoredMenuItemImage = {
  fileName: string;
  relativePath: string;
  absolutePath: string;
  mimeType: string;
};

export async function storeMenuItemImage(
  file: File,
  menuItemId: number | bigint,
): Promise<StoredMenuItemImage> {
  if (!(file instanceof File)) {
    throw new Error("No valid image file provided");
  }

  if (file.size === 0) {
    throw new Error("Uploaded image is empty");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must not exceed 5 MB");
  }

  if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
    throw new Error("Invalid menu item ID");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = await fileTypeFromBuffer(buffer);

  if (!detectedType || !ALLOWED_IMAGE_TYPES.has(detectedType.mime)) {
    throw new Error("Unsupported image format");
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "menu-items",
  );

  await mkdir(uploadDirectory, { recursive: true });

  // Remove an older image belonging to this item, even if its extension differs.
  await removeExistingMenuItemImage(uploadDirectory, menuItemId);

  const fileName = `${menuItemId}.${detectedType.ext}`;
  const absolutePath = path.join(uploadDirectory, fileName);

  await writeFile(absolutePath, buffer);

  return {
    fileName,
    relativePath: `/uploads/menu-items/${fileName}`,
    absolutePath,
    mimeType: detectedType.mime,
  };
}

async function removeExistingMenuItemImage(
  uploadDirectory: string,
  menuItemId: number | bigint,
): Promise<void> {
  const files = await readdir(uploadDirectory);
  const expectedPrefix = `${menuItemId}.`;

  const matchingFiles = files.filter((fileName) =>
    fileName.startsWith(expectedPrefix),
  );

  await Promise.all(
    matchingFiles.map((fileName) =>
      unlink(path.join(uploadDirectory, fileName)),
    ),
  );
}
