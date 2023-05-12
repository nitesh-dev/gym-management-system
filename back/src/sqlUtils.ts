import { randomUUID } from "crypto";
import db from "./database.js";
import { Admin, Branch, Manager, Member, Membership, Profile, Result, Staff, Trainer, TrainingSession, createSqlResult } from "./utils.js";
import { Session } from "inspector";

async function _query<T>(sql: string, values: any[] = []) {

    try {
        const [res] = await db.query(sql, values)
        return createSqlResult<T>(false, res as T)
    } catch (error: any) {
        console.error(error)
        //console.log("sql error", error)
        if (error.errno == 1451) {
            return createSqlResult(true, "first delete reference")
        } else {
            return createSqlResult(true, "sql error")
        }

    }
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
        const result = await _query<{ account_id: string, type: string }[]>(sql)
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
        const result = await _query<any[]>(sql)
        if (result.result.length > 0) return true
        return false
    }
    export async function updateProfile(type: string, profile: Profile) {
        const sql = `UPDATE ${type} SET email=? ,name = ?, password = ?, address = ?, contact = ?, dob = ?,gender = ? WHERE account_id = ? ;`
        const values = [profile.email, profile.name, profile.password, profile.address, profile.contact, profile.dob, profile.gender, profile.account_id]
        return _query(sql, values)
    }

    /**----------------admin------------------------ */
    export async function createAdmin(
        admin: Admin
    ) {
        if (await isEmailExist(admin.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO admin(account_id, name, email, password, address, contact, dob,gender) VALUES(?,?,?,?,?,?,?,?)'
        const values = [admin.account_id, admin.name, admin.email, admin.password, admin.address, admin.contact, admin.dob, admin.gender]
        return _query(sql, values)
    }
    export async function updateAdmin(info: Admin) {
        const sql = 'UPDATE admin SET email=? name = ?, password = ?, address = ?, contact = ?, dob = ?,gender=? WHERE account_id = ?';
        const values = [info.email, info.name, info.password, info.address, info.contact, info.dob, info.gender, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function getAdmin(id: string) {
        const sql = `SELECT * FROM admin WHERE account_id='${id}';`
        const result = await _query<Admin[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "admin not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllAdmin() {
        const sql = `SELECT * FROM admin;`
        const result = await _query<Admin[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
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
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function updateBranch(info: Branch) {
        const sql = 'UPDATE branch SET name = ?, email = ?, address = ?, contact = ?, WHERE branch_id = ?';
        const values = [info.name, info.email, info.address, info.contact, info.branch_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function getBranch(id: string) {
        const sql = `SELECT * FROM branch WHERE branch_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "branch not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllBranch() {
        const sql = `SELECT * FROM branch ;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        else {
            return createSqlResult(false, arr)
        }
    }
    export async function getUnusedBranch() {
        const sql = `
        SELECT branch.branch_id, branch.name, branch.address, branch.email, branch.contact
        FROM branch
        LEFT JOIN manager ON branch.branch_id = manager.branch_id
        WHERE manager.account_id IS NULL;
        `
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        else {
            return createSqlResult(false, arr)
        }
    }

    export async function deleteBranch(id: string) {
        const sql = `DELETE FROM branch WHERE branch_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }



    /**--------------------manager-----------------------*/
    export async function createManager(
        info: Manager
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO manager(account_id, name, email, password, address, contact, dob,branch_id,gender) VALUES(?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getManager(id: string) {
        const sql = `SELECT * FROM manager WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "manager not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllManager() {
        const sql = `SELECT * FROM manager;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function updateManager(info: Manager) {
        const sql = 'UPDATE manager SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,gender=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.gender, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }
    export async function deleteManager(id: string) {
        const sql = `DELETE FROM manager WHERE account_id = ? LIMIT 1;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }






    /**--------------------trainer-----------------------*/
    export async function createTrainer(
        info: Trainer
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO trainer(account_id, name, email, password, address, contact, dob,branch_id,specialization,gender) VALUES(?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.specialization, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getTrainer(id: string) {
        const sql = `SELECT * FROM trainer WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "trainer not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllTrainer() {
        const sql = `SELECT * FROM trainer;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function getAllTrainerWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM trainer WHERE branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
    }
    export async function updateTrainer(info: Trainer) {
        const sql = 'UPDATE trainer SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,specialization = ?,gender=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.specialization, info.account_id, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }

    export async function deleteTrainer(id: string) {
        const sql = `DELETE FROM trainer WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }





    /**--------------------staff-----------------------*/
    export async function createStaff(
        info: Staff
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO staff(account_id, name, email, password, address, contact, dob,branch_id,work,gender) VALUES(?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.work, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getStaff(id: string) {
        const sql = `SELECT * FROM staff WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "staff not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllStaff() {
        const sql = `SELECT * FROM staff;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function getAllStaffWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM staff WHERE branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        return createSqlResult(false, arr)
    }
    export async function updateStaff(info: Staff) {
        const sql = 'UPDATE staff SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,work = ? ,gender=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.work, info.gender, info.account_id]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "updated")
        }
    }


    export async function deleteStaff(id: string) {
        const sql = `DELETE FROM staff WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }





    /**--------------------member-----------------------*/
    export async function createMember(
        info: Member
    ) {
        if (await isEmailExist(info.email)) {
            return createSqlResult(true, "email already exist")
        }
        const sql = 'INSERT INTO member(account_id, name, email, password, address, contact, dob,branch_id,is_approved,gender) VALUES(?,?,?,?,?,?,?,?,?,?)'
        const values = [info.account_id, info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.is_approved, info.gender]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    export async function getMember(id: string) {
        const sql = `SELECT * FROM member WHERE account_id='${id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        }
        if (arr.length == 0) {
            return createSqlResult(true, "member not found")
        } else {
            return createSqlResult(false, arr[0])
        }
    }
    export async function getAllMember() {
        const sql = `SELECT * FROM member;`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function getAllMemberWithBranchId(branch_id: string) {
        const sql = `SELECT * FROM member WHERE branch_id='${branch_id}';`
        const result = await _query<any[]>(sql)
        const arr = result.result
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, arr)
        }
    }
    export async function updateMember(info: Member) {
        const sql = 'UPDATE member SET name = ?, email = ?, password = ?, address = ?, contact = ?, dob = ?,branch_id = ?,is_approved = ?,gender=? WHERE account_id = ?';
        const values = [info.name, info.email, info.password, info.address, info.contact, info.dob, info.branch_id, info.is_approved, info.gender, info.account_id]
        const result = await _query(sql, values)
        return result
    }

    export async function deleteMember(id: string) {
        const sql = `DELETE FROM member WHERE account_id = ?;`
        const values = [id]
        const result = await _query<any>(sql, values)
        if (result.isError) {
            return result
        } else if (result.result.affectedRows > 0) {
            return createSqlResult(false, "deleted")
        }
        else {

            return createSqlResult(true, "unable to delete")
        }
    }






    /**----------------------session--------------------- */
    async function isSessionExist(session: TrainingSession) {
        //check if trainer and member id exist or not
        const sql = `SELECT * FROM training_session WHERE trainer_id = '${session.trainer_id}' AND member_id = '${session.member_id}' LIMIT 1;`
        const result = await _query<any[]>(sql)
        if (result.result.length > 0) return true
        return false
    }
    async function createSession(info: TrainingSession) {
        if ((await isSessionExist(info))) {
            return createSqlResult(true, "session already exist")
        }
        const sql = `INSERT INTO training_session(session_id,trainer_id,member_id,start_time,end_time) VALUES(?,?,?,?,?)`
        const values = [info.session_id, info.trainer_id, info.member_id, info.start_time, info.end_time]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
    /**--------------------membership-----------------------*/
    export async function createMembership(
        info: Membership
    ) {
        const sql = 'INSERT INTO membership (membership_id,member_id,name,price,start_time,end_time) VALUES()'
        const values = [info.membership_id, info.member_id, info.name, info.price, info.start_time, info.end_time]
        const result = await _query(sql, values)
        if (result.isError) {
            return result
        } else {
            return createSqlResult(false, "created")
        }
    }
}
export default SqlUtils


/**
 * 
 * 

    export async function createTrainingSession(
        info: TrainingSession
    ) {
        const sql = 'INSERT INTO training_session(session_id,trainer_id,member_id,start_time,end_time) VALUES(?,?,?,?,?)'
        const values = [info.session_id, info.trainer_id, info.member_id, info.start_time, info.end_time]
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