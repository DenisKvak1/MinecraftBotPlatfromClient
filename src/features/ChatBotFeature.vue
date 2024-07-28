<script setup lang="ts">
import BotChat from "@/components/BotChat.vue";
import { computed, Ref, ref, watch } from 'vue';
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import { useLoadBot } from '@/proccess/useLoadBot';

type Message = {
  message?: string;
  photo?: Buffer
}

const props = defineProps<{
	botID: string
}>()

const computedBotID = computed(()=> props.botID)
const {isLoad} = useLoadBot(computedBotID)


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

watch(()=> props.botID, ()=>{
	messages.value = []
})

function sendMessage(message: string) {
  webSocketBotAPI.sendChatMessage(props.botID, message)
}

</script>

<template>
  <BotChat
      @send-message="data => sendMessage(data)"
      :messages="messages"
			:skeleton="!isLoad"
  >
  </BotChat>
</template>

<style scoped>

</style>