import { db } from "./db.server";

type AdminCredentials = {
  login: string;
  password_hash: string;
};

export function createAdminUser(hash: string) {
  db.prepare(
    `
    INSERT OR IGNORE INTO admin_settings (id, login, password_hash)
    VALUES(?, ?, ?)
  `,
  ).run(1, "admin", hash);
}

export function getAdminCredentials() {
  return db
    .prepare(
      `
    SELECT * FROM admin_settings WHERE id = 1
  `,
    )
    .get() as AdminCredentials;
}

export function changeAdminCredenials(hash: string) {
  db.prepare(
    `
    UPDATE admin_settings
    SET password_hash = ?
    WHERE id = 1 
  `,
  ).run(hash);
}
