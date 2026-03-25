import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
