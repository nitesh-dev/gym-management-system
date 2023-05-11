
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

function createTables() {
    createTableAdmin()
    createTableBranch()
    createTableManager()
    createTableTrainer()
    createTableStaff()
    createTableMember()
    createTableSession()
    createTableMembership()
}
function createTableAdmin() {
    db.query(`
    CREATE TABLE IF NOT EXISTS admin(
      account_id CHAR(36) NOT NULL ,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      contact VARCHAR(15),
      dob DOUBLE,
      PRIMARY KEY (account_id)
    );`)

}
function createTableBranch() {
    db.query(`CREATE TABLE IF NOT EXISTS branch(
        account_id CHAR(36) NOT NULL ,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        contact VARCHAR(15),
        dob DOUBLE,
        PRIMARY KEY (account_id)
      );`)

}
function createTableManager() {
    db.query(
        `CREATE TABLE IF NOT EXISTS manager (
            account_id CHAR(50) NOT NULL,
            branch_id CHAR(50) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            address VARCHAR(100) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            dob DOUBLE NOT NULL,
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );`)

}
function createTableTrainer() {
    db.query(
        `CREATE TABLE IF NOT EXISTS trainer (
            account_id CHAR(36) NOT NULL,
            branch_id CHAR(36) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            address VARCHAR(100) NOT NULL,
            dob DOUBLE NOT NULL,
            specialization ENUM('Cardio', 'Strength Training', 'Yoga', 'Pilates', 'Crossfit') NOT NULL,
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );`)

}
function createTableStaff() {
    db.query(
        `CREATE TABLE IF NOT EXISTS staff (
        account_id CHAR(36) NOT NULL,
        branch_id CHAR(36) NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
         address VARCHAR(100) NOT NULL,
        contact VARCHAR(20) NOT NULL,
        dob DOUBLE NOT NULL,
        work ENUM('security', 'cleaner') NOT NULL,
        PRIMARY KEY (account_id),
        FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
      );`)

}
function createTableMember() {
    db.query(
        `CREATE TABLE IF NOT EXISTS member (
            account_id CHAR(36) NOT NULL,
            branch_id CHAR(36) NOT NULL,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            address VARCHAR(100) NOT NULL,
            contact VARCHAR(20) NOT NULL,
            dob DOUBLE NOT NULL,
            membership ENUM('free','bronze', 'gold', 'silver') NOT NULL DEFAULT 'free',
            PRIMARY KEY (account_id),
            FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
          );
          `)

}
function createTableSession() {
    db.query(`CREATE TABLE IF NOT EXISTS training_session (
        session_id CHAR(36) NOT NULL,
        trainer_id CHAR(36) NOT NULL,
        member_id CHAR(36) NOT NULL,
        start_time DOUBLE NOT NULL,
        end_time DOUBLE NOT NULL,
        PRIMARY KEY (session_id),
        FOREIGN KEY (trainer_id) REFERENCES trainer (account_id),
        FOREIGN KEY (member_id) REFERENCES member (account_id)
      );
      `)
}
function createTableMembership() {
    db.query(`
    CREATE TABLE IF NOT EXISTS membership (
        membership_id CHAR(36) NOT NULL,
        member_id CHAR(36) NOT NULL,
        name VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        start_time DOUBLE NOT NULL,
        end_time DOUBLE NOT NULL,
        PRIMARY KEY (membership_id),
        FOREIGN KEY (member_id) REFERENCES member (account_id)
      );
      
      `)
}
createTables()

export default db 
