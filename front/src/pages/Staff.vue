<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { Staff } from '../RestApiDataType';
import { unixMillisecondsToDateString } from '../utils';


let message = ref(new Message())
let isProgressHidden = ref(true)
let accountId = ref("")
let accountType = ref("")


function getCookies() {

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")


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



function logout() {
    localStorage.removeItem("accountType")
    localStorage.removeItem("accountId")
    window.location.href = '/'
}


function showProfile() {
    profile.value.show()
}



const staffDetail = ref<Staff>({
    account_id: "loading...",
    branch_id: "loading...",
    name: "loading...", email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0,
    work: 'security',
    gender: 'male'
})



async function loadAccountDetail() {
    isProgressHidden.value = false
    const res = await Api.getStaff(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        staffDetail.value = res.result as Staff
    }
}



function fetchData() {
    // fetch data
    console.log("fetching...")
    loadAccountDetail()
}



getCookies()

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

    <!-- account detail -->

    <div class="card mb-4 card-parent">
        <div class="card-body">
            <h5>Staff Detail</h5>
            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Account ID</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.account_id }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Branch ID</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.branch_id }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.name }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.email }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Contact</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.contact }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Gender</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.gender }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">DOB</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ unixMillisecondsToDateString(staffDetail.dob) }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Address</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.address }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Role</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ staffDetail.work }}</p>
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