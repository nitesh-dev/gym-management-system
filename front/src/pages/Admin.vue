<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref(0)
// let accountType = ref("")

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


function changeTab(index: number) {
    activeTabIndex.value = index
    fetchData()
}


function showProfile() {
    profile.value.show()
}


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

function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        // loadVehiclePlans()
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
                <button class="nav-link" :class="{ active: activeTabIndex == 0 }" @click="changeTab(0)">Managers</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">Branches</button>
            </li>
        </ul>
    </div>
    <div class="tab-content" id="pills-tabContent">

        <!-- Managers -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 0, active: activeTabIndex == 0 }">

            <div class="table-container">
                <div class="container">
                    <h3>Managers</h3>
                    <button id="add-button" class="btn btn-success btn-block" @click="">Add Manager</button>
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
                                <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</Button></td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <!-- Branch -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">

            <div class="table-container">
                <div class="container">
                    <h3>Branch</h3>
                    <button id="add-button" class="btn btn-success btn-block" @click="">Add Branch</button>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Branch ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col">Contact</th>
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
                    <td><Button class="btn btn-danger" @click="deleteOperation('Do you really want to delete?', plan.vehicle_id)"><i class="material-icons">delete</i>Delete</Button></td>
                </tr> -->
                        </tbody>
                    </table>
                </div>
            </div>
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