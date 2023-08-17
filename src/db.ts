import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface DbItem {
  title: string;
  completed: boolean;
}

export interface DbItemWithId extends DbItem {
  id: number;
}

/**
 * Adds in a single item to the database
 *
 * @param data - the item data to insert in
 * @returns the item added (with a newly created id)
 */
export const addDbItem = async (data: DbItem): Promise<DbItemWithId> => {
  const newItem = await pool.query(
    "INSERT INTO todo (title) VALUES($1) RETURNING *",
    [data.title]
  );
  return newItem.rows[0];
};

/**
 * Deletes a database item with the given id
 *
 * @param id - the id of the database item to delete
 * @returns the deleted database item (if originally located),
 *  otherwise the string `"not found"`
 */
export const deleteDbItemById = async (
  id: number
): Promise<DbItemWithId | "not found"> => {
  const deletedItem = await pool.query(
    "DELETE FROM todo WHERE id = $1 RETURNING *",
    [id]
  );
  if (deletedItem.rowCount == 0) {
    return "not found";
  } else {
    return deletedItem.rows[0];
  }
};

/**
 * Find all database items
 * @returns all database items from the database
 */
export const getAllDbItems = async (): Promise<DbItemWithId[]> => {
  const allItems = await pool.query(
    "SELECT * FROM todo ORDER BY completed ASC"
  );
  return allItems.rows;
};

/**
 * Locates a database item by a given id
 *
 * @param id - the id of the database item to locate
 * @returns the located database item (if found),
 *  otherwise the string `"not found"`
 */
export const getDbItemById = async (
  id: number
): Promise<DbItemWithId | "not found"> => {
  const itemById = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
  if (itemById.rowCount == 0) {
    return "not found";
  } else {
    return itemById.rows[0];
  }
};

/**
 * Applies a partial update to a database item for a given id
 *  based on the passed data
 *
 * @param id - the id of the database item to update
 * @param newData - the new data to overwrite
 * @returns the updated database item (if one is located),
 *  otherwise the string `"not found"`
 */
export const updateDbItemById = async (
  id: number,
  newData: Partial<DbItem>
): Promise<DbItemWithId | "not found"> => {
  const updatedItem = await pool.query(
    "UPDATE todo SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
    [newData.title, newData.completed, id]
  );
  if (updatedItem.rowCount == 0) {
    return "not found";
  } else {
    return updatedItem.rows[0];
  }
};
