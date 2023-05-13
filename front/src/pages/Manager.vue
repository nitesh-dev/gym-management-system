<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import CreateTrainerDialog, { DialogTrainerData } from '../components/CreateTrainerDialog.vue';
import UpdateSalary, { DialogUpdateSalary } from '../components/UpdateSalary.vue';
import CreateStaffDialog, { DialogStaffData } from '../components/CreateStaffDialog.vue';
import { Trainer, Manager, Staff, Member, MemberInfo, Branch } from '../RestApiDataType';
import { getAge, unixMillisecondsToTimeString } from '../utils';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)
let isAdmin = ref(true)
let isProfileMode = ref(false)


let accountId = ref("")
let accountType = ref("")

function getCookies() {

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")

    if (window.location.pathname == "/admin/manager") {
        isAdmin.value = true
        id = localStorage.getItem("tempId")

        const mode = localStorage.getItem("isMangerProfile")
        if (mode == null || mode == "false") {
            isProfileMode.value = false
        } else {
            isProfileMode.value = true
        }

        type = "manager"
    } else {
        isAdmin.value = false
    }

    removeOldCookies()

    if (type == null || id == null || type != "manager") {
        window.location.href = '/'
    } else {
        accountId.value = id
        accountType.value = type
        fetchData()
    }
}


function removeOldCookies() {

    localStorage.removeItem("tempTrainerId")
    localStorage.removeItem("tempStaffId")
    localStorage.removeItem("tempMemberId")
}





// update salary dialog
const updateSalaryData = new (class extends DialogUpdateSalary {

    show(accountType: string, data: any): void {
        super.show(accountType, data)
    }

    onUpdateSalary(): void {
        isProgressHidden.value = false
        super.onUpdateSalary()
    }

    onSuccessFul(text: string): void {
        super.onSuccessFul(text)
        isProgressHidden.value = true
        message.value.show(text)
        fetchData()
    }

    onFailed(text: string): void {
        super.onFailed(text)
        isProgressHidden.value = true
        message.value.show(text)
    }
})

let updateSalary = ref(updateSalaryData)

function editSalary(accountType: string, accountData: any) {
    updateSalary.value.show(accountType, Object.assign({}, accountData))
}


// profile dialog
const profileData = new (class extends ProfileData {

    show(): void {
        this.accountType = "manager"
        this.profile.name = managerDetail.value.name
        this.profile.contact = managerDetail.value.contact
        this.profile.email = managerDetail.value.email
        this.profile.gender = managerDetail.value.gender
        this.profile.password = managerDetail.value.password
        this.profile.address = managerDetail.value.address
        this.profile.account_id = managerDetail.value.account_id
        this.profile.dob = managerDetail.value.dob
        super.show()
    }

    onUpdateProfile(): void {
        isProgressHidden.value = false
    }

    onSuccessFul(text: string): void {
        super.onSuccessFul(text)
        isProgressHidden.value = true
        message.value.show(text)
        fetchData()
    }

    onFailed(text: string): void {
        super.onFailed(text)
        isProgressHidden.value = true
        message.value.show(text)

    }
})

let profile = ref(profileData)



// warning dialog
const warningData = new (class extends WarningData {
    onOk(): void {

        this.hide()
        deleteData()
    }

    show(message: string): void {
        super.show(message)
    }

})

let warning = ref(warningData)



// create trainer dialog
const trainerDialogData = new (class extends DialogTrainerData {

    onCreateTrainer(): void {
        isProgressHidden.value = false
    }
    onSuccessFul(text: string): void {
        isProgressHidden.value = true
        super.onSuccessFul(text)
        message.value.show(text)
        fetchData()
    }

    onFailed(text: string): void {
        super.onFailed(text)
        isProgressHidden.value = true
        message.value.show(text)
    }
})

let trainerDialog = ref(trainerDialogData)


// create staff dialog
const staffDialogData = new (class extends DialogStaffData {

    onCreateTrainer(): void {
        isProgressHidden.value = false
    }
    onSuccessFul(text: string): void {
        isProgressHidden.value = true
        super.onSuccessFul(text)
        message.value.show(text)
        fetchData()
    }

    onFailed(text: string): void {
        super.onFailed(text)
        isProgressHidden.value = true
        message.value.show(text)
    }
})

let staffDialog = ref(staffDialogData)


