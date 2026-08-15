import { db } from "./db.server";

db.exec(`

    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_et TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_ru TEXT NOT NULL,

      UNIQUE (title_et, title_en, title_ru)
    );


    CREATE TABLE IF NOT EXISTS menu_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER NOT NULL,

        title_et TEXT NOT NULL,
        title_en TEXT NOT NULL,
        title_ru TEXT NOT NULL,

        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

        description_et TEXT,
        description_en TEXT,
        description_ru TEXT,

        price TEXT NOT NULL,

        FOREIGN KEY (menu_id)
          REFERENCES menu(id)
          ON DELETE CASCADE,

        UNIQUE (title_et, menu_id),
        UNIQUE (title_en, menu_id),
        UNIQUE (title_ru, menu_id)
    );

    CREATE TABLE IF NOT EXISTS menu_item_image (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      menu_item_id INTEGER NOT NULL,

      file_name TEXT NOT NULL,

      FOREIGN KEY (menu_item_id)
          REFERENCES menu_item(id)
          ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_et TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_ru TEXT NOT NULL,

      UNIQUE (title_et, title_en, title_ru)
    );

    CREATE TABLE IF NOT EXISTS gallery_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gallery_id INTEGER NOT NULL,

      file_name TEXT NOT NULL,

      FOREIGN KEY (gallery_id)
          REFERENCES gallery(id)
          ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      weekHoursFrom TEXT NOT NULL,
      weekHoursTo TEXT NOT NULL,
      weekendHoursFrom TEXT NOT NULL,
      weekendHoursTo TEXT NOT NULL
    )
  `);
