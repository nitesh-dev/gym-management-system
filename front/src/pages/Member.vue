<script setup lang='ts'>
import ProfileDialogVue, { ProfileData } from '../components/ProfileDialog.vue';
import MessageDialog, { Message } from '../components/MessageDialog.vue';
import ProgressDialog from '../components/ProgressDialog.vue';
import MembershipDialog, { MembershipData } from '../components/MembershipDialog.vue';
import { ref } from 'vue';
import Api from '../api';
import WarningDialogVue, { WarningData } from '../components/WarningDialog.vue';
import { Branch, Member, Membership } from '../RestApiDataType';
import { unixMillisecondsToDateString } from '../utils';


let activeTabIndex = ref(0)
let message = ref(new Message())
let isProgressHidden = ref(true)

let accountId = ref("")
let accountType = ref("")


function getCookies() {

    let type = localStorage.getItem("accountType")
    let id = localStorage.getItem("accountId")


    if (type == null || id == null || type != "member") {
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
        this.accountType = "member"
        this.profile.name = memberDetail.value.name
        this.profile.contact = memberDetail.value.contact
        this.profile.email = memberDetail.value.email
        this.profile.gender = memberDetail.value.gender
        this.profile.password = memberDetail.value.password
        this.profile.address = memberDetail.value.address
        this.profile.account_id = memberDetail.value.account_id
        this.profile.dob = memberDetail.value.dob
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


// Membership dialog
const membershipData = new (class extends MembershipData {
    show(): void {
        super.show()
    }

})

let membershipDialog = ref(membershipData)



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



const memberDetail = ref<Member>({
    account_id: "loading...",
    branch_id: "loading...",
    gender: 'male',
    name: "loading...", email: "loading...",
    password: "loading...", address: "loading...",
    contact: "loading...", dob: 0,
    is_approved: false
})

async function loadAccountDetail() {
    isProgressHidden.value = false
    const res = await Api.getMember(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {
        memberDetail.value = res.result as Member
        loadBranchDetail(memberDetail.value.branch_id)
    }
}



const activeMembership = ref(Array<Membership>())
const membershipHistory = ref(Array<Membership>())

async function loadMembership() {
    isProgressHidden.value = false
    const res = await Api.getMembership(accountId.value)
    isProgressHidden.value = true
    if (res.isError) {
        message.value.show(res.error)
    } else {

        // filtering
        let temp = res.result as Membership[]
        const currentDatetime = new Date().getTime()

        activeMembership.value = Array<Membership>()
        membershipHistory.value = Array<Membership>()
        temp.forEach(membership => {
            
            if(currentDatetime > membership.start_time && currentDatetime < membership.end_time){
                activeMembership.value.push(membership)
            }else{
                membershipHistory.value.push(membership)
            }
        });
    }
}


function fetchData() {
    console.log("fetching...")

    if (activeTabIndex.value == 0) {
        loadAccountDetail()

    } else if (activeTabIndex.value == 1) {
        loadMembership()
    }

}


function bookMembership(memberId: string){
    localStorage.setItem("bookingMemberId", memberId)
    window.location.href = './member/membership'
}


getCookies()

</script>

<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container-fluid" style="justify-content: left;">
            <div class="navbar-header">
                <a class="navbar-brand">GYM Manager</a>
            </div>

            <ul class="nav nav-pills mb-3" id="pills-tab">
                <li class="nav-item">
                    <button class="nav-link" :class="{ active: activeTabIndex == 0 }" @click="changeTab(0)">Info</button>
                </li>

                <li class="nav-item">
                    <button class="nav-link" :class="{ active: activeTabIndex == 1 }" @click="changeTab(1)">History</button>
                </li>
                <li v-if="memberDetail.is_approved"  class="nav-item" style="margin-left: 100px;" >
                    <button class="btn btn-success" @click="bookMembership(accountId)">Book Membership</button>
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

                    <!-- branch detail -->
                    <div class="col-sm">
                        <div class="card mb-4 card-parent">
                            <div class="card-body">
                                <h5>Branch Detail</h5>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Branch ID</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ branchDetail.branch_id }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Branch Name</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ branchDetail.name }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Email</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ branchDetail.email }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Contact</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ branchDetail.contact }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Address</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ branchDetail.address }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Member detail -->
                    <div class="col-sm">
                        <div class="card mb-4 card-parent">
                            <div class="card-body">
                                <h5>Member Detail</h5>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Account ID</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.account_id }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Branch ID</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.branch_id }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Full Name</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.name }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Email</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.email }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Contact</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.contact }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Gender</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.gender }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">DOB</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ unixMillisecondsToDateString(memberDetail.dob) }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Address</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p class="text-muted mb-0">{{ memberDetail.address }}</p>
                                    </div>
                                </div>

                                <div v-if="!memberDetail.is_approved" class="row">
                                    <div class="col-sm-3">
                                        <p class="mb-0">Status</p>
                                    </div>
                                    <div class="col-sm-9">
                                        <p style="color:white" class="btn btn-info">Pending</p>
                                    </div>
                                </div>

                                <button class="btn btn-primary" @click="profile.show()">Edit Profile</button>

                                <!-- <div class="row">
                <div class="col-sm-3">
                    <p class="mb-0">Membership</p>
                </div>
                <div class="col-sm-9">
                    
                    <p v-if="memberDetail.membership == 'bronze'">Bronze</p>
                    <p v-else-if="memberDetail.membership== 'silver'">Silver</p>
                    <p v-else-if="memberDetail.membership == 'gold'">Gold</p>
                    <button v-else-if="memberDetail.membership == 'free'" class="btn btn-primary">Book Membership</button>
                    <p v-else>{{ memberDetail.membership }}</p>
                </div>
            </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Membership history -->
        <div class="tab-pane fade" :class="{ show: activeTabIndex == 1, active: activeTabIndex == 1 }">

            <div class="table-container">
                <div class="container">
                    <h3>Membership History</h3>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Membership</th>
                                <th scope="col">Price</th>
                                <th scope="col">Start</th>
                                <th scope="col">End</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="membership, index in activeMembership">
                                <th scope="row">{{ index }}</th>
                                <td>{{ membership.type }}</td>
                                <td>{{ membership.price }}</td>
                                <td>{{ unixMillisecondsToDateString(membership.start_time) }}</td>
                                <td>{{ unixMillisecondsToDateString(membership.end_time)}}</td>
                                <td>Active</td>
                            </tr>
                            <tr v-for="membership, index in membershipHistory">
                                <th scope="row">{{ index + activeMembership.length }}</th>
                                <td>{{ membership.type }}</td>
                                <td>{{ membership.price }}</td>
                                <td>{{ unixMillisecondsToDateString(membership.start_time) }}</td>
                                <td>{{ unixMillisecondsToDateString(membership.end_time)}}</td>
                                <td>Done</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>

    <MembershipDialog :membership="membershipDialog" />
    <ProfileDialogVue :profile="profile" />
    <MessageDialog :message="message" />
    <WarningDialogVue :warning="warning" />
    <ProgressDialog v-if="!isProgressHidden" />
</template>
<style scoped>
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
}
</style>