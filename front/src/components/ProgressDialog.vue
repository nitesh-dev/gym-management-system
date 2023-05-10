<script setup lang='ts'>
import { ref } from 'vue';
</script>
<template>
    <div id="message-model" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="cus-loader"></div>
                    <p>Please wait</p>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
#message-model {
    display: block;
    background-color: rgba(0, 0, 0, 0.116);
}

.modal-body {
    display: grid;
    text-align: center;
    justify-content: center;
    align-items: center;
}



.cus-loader {
    border: 6px solid #e9e9e9;
    border-radius: 50%;
    border-top: 6px solid #3498db;
    width: 50px;
    height: 50px;
    margin: 24px auto;
    -webkit-animation: spin 0.7s linear infinite;
    /* Safari */
    animation: spin 0.7s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>