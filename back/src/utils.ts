
export interface Admin {
    account_id: string
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    gender: "male" | "female"
}
export interface Manager {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
    gender: "male" | "female",
    contact: string, dob: number
}
export interface Branch {
    branch_id: string,
    name: string, email: string,
    address: string,
    contact: string
}
export interface Trainer {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    gender: "male" | "female",
    specialization: 'Cardio' | 'Strength Training' | 'Yoga' | 'Pilates' | 'Crossfit'
}

export interface TrainerMember {
    trainer_id: string,
    member_id: string
}
export interface Member {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    gender: "male" | "female",
    is_approved:boolean
    // membership: 'bronze' | 'gold' | 'silver' | 'free'
}
export interface Staff {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    gender: "male" | "female",
    work: 'security' | 'cleaner'
}
export interface Result<T> {
    result: T,
    isError: boolean,
}
// export function createErrorResult(reason: string): Result<string> {
//     return { result: "", isError: true, reason: reason }
// }
export function createSqlResult<T>(isError: boolean, result: T): Result<T> {
    return { result: result, isError: isError, }
}
export interface TrainingSession {
    session_id: string,
    trainer_id: string,
    member_id: string,
    start_time: number,
    end_time: number,
}
export interface Membership {
    membership_id: string,
    member_id: string,
    name: string,
    start_time: number,
    end_time: number,
    price: number,
}
export interface Profile {
    account_id: string,
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    gender: 'male' | 'female'

}

export function isAnyInvalid(values: any[]) {
    for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (value == undefined || value == null)
            return true

    }
    return false
}
export function isValidAdmin(admin: Admin) {
    if (
        admin.account_id && admin.address && admin.contact &&
        admin.dob && admin.email && admin.name && admin.password
    )
        return false
    return true
}
