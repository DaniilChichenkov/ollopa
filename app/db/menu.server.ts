import { db } from "./db.server";

export type Menu = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items_count: number;
};

type MenuTitle = {
  et: string;
  en: string;
  ru: string;
};

export type MenuItem = {
  id: number;
  menu_id: number;

  title_et: string;
  title_en: string;
  title_ru: string;

  updated_at: string;

  description_et: string | null;
  description_en: string | null;
  description_ru: string | null;

  price: string;
  image_file_name: string | null;
};

export type NewMenuItem = {
  title_et: string;
  title_en: string;
  title_ru: string;

  description_et: string | null;
  description_en: string | null;
  description_ru: string | null;

  price: string;
};

export type CreateMenuItemImageMetadata = {
  menuItemId: number | bigint;
  fileName: string;
};

export type MenuWithItems = {
  id: number;
  title_et: string;
  title_en: string;
  title_ru: string;
  items: {
    id: number;
    menu_id: number;

    title_et: string;
    title_en: string;
    title_ru: string;
    updated_at: string;

    description_et: string | null;
    description_en: string | null;
    description_ru: string | null;

    price: string;

    image_file_name: string | null;
  }[];
};

type MenuQueryRow = {
  menu_id: number;
  menu_title_et: string;
  menu_title_en: string;
  menu_title_ru: string;

  item_id: number | null;
  item_title_et: string | null;
  item_title_en: string | null;
  item_title_ru: string | null;

  description_et: string | null;
  description_en: string | null;
  description_ru: string | null;

  updated_at: string | null;

  price: string | null;

  image_file_name: string | null;
};

export function createNewMenu(title: MenuTitle) {
  db.prepare(
    `
      INSERT INTO menu (
        title_et,
        title_en,
        title_ru
      ) VALUES (?, ?, ?)
    `,
  ).run(title.et, title.en, title.ru);
}

export function getAllMenus(): Menu[] {
  return db
    .prepare(
      `
        SELECT
          menu.id,
          menu.title_et,
          menu.title_en,
          menu.title_ru,
          COUNT(menu_item.id) AS items_count
        FROM menu
        LEFT JOIN menu_item
          ON menu.id = menu_item.menu_id
        GROUP BY
          menu.id,
          menu.title_et,
          menu.title_en,
          menu.title_ru
      `,
    )
    .all() as Menu[];
}

export function getFullMenuById(id: number): {
  menu: Menu;
  menuItems: MenuItem[];
} {
  const menu = db
    .prepare(
      `
        SELECT
          id,
          title_et,
          title_en,
          title_ru
        FROM menu
        WHERE id = ?
      `,
    )
    .get(id) as Menu | undefined;

  if (!menu) {
    throw new Error(`Menu with ID ${id} was not found`);
  }

  const menuItems = db
    .prepare(
      `
        SELECT
          menu_item.id,
          menu_item.menu_id,

          menu_item.title_et,
          menu_item.title_en,
          menu_item.title_ru,

          menu_item.description_et,
          menu_item.description_en,
          menu_item.description_ru,
          menu_item.updated_at,

          menu_item.price,
          menu_item_image.file_name AS image_file_name
        FROM menu_item
        LEFT JOIN menu_item_image
          ON menu_item_image.menu_item_id = menu_item.id
        WHERE menu_item.menu_id = ?
        ORDER BY menu_item.id
      `,
    )
    .all(menu.id) as MenuItem[];

  return {
    menu,
    menuItems,
  };
}

