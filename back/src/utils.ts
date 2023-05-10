
export interface Admin {
    account_id: string
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number
}
export interface Manager {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
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
    membership: 'bronze' | 'gold' | 'silver' | 'free'
}
export interface Staff {
    account_id: string,
    branch_id: string,
    name: string, email: string,
    password: string, address: string,
    contact: string, dob: number,
    work: 'security' | 'cleaner'
}
export interface Result<T> {
    result: T,
    isError: boolean,
    reason: any
}
export function createErrorResult(reason: string): Result<string> {
    return { result: "", isError: true, reason: reason }
}
export interface TrainingSession {
    session_id: string,
    trainer_id: string,
    member_id: string,
    start_time: number,
    end_time: number,
}