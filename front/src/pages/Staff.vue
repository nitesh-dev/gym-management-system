<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { Branch, Staff } from '../RestApiDataType';
import { unixMillisecondsToDateString } from '../utils';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)
let accountId = ref("")
let accountType = ref("")
let isAdmin = ref(false)


function getCookies() {

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")

    if (window.location.pathname == "/admin/manager/staff" || window.location.pathname == "/manager/staff") {
        isAdmin.value = true
        id = localStorage.getItem("tempStaffId")
        type = "staff"
    } else {
        isAdmin.value = false
    }


    if (type == null || id == null || type != "staff") {
        window.location.href = '/'
    } else {
        accountId.value = id
        accountType.value = type
        fetchData()
    }
}




// profile dialog
const profileData = new (class extends ProfileData {

    show(): void {
        this.accountType = "staff"
        this.profile.name = staffDetail.value.name
        this.profile.contact = staffDetail.value.contact
        this.profile.email = staffDetail.value.email
        this.profile.gender = staffDetail.value.gender
        this.profile.password = staffDetail.value.password
        this.profile.address = staffDetail.value.address
        this.profile.account_id = staffDetail.value.account_id
        this.profile.dob = staffDetail.value.dob
        super.show()
    }

    onUpdateProfile(): void {
        super.onUpdateProfile()
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
    }

    show(message: string): void {
        super.show(message)
    }

})

let warning = ref(warningData)



function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}



function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
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

const staffDetail = ref<Staff>({
    account_id: "loading...",
    branch_id: "loading...",
    name: "loading...", email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0,
    work: 'security',
    gender: 'male', salary: 0
})

async function loadAccountDetail() {
    isProgressHidden.value = false
    const res = await Api.getStaff(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        staffDetail.value = res.result as Staff
        loadBranchDetail(staffDetail.value.branch_id)
    }
}



function fetchData() {
    console.log("fetching...")

    if (activeTabIndex.value == 0) {
        loadAccountDetail()

    } else if (activeTabIndex.value == 1) {
        // todo
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

                    <!-- <li class="nav-item">
                    <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">History</button>
                </li> -->
                </ul>

                <p class="profile-name">{{ staffDetail.name }}</p>
                <button v-if="!isAdmin" class="btn btn-danger" @click="logout">Log
                    out</button>
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

                        <!-- Staff detail -->
                        <div class="col-sm">
                            <div class="blur-div-parent card mb-4 card-parent">
                                <div class="blur-div"></div>
                                <div class="card-body">
                                    <h5>Staff Detail</h5>
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Account ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.account_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Branch ID</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.branch_id }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Full Name</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.name }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Email</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.email }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Contact</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.contact }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Gender</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.gender }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">DOB</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ unixMillisecondsToDateString(staffDetail.dob) }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Address</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">{{ staffDetail.address }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-3">
                                            <p class="mb-0">Salary</p>
                                        </div>
                                        <div class="col-sm-9">
                                            <p class="mb-0">₹{{ staffDetail.salary }}</p>
                                        </div>
                                    </div>

                                    <button class="btn btn-primary" @click="profile.show()">Edit Profile</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 
    <div class="table-container">
        <div class="container">
            <h3>Members</h3>
        </div>

        <div class="table-responsive">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Branch ID</th>
                        <th scope="col">Trainer ID</th>
                        <th scope="col">Member ID</th>
                        <th scope="col">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="plan, index in vehiclePlan">
                                <th scope="row">{{ index }}</th>
                                <td>{{ plan.vehicle_id }}</td>
                                <td>{{ plan.name }}</td>
                                <td>{{ plan.rate }}</td>
                                <td>{{ plan.seats }}</td>
                                <td><button @click="vehicle.edit(plan.vehicle_id, plan.name, plan.rate, plan.seats)" class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr>
                </tbody>
            </table>
        </div>
    </div> -->




    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
.bg-img {
    background-image: url("../assets/gym-2.jpg");
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
}</style>