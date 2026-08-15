import type { Route } from "./+types/removeOneItemFromGallery";

export const action = async ({ params, request }: Route.ActionArgs) => {
  // Check if user is authenticated
  const { requireUser } = await import("~/session.server");
  await requireUser(request);

  try {
    const { imageId } = params;

    if (!imageId || typeof +imageId !== "number") {
      return { success: false };
    }

    const { deleteGalleryItem, getGalleryItemById } =
      await import("~/db/gallery.server");
    const { deleteGalleryItemImage } =
      await import("~/utils/delete-gallery-item-image.server");

    const galleryItem = getGalleryItemById(+imageId);

    // Delete record from DB
    deleteGalleryItem(+imageId);

    // Delete file from fs
    if (galleryItem.file_name) {
      deleteGalleryItemImage(galleryItem.file_name);
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
