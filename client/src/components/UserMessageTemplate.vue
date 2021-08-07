<template>
    <div class="user-message-wrapper" :data-user-id="message.user_id">
        <div class="user-image-wrapper">
            <div :style="{'background-image': 'url(' + message.user_img + ')'}"></div>
        </div>
        <div class="user-message-content">
            <div class="message-info">
                <span class="user-name">{{ message.user_name }}</span>
                <span class="timestamp">{{ message.timestamp }}</span>
            </div>
            <div class="user-messages">
                <span v-for="user_message in message.user_messages" :key="user_message">{{ user_message }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserMessageTemplate',
    props: ['message'],
}
</script>

<style>

</style>