<template>
  <div class="home">
      <button class="enter-chat-btn" @click="enterChat">{{ loading ? 'Searching...'  : 'Enter the chat' }}</button>
  </div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent, inject, ref } from 'vue';
import router from './../router'

export default defineComponent({
  setup() {
    const socket: Socket | undefined = inject('socket')
    if (!socket) {
      throw new Error('Chat not working now')
    }

    const loading = ref(false)
    const enterChat = () => {
      if (loading.value) {
        return
      }
      loading.value = true
      socket.emit('findUserForChat', {test: 'test'})
    }

    socket.on("startChat", () => {
      router.push('/chat')
    });

    return { enterChat, loading }
  }
});
</script>

<style>
.enter-chat-btn {
  position: absolute;
  top: 40%;
  cursor: pointer;
  left: 45%;
  width: 200px;
}
</style>  
