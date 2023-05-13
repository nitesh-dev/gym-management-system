
import mysql2 from "mysql2/promise";
import SqlUtils from "./sqlUtils.js";
import { randomUUID } from "crypto";
import dotenv from 'dotenv'
dotenv.config();
const host = process.env.MYSQL_URL;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASS;
const database = process.env.MYSQL_DB;
console.log(host, user, password, database)

const db = await mysql2.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
    // host: "sql12.freemysqlhosting.net",
    // user: "sql12615940",
    // password: "aNN8PDcfX9",
    // database: "sql12615940"
});
console.log("database connected")

async function createTables() {
    await createTableAdmin()
    await createTableBranch()
    await createTableManager()
    await createTableTrainer()
    await createTableStaff()
    await createTableMember()
    await createTableMembership()
}
async function createTableAdmin() {
    await db.query(`
    CREATE TABLE IF NOT EXISTS admin(
        account_id CHAR(36) NOT NULL ,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        contact VARCHAR(15),
        dob DOUBLE,
        gender ENUM('male', 'female') NOT NULL ,
        PRIMARY KEY (account_id)
      );
    `)

}
async function createTableBranch() {
    await db.query(`
    CREATE TABLE IF NOT EXISTS branch (
        branch_id CHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        address VARCHAR(100) NOT NULL,
        email VARCHAR(50) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        PRIMARY KEY (branch_id)
      );
      `)

}
async function createTableManager() {
    await db.query(`
    CREATE TABLE IF NOT EXISTS manager (
        account_id CHAR(50) NOT NULL,
        branch_id CHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        address VARCHAR(100) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        salary INT NOT NULL,
        dob DOUBLE NOT NULL,
           gender ENUM('male', 'female') NOT NULL ,
        PRIMARY KEY (account_id),
        FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
      );      
          `)

}
async function createTableTrainer() {
    await db.query(
        `
        CREATE TABLE IF NOT EXISTS trainer (
            account_id CHAR(36) NOT NULL,
            branch_id CHAR(36) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            address VARCHAR(100) NOT NULL,
            dob DOUBLE NOT NULL,
            salary INT NOT NULL,
            start_time DOUBLE NOT NULL,
            end_time DOUBLE NOT NULL,
            specialization ENUM('Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Crossfit') NOT NULL,
            gender ENUM('male', 'female') NOT NULL ,
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );
          `)

}
async function createTableStaff() {
    await db.query(
        `
        CREATE TABLE IF NOT EXISTS staff (
            account_id CHAR(36) NOT NULL,
            branch_id CHAR(36) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            address VARCHAR(100) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            salary INT NOT NULL,
            dob DOUBLE NOT NULL,
            work ENUM('security', 'cleaner') NOT NULL,
               gender ENUM('male', 'female') NOT NULL ,
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );
      `)

}
async function createTableMember() {
    await db.query(
        `
        CREATE TABLE IF NOT EXISTS member (
            account_id CHAR(36) NOT NULL,
            branch_id CHAR(36) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            address VARCHAR(100) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            dob DOUBLE NOT NULL ,
            is_approved BOOL NOT NULL,
             gender ENUM('male', 'female') NOT NULL ,
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );
          
          `)

}
// async function createTableSession() {
//     await db.query(`CREATE TABLE IF NOT EXISTS training_session (
//         session_id CHAR(36) NOT NULL,
//         trainer_id CHAR(36) NOT NULL,
//         member_id CHAR(36) NOT NULL,
//         start_time DOUBLE NOT NULL,
//         end_time DOUBLE NOT NULL,
//         PRIMARY KEY (session_id),
//         FOREIGN KEY (trainer_id) REFERENCES trainer (account_id),
//         FOREIGN KEY (member_id) REFERENCES member (account_id)
//       );
//       `)
// }

async function createTableMembership() {
    await db.query(`
    CREATE TABLE IF NOT EXISTS membership (
        membership_id CHAR(36) NOT NULL,
        member_id CHAR(36) NOT NULL,
        type VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        start_time DOUBLE NOT NULL,
        end_time DOUBLE NOT NULL,
        PRIMARY KEY (membership_id),
        FOREIGN KEY (member_id) REFERENCES member (account_id)
      );
      
      `)
}
function deleteAllTable() {
    const tables = [
        'membership',
        'member',
        'trainer',
        'manager',
        'admin',
        'branch',
        'staff',
    ]
    tables.forEach(async (t) => { 
        await db.query(`DROP TABLE IF EXISTS ${t};`)
    })
}
//deleteAllTable()
createTables()

export default db 
