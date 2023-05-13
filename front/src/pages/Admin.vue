<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import CreateManagerDialog, { DialogManagerData } from '../components/CreateManagerDialog.vue';
import CreateBranchDialog, { DialogBranchData } from '../components/CreateBranchDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { Admin, Branch, GYMDetail, Manager } from '../RestApiDataType';
import { unixMillisecondsToDateString } from '../utils'
import UpdateSalary, { DialogUpdateSalary } from '../components/UpdateSalary.vue';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref("")
let accountType = ref("")

getCookies()

function getCookies() {
    removeOldCookies()

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")
    if (type == null || id == null) {
        window.location.href = '/'
    } else {
        accountId.value = id
        accountType.value = type
        fetchData()
    }
}

function removeOldCookies() {
    localStorage.removeItem("tempId")
    localStorage.removeItem("isMangerProfile")
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
        this.accountType = "admin"
        this.profile.name = adminDetail.value.name
        this.profile.contact = adminDetail.value.contact
        this.profile.email = adminDetail.value.email
        this.profile.gender = adminDetail.value.gender
        this.profile.password = adminDetail.value.password
        this.profile.address = adminDetail.value.address
        this.profile.account_id = adminDetail.value.account_id
        this.profile.dob = adminDetail.value.dob
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



// waring dialog
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



// create manager dialog
const managerDialogData = new (class extends DialogManagerData {
    onCreateManager(): void {
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

let managerDialog = ref(managerDialogData)



// create branch dialog
const branchDialogData = new (class extends DialogBranchData {

    onCreateBranch(): void {
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

let branchDialog = ref(branchDialogData)






let adminDetail = ref<Admin>({
    account_id: "loading...",
    name: "loading...",
    gender: 'male',
    email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0
})

async function loadAdminDetail() {
    isProgressHidden.value = false
    let res = await Api.getAdmin(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        adminDetail.value = res.result as Admin
    }
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


let gymDetail = ref<GYMDetail>({
    exp: 0,
    rev: 0,
    staff: 0,
    member: 0,
    manager: 0,
    trainer: 0,
    branch: 0
})
async function loadGymDetail() {
    isProgressHidden.value = false
    let res = await Api.getGymDetail()
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        gymDetail.value = res.result as GYMDetail
    }
}



let managerAccounts = ref(Array<Manager>())
async function loadManagerAccounts() {
    isProgressHidden.value = false
    let res = await Api.getAllManagers()
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        managerAccounts.value = res.result as Array<Manager>
    }
}


let branchDetails = ref(Array<Branch>())
async function loadAllBranches() {
    isProgressHidden.value = false
    let res = await Api.getAllBranch()
    isProgressHidden.value = true

    if (res.isError) {
        message.value.show(res.error)
    } else {
        branchDetails.value = res.result as Array<Branch>
    }
}

function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadAdminDetail()
        loadGymDetail()

    } else if (activeTabIndex.value == 1) {
        loadManagerAccounts()

    } else if (activeTabIndex.value == 2) {
        loadAllBranches()
    }
}


async function deleteData() {

    console.log("deleting...")

    let res = null
    isProgressHidden.value = false
    if (activeTabIndex.value == 1) {
        res = await Api.deleteManager(idToDelete)

    } else if (activeTabIndex.value == 2) {
        res = await Api.deleteBranch(idToDelete)
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

function openManager(id: string) {
    localStorage.setItem("tempId", id)
    localStorage.setItem("isMangerProfile", "true")
    window.location.href = '/admin/manager'
}

function openBranch(branchId: string) {
    for (let index = 0; index < managerAccounts.value.length; index++) {
        const manager = managerAccounts.value[index];
        if (manager.branch_id == branchId) {
            localStorage.setItem("tempId", manager.account_id)
            localStorage.setItem("isMangerProfile", "false")
            window.location.href = '/admin/manager'
            break
        }
    }
}


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
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 1 }"
                            @click="changeTab(1)">Managers</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" :class="{ active: activeTabIndex == 2 }"
                            @click="changeTab(2)">Branches</button>
                    </li>
                </ul>

                <button style="margin-inline-start:auto" class="btn btn-danger" @click="logout">Log out</button>
            </div>
        </nav>


        <div class="tab-content" id="pills-tabContent">

            <!-- account detail -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">

                <div class="container">
                    <div class="row justify-content-start">

                        <!-- Admin detail -->
                        <div class="col-sm">

                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Admin Detail</h5>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Account ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.account_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Full Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.name }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Email</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.email }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Contact</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.contact }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Gender</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.gender }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">DOB</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ unixMillisecondsToDateString(adminDetail.dob) }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ adminDetail.address }}</p>
                                        </div>
                                    </div>
                                    <button @click="profile.show()" class="btn btn-primary">Edit Profile</button>

                                </div>
                            </div>
                        </div>

                        <!-- Others detail -->
                        <div class="col-sm">

                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Others Detail</h5>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Expenditure</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">₹{{ gymDetail.exp }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Revenue</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">₹{{ gymDetail.rev }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Manager</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ gymDetail.manager }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Branch</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ gymDetail.branch }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Staff</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ gymDetail.staff }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Trainer</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ gymDetail.trainer }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Total Member</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ gymDetail.member }}</p>
                                        </div>
                                    </div>

                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Managers -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">

                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Managers</h3>
                        <button id="add-button" class="btn btn-info btn-block" @click="managerDialog.show()">Add
                            Manager</button>
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
                                    <th scope="col">Salary</th>
                                    <th scope="col">DOB</th>
                                    <th scope="col">Update Salary</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="manager, index in managerAccounts">
                                    <th scope="row">{{ index }}</th>
                                    <td @click="openManager(manager.account_id)">{{ manager.name }}</td>
                                    <td @click="openManager(manager.account_id)">{{ manager.email }}</td>
                                    <td @click="openManager(manager.account_id)">{{ manager.address }}</td>
                                    <td @click="openManager(manager.account_id)">{{ manager.contact }}</td>
                                    <td @click="openManager(manager.account_id)">₹{{ manager.salary }}</td>
                                    <td @click="openManager(manager.account_id)">{{
                                        unixMillisecondsToDateString(manager.dob) }}</td>

                                    <td><button class="btn btn-info" @click="editSalary('manager', manager)"><i
                                                class="material-icons">edit</i>Edit</button></td>

                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really wants to delete?', manager.account_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <!-- Branch -->
            <div class="tab-pane fade" :class="{ show: activeTabIndex == 2, active: activeTabIndex == 2 }">
                <div class="blur-div-parent table-container">
                    <div class="blur-div"></div>
                    <div class="container">
                        <h3>Branch</h3>
                        <button id="add-button" class="btn btn-info btn-block" @click="branchDialog.show()">Add
                            Branch</button>
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
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="branch, index in branchDetails">
                                    <th @click="openBranch(branch.branch_id)" scope="row">{{ index }}</th>
                                    <td @click="openBranch(branch.branch_id)">{{ branch.name }}</td>
                                    <td @click="openBranch(branch.branch_id)">{{ branch.email }}</td>
                                    <td @click="openBranch(branch.branch_id)">{{ branch.address }}</td>
                                    <td @click="openBranch(branch.branch_id)">{{ branch.contact }}</td>

                                    <td><button class="btn btn-danger"
                                            @click="deleteOperation('Do you really wants to delete?', branch.branch_id)"><i
                                                class="material-icons">delete</i>Delete</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- <div class="blur-div-parent">

            </div> -->

        </div>

    </div>


    <CreateBranchDialog :dialog="branchDialog" />
    <CreateManagerDialog :dialog="managerDialog" />
    <ProfileDialogVue :profile="profile" />
    <UpdateSalary :dialog="updateSalary" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.bg-img {
    background-image: url("../assets/gym-4.jpg");
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

#add-button {
    width: 100%;
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