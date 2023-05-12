<script setup lang='ts'>

function checkCookies() {
    let accountType = localStorage.getItem("accountType")
    let accountId = localStorage.getItem("accountId")

    console.log(accountType)
    
    
    if (accountId == null || accountType == null) {
        window.location.href = './sign-in'
    } else {
        if (accountType == "member") {
            window.location.href = './member'

        } else if (accountType == "trainer") {
            window.location.href = './trainer'

        } else if (accountType == "admin") {
            window.location.href = './admin'

        } else if(accountType == 'manager'){
            window.location.href = './manager'

        }else if(accountType == 'staff'){
            window.location.href = './staff'
        }
    }
}

checkCookies()

</script>
<template></template>
<style scoped></style>