// delete operation
async function deleteData() {

    console.log("deleting...")

    let res = null
    isProgressHidden.value = false
    if (activeTabIndex.value == 0) {
        res = await Api.deleteTrainer(idToDelete)

    } else if (activeTabIndex.value == 1) {
        res = await Api.deleteStaff(idToDelete)
    } else if (activeTabIndex.value == 2) {
        res = await Api.deleteMember(idToDelete)
    }

    isProgressHidden.value = true

    if (res == null) return

    if (res.isError) {
        message.value.show(res.error)
    } else {
        fetchData()
    }
}


let idToDelete = ""
function deleteOperation(message: string, id: string) {
    idToDelete = id
    warning.value.show(message)
}





function openTrainer(accountId: string) {
    localStorage.setItem("tempTrainerId", accountId)
    window.location.pathname += '/trainer'
}

function openStaff(accountId: string) {
    localStorage.setItem("tempStaffId", accountId)
    window.location.pathname += '/staff'
}

function openMember(accountId: string) {
    localStorage.setItem("tempMemberId", accountId)
    window.location.pathname += '/member'
}




function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}


let totalRev = ref(0)
let totalExp = ref(0)
async function loadBranchRevenue(branchId: string) {
    let res = await Api.getBranchRevenue(branchId)
    if (res.isError) {
        message.value.show(res.error)
    } else {
        if (res.result) {
            totalRev.value = res.result.total_rev as number
            totalExp.value = res.result.total_exp as number
        }
    }
}


let managerDetail = ref<Manager>({
    account_id: "loading...",
    branch_id: "",
    name: "loading...",
    gender: 'male',
    email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0, salary: 0
})

async function loadManagerDetail() {
    isProgressHidden.value = false
    let res = await Api.getManager(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        managerDetail.value = res.result as Manager
        loadBranchDetail(managerDetail.value.branch_id)
        loadTrainerAccounts(managerDetail.value.branch_id)
        loadBranchRevenue(managerDetail.value.branch_id)
        loadStaffAccounts(managerDetail.value.branch_id)
        loadMemberAccounts(managerDetail.value.branch_id, false)
    }
}



let branchDetail = ref<Branch>({
    branch_id: "loading...",
    name: "loading...",
    email: "loading...",
    address: "loading...",
    contact: "loading..."
})

async function loadBranchDetail(branchId: string) {

    let res = await Api.getBranch(branchId)
    if (res.isError) {
        message.value.show(res.error)
    } else {
        branchDetail.value = res.result as Branch
    }
}



let memberAccounts = ref(Array<MemberInfo>())
async function loadMemberAccounts(branchId: string, isPending: boolean) {
    isProgressHidden.value = false
    memberAccounts.value = Array<MemberInfo>()
    let res = await Api.getMemberInfo(branchId)
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        let temp = res.result as Array<MemberInfo>
        memberAccounts.value = temp.filter(function (element, index, array) {
            return element.is_approved != isPending
        })
    }
}



let staffAccounts = ref(Array<Staff>())
async function loadStaffAccounts(branchId: string) {
    isProgressHidden.value = false
    let res = await Api.getAllStaff(branchId)
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        staffAccounts.value = res.result as Array<Staff>
    }
}

async function approveMember(member: Member) {
    isProgressHidden.value = false
    member.is_approved = true
    let res = await Api.updateMember(member)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        fetchData()
    }
}



let trainerAccounts = ref(Array<Trainer>())
async function loadTrainerAccounts(branchId: string) {
    isProgressHidden.value = false
    let res = await Api.getAllTrainer(branchId)
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        trainerAccounts.value = res.result as Array<Trainer>
    }
}

function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadManagerDetail()

    } else if (activeTabIndex.value == 1) {
        if (managerDetail.value.branch_id == "") return
        loadTrainerAccounts(managerDetail.value.branch_id)

    } else if (activeTabIndex.value == 2) {
        loadStaffAccounts(managerDetail.value.branch_id)

    } else if (activeTabIndex.value == 3) {
        loadMemberAccounts(managerDetail.value.branch_id, false)

    } else if (activeTabIndex.value == 4) {

        // TODO load pending members
        loadMemberAccounts(managerDetail.value.branch_id, true)
    }
}






getCookies()

