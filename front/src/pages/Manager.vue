<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import CreateTrainerDialog, { DialogTrainerData } from '../components/CreateTrainerDialog.vue';
import { Trainer, Manager } from '../RestApiDataType';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)
let isAdmin = ref(true)


let accountId = ref("")
let accountType = ref("")

getCookies()
function getCookies() {

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")

    if (window.location.pathname == "/admin/manager") {
        isAdmin.value = true
        id = localStorage.getItem("tempId")
        type = "manager"
    } else {
        isAdmin.value = false
    }


    if (type == null || id == null) {
        window.location.href = '/'
    } else {
        accountId.value = id
        accountType.value = type
        fetchData()
    }

}



// profile dialog
const profileData = new (class extends ProfileData {
    show() {
        isProgressHidden.value = false
        super.show()
    }
    hide(): void {
        super.hide()
        isProgressHidden.value = true
    }

    hideProgress(): void {
        isProgressHidden.value = true
    }

    showProgress(): void {
        isProgressHidden.value = false
    }

    showMessage(text: string): void {
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















function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}


function showProfile() {
    profile.value.show()
}



let managerDetail = ref<Manager>({
    account_id: "loading...",
    branch_id: "loading...",
    name: "loading...", email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0
})

async function loadManagerDetail(){

    alert(accountType.value)
   
    let account= await Api.getAccountDetail(accountId.value, accountType.value)
    if (account.isSuccess == true) {
        managerDetail.value = account.data as Manager
    } else {
        message.value.show(account.error)
    }
}








let trainerAccounts = ref(Array<Trainer>())

async function loadTrainerAccounts(accountId: string) {
    isProgressHidden.value = false
    let accounts = await Api.loadBranchAllTrainer(accountId)
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        trainerAccounts.value = accounts.result as Array<Trainer>
    } else {
        message.value.show(accounts.error)
    }
}

function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadManagerDetail()
        loadTrainerAccounts(accountId.value)

    } else if (activeTabIndex.value == 1) {
        // loadCustomerAccounts(accountId.value)
    }
}

</script>
<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand">GYM Manager</a>
            </div>
            <button class="btn btn-primary" @click="showProfile">Profile</button>
            <button class="btn btn-danger" @click="logout">Log out</button>
        </div>
    </nav>

    <div class="container">
        <ul class="nav nav-pills mb-3" id="pills-tab">
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 0 }" @click="changeTab(0)">Trainers</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">Staffs</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 2 }" @click="changeTab(2)">Members</button>
            </li>
        </ul>
    </div>
    <div class="tab-content" id="pills-tabContent">

        <!-- account detail -->
        <div class="card mb-4 card-parent">
            <div class="card-body">
                <h5>Manager Detail</h5>
                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Account ID</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.account_id }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Branch ID</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.branch_id }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Full Name</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.name }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Email</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.email }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Contact</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.contact }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Gender</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">TODO</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">DOB</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.dob }}</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <p class="mb-0">Address</p>
                    </div>
                    <div class="col-sm-9">
                        <p class="text-muted mb-0">{{ managerDetail.address }}</p>
                    </div>
                </div>

            </div>
        </div>

        <!-- Trainers -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">

            <div class="table-container">
                <div class="container">
                    <h3>Trainers</h3>
                    <button v-if="!isAdmin" id="add-button" class="btn btn-success btn-block"
                        @click="trainerDialog.show()">Add Trainers</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Account ID</th>
                                <th scope="col">Branch ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col">Contact</th>
                                <th scope="col">DOB</th>
                                <th scope="col">Specialization</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="trainer, index in trainerAccounts">
                                <th scope="row">{{ index }}</th>
                                <td>{{ trainer.account_id }}</td>
                                <td>{{ trainer.branch_id }}</td>
                                <td>{{ trainer.name }}</td>
                                <td>{{ trainer.email }}</td>
                                <td>{{ trainer.address }}</td>
                                <td>{{ trainer.dob }}</td>
                                <td>{{ trainer.specialization }}</td>

                                <td><button class="btn btn-danger" @click=""><i
                                            class="material-icons">delete</i>Delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <!-- Staffs -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">

            <div class="table-container">
                <div class="container">
                    <h3>Staffs</h3>
                    <button v-if="!isAdmin" id="add-button" class="btn btn-success btn-block" @click="">Add Staff</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Account ID</th>
                                <th scope="col">Branch ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col">Contact</th>
                                <th scope="col">DOB</th>
                                <th scope="col">Work</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="plan, index in vehiclePlan">
                    <th scope="row">{{ index }}</th>
                    <td>{{ plan.vehicle_id }}</td>
                    <td>{{ plan.name }}</td>
                    <td>{{ plan.rate }}</td>
                    <td>{{ plan.seats }}</td>
                    <td><button @click="vehicle.edit(plan.vehicle_id, plan.name, plan.rate, plan.seats)" class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
                    <td><button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</button></td>
                </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <!-- Members -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 2, active: activeTabIndex == 2 }">

            <div class="table-container">
                <div class="container">
                    <h3>Members</h3>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Account ID</th>
                                <th scope="col">Branch ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col">Contact</th>
                                <th scope="col">DOB</th>
                                <th scope="col">Membership</th>
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- <tr v-for="plan, index in vehiclePlan">
        <th scope="row">{{ index }}</th>
        <td>{{ plan.vehicle_id }}</td>
        <td>{{ plan.name }}</td>
        <td>{{ plan.rate }}</td>
        <td>{{ plan.seats }}</td>
        <td><button @click="vehicle.edit(plan.vehicle_id, plan.name, plan.rate, plan.seats)" class="btn btn-primary"><i class="material-icons">edit</i>Edit</button></td>
        <td><button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</button></td>
    </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>


    <CreateTrainerDialog :dialog="trainerDialog" :branch-id="accountId" />
    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
#pills-tab {
    margin-top: 30px;
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
}
</style>