export function createMenuItem(menuId: number, newItem: NewMenuItem) {
  const { lastInsertRowid } = db
    .prepare(
      `
        INSERT INTO menu_item (
          title_et,
          title_en,
          title_ru,
          description_et,
          description_en,
          description_ru,
          price,
          menu_id,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      newItem.title_et,
      newItem.title_en,
      newItem.title_ru,
      newItem.description_et,
      newItem.description_en,
      newItem.description_ru,
      newItem.price,
      menuId,
      Date.now(),
    );

  return Number(lastInsertRowid);
}

export function createMenuItemImageMetadata({
  menuItemId,
  fileName,
}: CreateMenuItemImageMetadata) {
  return db
    .prepare(
      `
      INSERT INTO menu_item_image (
        menu_item_id,
        file_name
      )
      VALUES (?, ?)
    `,
    )
    .run(menuItemId, fileName);
}

export function updateMenuItemImageMetadata({
  menuItemId,
  fileName,
}: CreateMenuItemImageMetadata) {
  return db
    .prepare(
      `
      UPDATE menu_item_image
      SET file_name = ?
      WHERE menu_item_id = ?
    `,
    )
    .run(fileName, menuItemId);
}

export function getMenuItemImageMetadata(id: number) {
  return db
    .prepare(
      `
      SELECT * FROM menu_item_image WHERE menu_item_id = ?
    `,
    )
    .get(id) as { file_name: string };
}

export function deleteMenuItem(id: number) {
  return db
    .prepare(
      `
      DELETE FROM menu_item WHERE id = ?
    `,
    )
    .run(id);
}

export function changeMenuTitle(title: MenuTitle, id: number) {
  db.prepare(
    `
     UPDATE menu
      SET title_et = ?, title_en = ?, title_ru = ?
      WHERE id = ?
    `,
  ).run(title.et, title.en, title.ru, id);
}

export function deleteMenuById(id: number) {
  db.prepare(
    `
      DELETE FROM menu WHERE id = ?
    `,
  ).run(id);
}

function buildMenuTree(rows: MenuQueryRow[]): MenuWithItems[] {
  const menus = new Map<number, MenuWithItems>();

  for (const row of rows) {
    let menu = menus.get(row.menu_id);

    if (!menu) {
      menu = {
        id: row.menu_id,
        title_et: row.menu_title_et,
        title_en: row.menu_title_en,
        title_ru: row.menu_title_ru,
        items: [],
      };

      menus.set(row.menu_id, menu);
    }

    if (row.item_id === null) {
      continue;
    }

    menu.items.push({
      id: row.item_id,
      menu_id: row.menu_id,

      title_et: row.item_title_et!,
      title_en: row.item_title_en!,
      title_ru: row.item_title_ru!,
      updated_at: row.updated_at!,

      description_et: row.description_et,
      description_en: row.description_en,
      description_ru: row.description_ru,

      price: row.price!,

      image_file_name: row.image_file_name,
    });
  }

  return [...menus.values()];
}

export function getAllMenusWithItems(): MenuWithItems[] {
  const rows = db
    .prepare(
      `
        SELECT
          menu.id AS menu_id,
          menu.title_et AS menu_title_et,
          menu.title_en AS menu_title_en,
          menu.title_ru AS menu_title_ru,

          menu_item.id AS item_id,
          menu_item.title_et AS item_title_et,
          menu_item.title_en AS item_title_en,
          menu_item.title_ru AS item_title_ru,
          menu_item.description_et,
          menu_item.description_en,
          menu_item.description_ru,
          menu_item.price,
          menu_item.updated_at,

          menu_item_image.file_name AS image_file_name

        FROM menu

        LEFT JOIN menu_item
          ON menu_item.menu_id = menu.id

        LEFT JOIN menu_item_image
          ON menu_item_image.menu_item_id = menu_item.id

        ORDER BY
          menu.id,
          menu_item.id
      `,
    )
    .all() as MenuQueryRow[];

  return buildMenuTree(rows);
}

export function getMenuItemById(id: number) {
  return db
    .prepare(
      `
      SELECT * FROM menu_item
      WHERE id = ?
    `,
    )
    .get(id);
}

export function updateMenuItem(
  id: number,
  data: {
    title_et: string;
    title_en: string;
    title_ru: string;
    description_et?: string | null;
    description_en?: string | null;
    description_ru?: string | null;
    price: string;
  },
) {
  const stmt = db.prepare(`
    UPDATE menu_item
    SET
      title_et = ?,
      title_en = ?,
      title_ru = ?,
      description_et = ?,
      description_en = ?,
      description_ru = ?,
      price = ?,
      updated_at = ?
    WHERE id = ?
  `);

  return stmt.run(
    data.title_et,
    data.title_en,
    data.title_ru,
    data.description_et ?? null,
    data.description_en ?? null,
    data.description_ru ?? null,
    data.price,
    Date.now(),
    id,
  );
}
