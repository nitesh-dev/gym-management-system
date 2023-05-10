
<script lang="ts">
export class Message {
    isHidden = true
    message = ""
    show(message: string) {
        this.message = message
        this.isHidden = false
    }
    hide() {
        this.isHidden = true
    }
}

</script>
<script setup lang='ts'>

defineProps<{
    message: Message
}>()

</script>
<template>
    <div id="message-model" v-if="!message.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Message</h5>
                </div>
                <div class="modal-body">
                    <p>{{ message.message }}</p>
                </div>
                <div class="modal-footer">

                    <button type="button" class="btn btn-primary" @click="message.hide()">Ok</button>
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

button {
    width: 80px;
}
</style>