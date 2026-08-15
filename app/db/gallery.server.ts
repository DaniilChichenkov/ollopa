import { db } from "./db.server";

export type Gallery = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items_count: number;
};

export type GalleryTitle = {
  et: string;
  en: string;
  ru: string;
};

export type GalleryItem = {
  id: number;
  gallery_id: number;
  file_name: string;
};

export type GalleryContent = {
  gallery: Gallery;
  galleryItems: GalleryItem[];
};

export type GalleryWithItems = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items: GalleryItem[];
};

type GalleryQueryRow = {
  gallery_id: number;
  gallery_title_et: string;
  gallery_title_en: string;
  gallery_title_ru: string;

  item_id: number | null;
  file_name: string | null;
};

export function createNewGallery(title: GalleryTitle) {
  db.prepare(
    `
      INSERT INTO gallery (title_et, title_en, title_ru) 
      VALUES (?, ?, ?)
    `,
  ).run(title.et, title.en, title.ru);
}

export function getAllGalleries(): Gallery[] {
  return db
    .prepare(
      `
      SELECT
        gallery.id,
        gallery.title_et,
        gallery.title_en,
        gallery.title_ru,
        COUNT(gallery_item.id) AS items_count
      FROM gallery
      LEFT JOIN gallery_item
        ON gallery.id = gallery_item.gallery_id
      GROUP BY
        gallery.id,
        gallery.title_et,
        gallery.title_en,
        gallery.title_ru
      ORDER BY gallery.id
    `,
    )
    .all() as Gallery[];
}

export function getGalleryContent(galleryId: number): GalleryContent {
  const gallery = db
    .prepare(
      `
        SELECT
          id,
          title_et,
          title_en,
          title_ru
        FROM gallery
        WHERE id = ?
      `,
    )
    .get(galleryId) as Gallery | undefined;

  if (!gallery) {
    throw new Error(`Gallery with ID ${galleryId} was not found`);
  }

  const galleryItems = db
    .prepare(
      `
        SELECT
          id,
          gallery_id,
          file_name
        FROM gallery_item
        WHERE gallery_id = ?
        ORDER BY id
      `,
    )
    .all(gallery.id) as GalleryItem[];

  return {
    gallery,
    galleryItems,
  };
}

export function changeGalleryTitle(
  title: GalleryTitle,
  galleryId: number,
): void {
  db.prepare(
    `
      UPDATE gallery
      SET
        title_et = ?,
        title_en = ?,
        title_ru = ?
      WHERE id = ?
    `,
  ).run(title.et, title.en, title.ru, galleryId);
}

export function deleteGallery(id: number) {
  db.prepare(
    `
      DELETE FROM gallery
      WHERE id = ?
  `,
  ).run(id);
}

export function deleteGalleryItem(id: number) {
  db.prepare(
    `
      DELETE FROM gallery_item
      WHERE id = ?
  `,
  ).run(id);
}

export function getGalleryItemById(id: number) {
  const galleryItem = db
    .prepare(
      `
      SELECT * FROM gallery_item
      WHERE id = ?
  `,
    )
    .get(id);

  return galleryItem as GalleryItem;
}

function buildGalleryTree(rows: GalleryQueryRow[]): GalleryWithItems[] {
  const galleries = new Map<number, GalleryWithItems>();

  for (const row of rows) {
    let gallery = galleries.get(row.gallery_id);

    if (!gallery) {
      gallery = {
        id: row.gallery_id,
        title_et: row.gallery_title_et,
        title_en: row.gallery_title_en,
        title_ru: row.gallery_title_ru,
        items: [],
      };

      galleries.set(row.gallery_id, gallery);
    }

    if (row.item_id === null) {
      continue;
    }

    gallery.items.push({
      id: row.item_id,
      gallery_id: row.gallery_id,
      file_name: row.file_name!,
    });
  }

  return [...galleries.values()];
}

export function getAllGalleriesWithItems(): GalleryWithItems[] {
  const rows = db
    .prepare(
      `
        SELECT
          gallery.id AS gallery_id,
          gallery.title_et AS gallery_title_et,
          gallery.title_en AS gallery_title_en,
          gallery.title_ru AS gallery_title_ru,

          gallery_item.id AS item_id,
          gallery_item.file_name

        FROM gallery

        LEFT JOIN gallery_item
          ON gallery_item.gallery_id = gallery.id

        ORDER BY
          gallery.id,
          gallery_item.id
      `,
    )
    .all() as GalleryQueryRow[];

  return buildGalleryTree(rows);
}
