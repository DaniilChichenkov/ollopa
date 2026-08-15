import { db } from "./db.server";

export type Location = {
  id: number;
  address: string;
  phone: string;
  weekHoursFrom: string;
  weekHoursTo: string;
  weekendHoursFrom: string;
  weekendHoursTo: string;
};

export function createLocation(
  address: string,
  phone: string,
  weekHoursFrom: string,
  weekHoursTo: string,
  weekendHoursFrom: string,
  weekendHoursTo: string,
) {
  const result = db
    .prepare(
      `
      INSERT INTO location (
        address,
        phone,
        weekHoursFrom,
        weekHoursTo,
        weekendHoursFrom,
        weekendHoursTo
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    )
    .run(
      address,
      phone,
      weekHoursFrom,
      weekHoursTo,
      weekendHoursFrom,
      weekendHoursTo,
    );

  return result.lastInsertRowid;
}

export function getAllLocations(): Location[] {
  return db
    .prepare(
      `
    SELECT * FROM location
  `,
    )
    .all() as Location[];
}

export function getLocationById(id: number) {
  return db
    .prepare(
      `
    SELECT * FROM location
    WHERE id = ?
  `,
    )
    .get(id);
}

export function updateLocation(
  id: number,
  address: string,
  phone: string,
  weekHoursFrom: string,
  weekHoursTo: string,
  weekendHoursFrom: string,
  weekendHoursTo: string,
) {
  return db
    .prepare(
      `
      UPDATE location
      SET
        address = ?,
        phone = ?,
        weekHoursFrom = ?,
        weekHoursTo = ?,
        weekendHoursFrom = ?,
        weekendHoursTo = ?
      WHERE id = ?
    `,
    )
    .run(
      address,
      phone,
      weekHoursFrom,
      weekHoursTo,
      weekendHoursFrom,
      weekendHoursTo,
      id,
    );
}

export function deleteLocation(id: number) {
  db.prepare(
    `
    DELETE FROM location
    WHERE id = ?
  `,
  ).run(id);
}
