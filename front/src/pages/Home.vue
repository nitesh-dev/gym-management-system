<script setup lang='ts'>

function checkCookies() {
    let accountType = localStorage.getItem("accountType")
    let accountId = localStorage.getItem("accountId")

    if (accountId == null || accountType == null) {
        window.location.href = './sign-in'
    } else {
        if (accountType == "member") {
            window.location.href = './member'
        } else if (accountType == "trainer") {
            window.location.href = './trainer'
        } else if (accountType == "admin") {
            window.location.href = './admin'
        }
    }
}

checkCookies()

</script>
<template></template>
<style scoped></style>