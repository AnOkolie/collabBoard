import pkg from "pg";
import { ENV } from "../utils/env.js";
const { Pool } = pkg;

// export const pool = new Pool({
//   host: "collabboard.cfym8u6aarzh.us-east-2.rds.amazonaws.com",
//   port: 5432,
//   user: "postgres",
//   password: process.env.DB_PASSWORD,
//   database: "postgres",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "anthonyokolie",
  database: "collab_board",
});
export const test = async () => {
  console.log("connecting DB...");
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows);
};
