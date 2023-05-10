
import mysql2 from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config();
const host = process.env.MYSQL_URL;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASS;
const database = process.env.MYSQL_DB;
console.log(host, user, password, database)
const db = await mysql2.createConnection({
    host: host,
    user:user,
    password: password,
    database: database
});
console.log("database connected")
export default db 