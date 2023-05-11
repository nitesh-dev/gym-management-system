<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import CreateManagerDialog, { DialogManagerData } from '../components/CreateManagerDialog.vue';
import CreateBranchDialog, { DialogBranchData } from '../components/CreateBranchDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { Branch, Manager } from '../RestApiDataType';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref("")
let accountType = ref("")

getCookies()
function getCookies() {
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


let managerAccounts = ref(Array<Manager>())
async function loadManagerAccounts() {
    isProgressHidden.value = false
    let accounts = await Api.loadAllMangers()
    isProgressHidden.value = true
    if (accounts.isSuccess == true) {
        managerAccounts.value = accounts.result as Array<Manager>
    } else {
        message.value.show(accounts.error)
    }
}


let branchDetails = ref(Array<Branch>())
async function loadAllBranches() {
    isProgressHidden.value = false
    let res = await Api.loadAllBranches()
    isProgressHidden.value = true
    if (res.isSuccess == true) {
        branchDetails.value = res.result as Array<Branch>
    } else {
        message.value.show(res.error)
    }
}

function fetchData() {
    // fetch data
    console.log("fetching...")
    if (activeTabIndex.value == 0) {
        loadManagerAccounts()
    } else if (activeTabIndex.value == 1) {
        loadAllBranches()
    }
}


async function deleteData() {
    // fetch data
    console.log("deleting...")
    let tableName = null

    if (activeTabIndex.value == 0) {
        tableName = 'manager'
    } else if (activeTabIndex.value == 1) {
        tableName = 'branch'
    } 

    if(tableName == null) return

    isProgressHidden.value = false
    let result = await Api.deleteOperation(tableName, idToDelete)
    console.log(idToDelete)
    console.log(tableName)
    isProgressHidden.value = true
    if (result.isSuccess == true) {
        fetchData()
    } else {
        message.value.show(result.error)
    }
}


let idToDelete = ""
function deleteOperation(message: string, id: string){
    idToDelete = id
    warning.value.show(message)
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
                    <button id="add-button" class="btn btn-success btn-block" @click="managerDialog.show()">Add
                        Manager</button>
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
                            <tr v-for="manager, index in managerAccounts">
                                <th scope="row">{{ index }}</th>
                                <td>{{ manager.account_id }}</td>
                                <td>{{ manager.branch_id }}</td>
                                <td>{{ manager.name }}</td>
                                <td>{{ manager.email }}</td>
                                <td>{{ manager.address }}</td>
                                <td>{{ manager.contact }}</td>
                                <td>{{ manager.dob }}</td>

                                <td><button class="btn btn-danger" @click="deleteOperation('Do you really wants to delete? ' + manager.email, manager.account_id)"><i
                                            class="material-icons">delete</i>Delete</button></td>
                            </tr>
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
                    <button id="add-button" class="btn btn-success btn-block" @click="branchDialog.show()">Add
                        Branch</button>
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
                            <tr v-for="branch, index in branchDetails">
                                <th scope="row">{{ index }}</th>
                                <td>{{ branch.branch_id }}</td>
                                <td>{{ branch.name }}</td>
                                <td>{{ branch.email }}</td>
                                <td>{{ branch.address }}</td>
                                <td>{{ branch.contact }}</td>

                                <td><button class="btn btn-danger" @click="deleteOperation('Do you really wants to delete?', branch.branch_id)"><i
                                            class="material-icons">delete</i>Delete</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>


    <CreateBranchDialog :dialog="branchDialog" />
    <CreateManagerDialog :dialog="managerDialog" />
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