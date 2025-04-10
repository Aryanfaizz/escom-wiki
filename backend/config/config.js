//Author: Luis Cabarique - B00882627
//Here the connection to mysql is initialize

//Import MySQL library
import { createConnection, createPool } from "mysql2";

//Import environment variables
import env from "./env.js";

//Create Database connection pool
const db = createPool({
	host: env.DB_HOST,
	port: env.DB_PORT,
	database: env.DB_DATABASE,
	user: env.DB_USERNAME,
	password: env.DB_PASSWORD,
	connectionLimit: 100
})

//Return database connection
export default db;