</script>
<template>
    <div class="bg-img">
        <nav class="blur-div-parent navbar sticky-top navbar-light">
            <div class="blur-div"></div>
            <div class="container-fluid" style="justify-content: left;">
                <div class="navbar-header">
                    <a class="navbar-brand">GYM Manager</a>
                </div>

                <ul class="nav nav-pills mb-3" id="pills-tab">
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 0 }"
                            @click="changeTab(0)">Info</button>
                    </li>

                    <li v-if="!isProfileMode" class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 1 }"
                            @click="changeTab(1)">Trainers</button>
                    </li>

                    <li v-if="!isProfileMode" class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 2 }"
                            @click="changeTab(2)">Staffs</button>
                    </li>

                    <li v-if="!isProfileMode" class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 3 }"
                            @click="changeTab(3)">Members</button>
                    </li>

                    <li v-if="!isProfileMode" class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 4 }"
                            @click="changeTab(4)">Pending</button>
                    </li>

                </ul>
                <p class="profile-name">{{ managerDetail.name }}</p>
                <button v-if="!isAdmin" class="btn btn-danger" @click="logout">Log out</button>
            </div>
        </nav>

        <div class="tab-content" id="pills-tabContent">

            <!-- account detail -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">
                <div class="container">
                    <div class="row justify-content-start">

                        <!-- branch detail -->
                        <div class="col-sm">
                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Branch Detail</h5>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Branch ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ branchDetail.branch_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Branch Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ branchDetail.name }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Email</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ branchDetail.email }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Contact</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ branchDetail.contact }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ branchDetail.address }}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <!-- manager detail -->
                        <div class="col-sm">
                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Manager Detail</h5>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Account ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.account_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Branch ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.branch_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Full Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.name }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Email</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.email }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Contact</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.contact }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Gender</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.gender }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Age</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ getAge(managerDetail.dob) }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ managerDetail.address }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Salary</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">₹{{ managerDetail.salary }}</p>
                                        </div>
                                    </div>
                                    <button @click="profile.show()" class="btn btn-primary">Edit Profile</button>

                                </div>
                            </div>
                        </div>

                        <!-- Revenue -->
                        <div class="col-sm">
                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Others</h5>

                                    <div class="row">
                                        <div class="col-sm-5">
                                            <p class="mb-0">Total Revenue</p>
                                        </div>
                                        <div class="col-sm-7">
                                            <p class="mb-0">₹{{ totalRev }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-5">
                                            <p class="mb-0">Total Expenditure</p>
                                        </div>
                                        <div class="col-sm-7">
                                            <p class="mb-0">₹{{ totalExp }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-5">
                                            <p class="mb-0">Total Staff</p>
                                        </div>
                                        <div class="col-sm-7">
                                            <p class="mb-0">{{ staffAccounts.length }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-5">
                                            <p class="mb-0">Total Trainer</p>
                                        </div>
                                        <div class="col-sm-7">
                                            <p class="mb-0">{{ trainerAccounts.length }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-5">
                                            <p class="mb-0">Total Member</p>
                                        </div>
                                        <div class="col-sm-7">
                                            <p class="mb-0">{{ memberAccounts.length }}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Trainers -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">

                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Trainers</h3>
                        <button v-if="!isAdmin" id="add-button" class="btn btn-info btn-block"
                            @click="trainerDialog.show()">Add Trainers</button>
                    </div>

                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Salary</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col">Specialization</th>
                                    <!-- <th scope="col">Account ID</th>
                                    <th scope="col">Branch ID</th> -->
                                    <th scope="col">Edit Salary</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="trainer, index in trainerAccounts">
                                    <th @click="openTrainer(trainer.account_id)" scope="row">{{ index }}</th>
                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.name }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.email }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.address }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.contact }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{
                                        getAge(trainer.dob) }}
                                    </td>
                                    <td @click="openTrainer(trainer.account_id)">₹{{ trainer.salary }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{
                                        unixMillisecondsToTimeString(trainer.start_time) }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{
                                        unixMillisecondsToTimeString(trainer.end_time) }}</td>

                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.specialization }}</td>
                                    <!-- <td @click="openTrainer(trainer.account_id)">{{ trainer.account_id }}</td>
                                    <td @click="openTrainer(trainer.account_id)">{{ trainer.branch_id }}</td> -->

                                    <td><button class="btn btn-info" @click="editSalary('trainer', trainer)"><i
                                                class="material-icons">edit</i>Edit</button></td>

                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really want to delete?', trainer.account_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <!-- Staffs -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 2, active: activeTabIndex == 2 }">

                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Staffs</h3>
                        <button v-if="!isAdmin" id="add-button" class="btn btn-info btn-block"
                            @click="staffDialog.show()">Add Staff</button>
                    </div>

                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Salary</th>
                                    <th scope="col">Work</th>
                                    <!-- <th scope="col">Account ID</th>
                                    <th scope="col">Branch ID</th> -->
                                    <th scope="col">Edit Salary</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="staff, index in staffAccounts">
                                    <th @click="openStaff(staff.account_id)" scope="row">{{ index }}</th>
                                    <td @click="openStaff(staff.account_id)">{{ staff.name }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ staff.email }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ staff.address }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ staff.contact }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ getAge(staff.dob) }}
                                    </td>
                                    <td @click="openStaff(staff.account_id)">₹{{ staff.salary }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ staff.work }}</td>
                                    <!-- <td @click="openStaff(staff.account_id)">{{ staff.account_id }}</td>
                                    <td @click="openStaff(staff.account_id)">{{ staff.branch_id }}</td> -->
                                    <td><button class="btn btn-info" @click="editSalary('staff', staff)"><i
                                                class="material-icons">edit</i>Edit</button></td>
                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really want to delete?', staff.account_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <!-- Members -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 3, active: activeTabIndex == 3 }">

                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Members</h3>
                    </div>

                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Membership</th>
                                    <!-- <th scope="col">Account ID</th>
                                    <th scope="col">Branch ID</th> -->
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="member, index in memberAccounts">
                                    <th @click="openMember(member.account_id)" scope="row">{{ index }}</th>
                                    <td @click="openMember(member.account_id)">{{ member.name }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.email }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.address }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.contact }}</td>
                                    <td @click="openMember(member.account_id)">{{ getAge(member.dob)
                                    }}</td>

                                    <td v-if="member.type == null"  @click="openMember(member.account_id)">No Membership</td>
                                    <td v-else  @click="openMember(member.account_id)">{{ member.type }}</td>
                                    <!-- <td @click="openMember(member.account_id)">{{ member.account_id }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.branch_id }}</td> -->

                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really want to delete?', member.account_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <!-- Pending Members -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 4, active: activeTabIndex == 4 }">

                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Members</h3>
                    </div>

                    <div class="table-responsive">
                        <table class="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Contact</th>
                                    <th scope="col">Age</th>
                                    <th scope="col">Approve</th>
                                    <!-- <th scope="col">Account ID</th>
                                    <th scope="col">Branch ID</th> -->
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="member, index in memberAccounts">
                                    <th @click="openMember(member.account_id)" scope="row">{{ index }}</th>
                                    <td @click="openMember(member.account_id)">{{ member.name }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.email }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.address }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.contact }}</td>
                                    <td @click="openMember(member.account_id)">{{ getAge(member.dob)
                                    }}
                                    </td>
                                    <!-- <td @click="openMember(member.account_id)">{{ member.account_id }}</td>
                                    <td @click="openMember(member.account_id)">{{ member.branch_id }}</td> -->

                                    <td><button class="btn btn-success" @click="approveMember(member)">Approve</button></td>

                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really want to delete?', member.account_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>


    <CreateStaffDialog :dialog="staffDialog" :branch-id="managerDetail.branch_id" />
    <CreateTrainerDialog :dialog="trainerDialog" :branch-id="managerDetail.branch_id" />
    <UpdateSalary :dialog="updateSalary" />
    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.bg-img {
    background-image: url("../assets/gym-3.jpg");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    min-height: 100vh;
}

.blur-div-parent * {
    color: white;
    filter: blur(0) !important;
}

.nav {
    margin-bottom: 0 !important;
}

#add-button {
    width: 100%;
    margin-bottom: 20px;
}

.card-parent {
    margin: 24px;
    max-width: 600px;
    width: 100%;
}

.card-parent .row {
    margin-bottom: 16px;
}

.card-body h5 {
    margin-bottom: 20px;
}


.table-container {
    margin-top: 50px;

}

.table-container h3 {
    text-align: center;
    margin-bottom: 30px;
}


.blank_row {
    background-color: #FFFFFF;
}


.blank_row th {
    padding-top: 40px;
    text-align: center !important;
}

table td,
table th {
    white-space: nowrap;
    padding: 16px 12px;
    cursor: pointer;
}

table button {
    display: flex;
    align-items: center;
}

table button i {
    font-size: 18px;
    margin-right: 8px;
}

table .table-active {
    background-color: #1f8bff !important;
    color: white !important;
}
</style>