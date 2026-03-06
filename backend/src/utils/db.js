import pkg from "pg";
import { ENV } from "./ENV.js";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: ENV.DB_URL,
});
export const test = async () => {
  console.log("connecting DB...");
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows);
};
