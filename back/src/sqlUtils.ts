import { randomUUID } from "crypto";
import db from "./database.js";
import { Admin, Branch, Manager, Member, Result, Staff, Trainer, TrainingSession, createSqlResult } from "./utils.js";

async function _query<T>(sql: string, values: any[] = []) {
    let result: Result<T[]> = {
        isError: false,
        result: []
    }
    try {
        const [res] = await db.query(sql, values)
        result.result = res as T[]
    } catch (error) {
        console.log("sql error", error)
        result.isError = true
    }
    return result
}
namespace SqlUtils {
    export async function signIn(
        email: string,
        password: string
    ) {
        if (!(await isEmailExist(email))) {
            return createSqlResult(true, "email not exist")
        }
        const sql = `
            SELECT account_id , 'admin' AS type FROM admin WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'manager' AS type FROM manager WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'staff' AS type FROM staff WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'member' AS type FROM member WHERE email = '${email}' AND password='${password}'
            UNION ALL
            SELECT account_id , 'trainer' AS type FROM trainer WHERE email = '${email}' AND password='${password}'
            LIMIT 1;
        `
        const result = await _query<{ account_id: string, type: string }>(sql)
        if (result.isError) {
            return createSqlResult(true, "sql server error")
        } else {
            const values = result.result
            if (values.length == 0) {
                return createSqlResult(true, "wrong password")
            } else {
                return createSqlResult(false, values[0])
            }
        }
    }
    export async function isEmailExist(
        email: string,
    ) {
        const sql = `
            SELECT account_id , 'admin' AS type FROM admin WHERE email = '${email}'  
            UNION ALL
            SELECT account_id , 'manager' AS type FROM manager WHERE email = '${email}'       
            UNION ALL
            SELECT branch_id , 'branch' AS type FROM branch WHERE email = '${email}'       
            UNION ALL
            SELECT account_id , 'staff' AS type FROM staff WHERE email = '${email}'                
            UNION ALL
            SELECT account_id , 'member' AS type FROM member WHERE email = '${email}' 
            UNION ALL
            SELECT account_id , 'trainer' AS type FROM trainer WHERE email = '${email}' 
            LIMIT 1;
        `
        const result = await _query(sql)
        if (result.result.length > 0) return true
        return false
    }

