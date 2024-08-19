<script setup lang="ts">
import BotChat from "@/components/BotChat.vue";
import { computed, onUnmounted, Ref, ref, watch } from 'vue';
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import { useLoadBot } from '@/proccess/useLoadBot';
import { Subscribe } from '../../env/helpers/observable';

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
const subscribes:Subscribe[] = []


subscribes.push(webSocketBotAPI.$chatMessage.subscribe((data) => {
	if (data.id !== props.botID) return
	messages.value.push({
		message: data.message,
	})
}))

subscribes.push(webSocketBotAPI.$loadCaptcha.subscribe((data) => {
	if (data.id !== props.botID) return
	messages.value.push({
		photo: data.imageBuffer,
	})
}))

watch(()=> props.botID, ()=>{
	messages.value = []
})

function sendMessage(message: string) {
  webSocketBotAPI.sendChatMessage(props.botID, message)
}

onUnmounted(()=>{
	subscribes.forEach((subscribe:Subscribe) => {
		subscribe.unsubscribe()
	})
})
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