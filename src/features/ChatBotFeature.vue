<script setup lang="ts">
import BotChat from "@/components/BotChat.vue";
import {Ref, ref} from "vue";
import {webSocketBotAPI} from "@/API/WS-BOT-API";

type Message = {
  message?: string;
  photo?: Buffer
}

const props = defineProps<{
  botID: string
}>()

const messages: Ref<Message[]> = ref([])

webSocketBotAPI.$chatMessage.subscribe((data) => {
  if (data.id !== props.botID) return
  messages.value.push({
    message: data.message,
  })
})

webSocketBotAPI.$loadCaptcha.subscribe((data) => {
  if (data.id !== props.botID) return
  messages.value.push({
    photo: data.imageBuffer,
  })
})

function sendMessage(message: string) {
  webSocketBotAPI.sendChatMessage(props.botID, message)
}

</script>

<template>
  <BotChat
      @send-message="data => sendMessage(data)"
      :messages="messages"
  >
  </BotChat>
</template>

<style scoped>

</style>