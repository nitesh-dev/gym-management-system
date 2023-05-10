
<script lang="ts">
export class WarningData {
    isHidden = true
    message = ""
    show(message: string) {
        this.message = message
        this.isHidden = false
    }

    onOk(){}

    hide() {
        this.isHidden = true
    }
}

</script>
<script setup lang='ts'>

let prop = defineProps<{
    warning: WarningData
}>()

</script>
<template>
    <div id="message-model" v-if="!warning.isHidden" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Warning</h5>
                </div>
                <div class="modal-body">
                    <p>{{ warning.message }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="warning.hide()">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="warning.onOk()">Ok</button>
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