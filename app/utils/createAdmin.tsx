import bcrypt from "bcryptjs";
import { createAdminUser } from "~/db/admin.server";

export async function createInitialAdmin() {
  await import("~/db/migrate.server");

  // Hash initial password
  const defaultPassword = "12345";
  const hash = await bcrypt.hash(defaultPassword, 12);

  // Store it in db
  createAdminUser(hash);
}

createInitialAdmin();
