<template>
    <div id="chat-wrapper">
        <ul class="chat-thread" ref="chatWrapp">
            <li :class="[mess.from === socketId ? 'me' : 'you' ]" v-for="mess in messages" :key="mess.data">
                {{mess.data}}
            </li>
        </ul>
        <form class="chat-window" @submit="sendMessage">
            <input v-model="textMessage" class="chat-window-message" name="chat-window-message" type="text" autocomplete="off" autofocus />
        </form>
    </div>

</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent, inject, Ref, ref, onMounted } from 'vue';
import { Message } from './../types/ChatTypes'
import router from './../router'

export default defineComponent({
    setup() {
        const socket: Socket | undefined = inject('socket')

        if (!socket) {
            throw new Error('Chat not working now')
        }
        socket.emit('requestForMessages')
        const messages: Ref<Message[]> = ref([])
        socket.on('loadMessages', (loadMessages: Message[]) => {
            messages.value = loadMessages
            scrollDown()
        })
            
        const textMessage = ref("")
        const sendMessage = (e: Event) => {
            e.preventDefault()
            socket.emit('sendMessage', { text: textMessage.value })
            textMessage.value = ""
            socket.emit('requestForMessages')
        }
        socket.on('leaveChat', () => {
            router.push('/')
        })
        const socketId = socket.id
        const chatWrapp = ref() 

        const scrollDown = () => {
            const chatWrapp = document.querySelector('.chat-thread')
            if (chatWrapp) {
                chatWrapp.scrollTop = chatWrapp.scrollHeight
            }
        }
        
        return { messages, sendMessage, textMessage, socketId, chatWrapp, scrollDown }
    },
});
</script>