    /**----------------admin------------------------ */
    export async function createAdmin(
        admin: Admin
    ) {
        if (await isEmailExist(admin.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO admin(account_id, name, email, password, address, contact, dob) VALUES(?,?,?,?,?,?,?)'
        const values = [admin.account_id, admin.name, admin.email, admin.password, admin.address, admin.contact, admin.dob]
        return _query(sql, values)
    }
    export async function getAdmin(id: string) {
        const sql = `SELECT * FROM admin WHERE account_id='${id}';`
        const result = await _query<Admin>(sql)
        const arr = result.result
        if (arr.length == 0) {
            return createSqlResult(true, "admin not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    /*-----------------------Branch-----------------------*/
    export async function createBranch(
        branch: Branch
    ) {
        if (await isEmailExist(branch.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO branch(branch_id, name, email, address, contact) VALUES(?,?,?,?,?)'
        const values = [branch.branch_id, branch.name, branch.email, branch.address, branch.contact]
        const result = await _query(sql, values)
        if (result.isError) {
            return createSqlResult(true, "sql error")
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getBranch(id: string) {
        const sql = `SELECT * FROM branch WHERE branch_id='${id}';`
        const result = await _query(sql)
        const arr = result.result
        if (arr.length == 0) {
            return createSqlResult(true, "branch not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllBranch() {
        const sql = `SELECT * FROM branch ;`
        const result = await _query(sql)
        const arr = result.result
        if (arr.length == 0) {
            return createSqlResult(true, "branch not found")
        } else {
            return createSqlResult(false, arr)
        }
    }
    /**--------------------manager-----------------------*/
    export async function createManager(
        info: Manager
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO manager(account_id, name, email, password, address, contact, dob,branch_id) VALUES(?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return createSqlResult(true, "sql error")
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getManager(id: string) {
        const sql = `SELECT * FROM manager WHERE account_id='${id}';`
        const result = await _query(sql)
        const arr = result.result
        if (arr.length == 0) {
            return createSqlResult(true, "manager not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllManager() {
        const sql = `SELECT * FROM manager';`
        const result = await _query(sql)
        const arr = result.result
        if (arr.length == 0) {
            return createSqlResult(true, "manager not found")
        } else {
            return createSqlResult(false, arr)
        }
    }

}
export default SqlUtils


/**
 * 
 * 
   


    export async function createManager(
        value: Manager
    ) {
        const sql = 'INSERT INTO manager(account_id, name, email, password, address, contact, dob,branch_id) VALUES(?,?,?,?,?,?,?,?)'
        const values = [value.account_id, value.name, value.email, value.password, value.address, value.contact, value.dob, value.branch_id]
        return _query(sql, values)
    }
    export async function createTrainer(
        value: Trainer
    ) {
        const sql = 'INSERT INTO trainer(account_id, name, email, password, address, contact, dob,branch_id,specialization) VALUES(?,?,?,?,?,?,?,?,?)'
        const values = [value.account_id, value.name, value.email, value.password, value.address, value.contact, value.dob, value.branch_id, value.specialization]
        return _query(sql, values)
    }
    export async function createStaff(
        value: Staff
    ) {
        const sql = 'INSERT INTO staff(account_id, name, email, password, address, contact, dob,branch_id,work) VALUES(?,?,?,?,?,?,?,?,?)'
        const values = [value.account_id, value.name, value.email, value.password, value.address, value.contact, value.dob, value.branch_id, value.work]
        return _query(sql, values)
    }
    export async function createMember(
        value: Member
    ) {
        const sql = 'INSERT INTO member(account_id, name, email, password, address, contact, dob,branch_id,membership) VALUES(?,?,?,?,?,?,?,?,?)'
        const values = [value.account_id, value.name, value.email, value.password, value.address, value.contact, value.dob, value.branch_id, value.membership]
        return _query(sql, values)
    }
    export async function createTrainingSession(
        value: TrainingSession
    ) {
        const sql = 'INSERT INTO training_session(session_id,trainer_id,member_id,start_time,end_time) VALUES(?,?,?,?,?)'
        const values = [value.session_id, value.trainer_id, value.member_id, value.start_time, value.end_time]
        return _query(sql, values)
    }

    function getIdNameFromTableName(tableName: string) {
        if (tableName == "session") return "session_id"
        if (tableName == "branch") return "branch_id"
        return "account_id"
    }
        export async function getWithId<T>(tableName: string, id: string) {
        let idName = getIdNameFromTableName(tableName)
        const sql = `SELECT * FROM ${tableName} WHERE ${idName}='${id}';`
        return _query<T>(sql)
    }
    export async function getAll<T>(tableName: string) {
        const sql = `SELECT * FROM ${tableName};`
        return _query<T>(sql)
    }
    export async function getWithId<T>(tableName: string, id: string) {
        let idName = getIdNameFromTableName(tableName)
        const sql = `SELECT * FROM ${tableName} WHERE ${idName}='${id}';`
        return _query<T>(sql)
    }



    export async function updateAdmin(info: Admin) {
        const sql = 'UPDATE admin SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.account_id]
        return _query(sql, values)
    }
    export async function updateBranch(info: Branch) {
        const sql = 'UPDATE branch SET name = ?, email = ?, address = ?, contact = ?, WHERE branch_id = ?';
        const values = [info.name, info.email, info.address, info.contact, info.branch_id]
        return _query(sql, values)
    }
    export async function updateManager(info: Manager) {
        const sql = 'UPDATE manager SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.account_id]
        return _query(sql, values)
    }
    export async function updateTrainer(info: Trainer) {
        const sql = 'UPDATE trainer SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,specialization = ? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.specialization, info.account_id]
        return _query(sql, values)
    }
    export async function updateStaff(info: Staff) {
        const sql = 'UPDATE staff SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,work = ? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.work, info.account_id]
        return _query(sql, values)
    }
    export async function updateMember(info: Member) {
        const sql = 'UPDATE member SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,membership = ? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.membership, info.account_id]
        return _query(sql, values)
    }

    // export async function deleteRow<T>(info: T, table_name: string) {
    //     const value = info as any
    //     let id_name = value.branch_id ? "branch_id" : value.account_id ? "account_id" : "session_id"
    //     const sql = `DELETE FROM ${table_name} WHERE ${id_name} = ?`;
    //     return _query(sql, [value[id_name]])
    // }
    // export async function deleteAdmin(info: Admin) {
    //     const sql = `DELETE FROM admin WHERE account_id = ?`;
    //     return _query(sql, [info.account_id])
    // }










 */