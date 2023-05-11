<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { TrainingSession } from '../RestApiDataType';


let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref(0)
let accountType = ref("")

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




let detailAccountId = ref(0)
let detailBranchId = ref(0)
let detailFullName = ref("loading...")
let detailEmail = ref("loading...")
let detailContact = ref(0)
let detailGender = ref("loading...")
let detailDOB = ref(0)
let detailSpecialization = ref("loading...")

// async function loadAccountDetail() {
//     const res = await Api.getAccountDetail(accountId.value, accountType.value)
//     if (res.isSuccess) {
//         // detailAccountId.value = res.data.account_id
//         // detailFullName.value = res.data.name
//         // detailEmail.value = res.data.email
//         // detailContact.value = res.data.number
//         // detailGender.value = res.data.gender
//         // detailAge.value = res.data.age
//     }
// }




// let customerAccounts = ref(Array())
// async function loadCustomerAccounts(accountId: number) {
//     isProgressHidden.value = false
//     let accounts = await Api.getAllCustomerAccounts(accountId)
//     isProgressHidden.value = true
//     if (accounts.isSuccess == true) {
//         customerAccounts.value = accounts.data
//     } else {
//         message.value.show(accounts.error)
//     }
// }

const info = ref<TrainingSession[]>([])
async function fetchTrainingSession() {
    const random = () => {
        return {
            session_id: "asldjfklj",
            trainer_id: "545444sdf",
            member_id: "saldfjlkasjd",
            start_time: new Date().getMilliseconds(),
            end_time: new Date().getMilliseconds()
        } as TrainingSession
    }
    // fetch data
    console.log("fetching...")
    info.value = [
        random(), random(), random(), random(),
        random(), random(), random(), random(),
    ]


}
fetchTrainingSession()
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
            <h5>Customer Detail</h5>
            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Account ID</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailAccountId }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Branch ID</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailBranchId }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Full Name</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailFullName }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Email</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailEmail }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Contact</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailContact }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Gender</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailGender }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">DOB</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailDOB }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Address</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailDOB }}</p>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Specialization</p>
                </div>
                <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ detailSpecialization }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="table-container">
        <div class="container">
            <h3>Members</h3>
        </div>

        <div class="table-responsive">
            <table class="table table-hover table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">session id</th>
                        <th scope="col">trainer id</th>
                        <th scope="col">member id</th>
                        <th scope="col">start time</th>
                        <th scope="col">end_time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="value in info">
                        <th scope="row">{{ }}</th>
                        <td>{{ value.session_id }}</td>
                        <td>{{ value.trainer_id }}</td>
                        <td>{{ value.session_id }}</td>
                        <td>{{ value.start_time }}</td>
                        <td>{{ value.end_time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>




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