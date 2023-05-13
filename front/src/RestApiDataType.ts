
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
    salary: number,
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
    salary: number,
    gender: "male" | "female",
    start_time: number,
    end_time: number,
    specialization: 'Cardio' | 'Strength Training' | 'Yoga' | 'Pilates' | 'Crossfit'
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
    salary: number,
    contact: string, dob: number,
    gender: "male" | "female",
    work: 'security' | 'cleaner'
}
export interface Result<T> {
    result: T,
    isError: boolean,
}

export interface Membership {
    membership_id: string,
    member_id: string,
    type: string,
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

