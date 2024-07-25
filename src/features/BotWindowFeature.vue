<script setup lang="ts">
import BotWindow from "@/components/BotWindow.vue";
import {ref, Ref} from "vue";
import {Item} from "../../env/types";
import {useLoadBot} from "@/proccess/useLoadBot";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import {STATUS} from "@/API/types";

const props = defineProps<{
  botID: string
}>()

const slots: Ref<Item[]> = ref([])
const {isLoad, onConnectBot, onDisconnectBot} = useLoadBot(props.botID)

onConnectBot(async () => {
  const response = await webSocketBotAPI.getCurrentWindow(props.botID)
  if (response.status !== STATUS.SUCCESS) return
  slots.value = response.data.slots
})

onDisconnectBot(()=>{
  slots.value = []
})

webSocketBotAPI.$window.subscribe((data) => {
  if (data.id !== props.botID) return
  if (data.action === "OPEN") {
    slots.value = data.items
  }
  if (data.action === "CLOSE") {
    slots.value = []
  }
})

function clickWindow(slotIndex: number){
  webSocketBotAPI.clickWindow(props.botID, slotIndex)
}

</script>

<template>
  <BotWindow
    @click-window="slotIndex => clickWindow(slotIndex)"
    :slots="slots"
    :skeleton="slots.length === 0"
  >
  </BotWindow>
</template>

<style scoped>

</style>