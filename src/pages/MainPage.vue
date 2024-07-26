<script setup lang="ts">

import {onMounted, Ref, ref} from "vue";
import {useBackendConnect} from "@/proccess/useBackendConnect";
import LostConnection from "@/components/LostConnection.vue";
import {useDelay} from "@/hook/useDelay";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import BotsList from "@/components/BotsList.vue";
import {BotInfo} from "../../env/types";
import {useRouter} from "vue-router";
import CreateBotFeature from "@/features/CreateBotFeature.vue";

const id = '18839b9b-5d21-4793-b175-3790dd7302ef'
const {isConnect, isNotConnect, reconnect, onConnect} = useBackendConnect()
const {isValue: isLazyNotConnect} = useDelay(isNotConnect, false)
const router = useRouter()

// const slots = ref([])
// const selectSlot = ref(0)
// onMounted(()=>{
//   webSocketBotAPI.$ready.once(async ()=>{
//     const inventory = (await webSocketBotAPI.getInventorySlots(id)).data
//     selectSlot.value = inventory.selectedSlot
//     slots.value = inventory.slots.filter((item, index)=> index >=36 && index<=44 )
//   }, (ready)=> ready)
// })
// webSocketBotAPI.$inventoryUpdate.subscribe((data)=>{
//   const hotBarIndex = data.index - 36
//   slots.value[hotBarIndex] = data.item
// })
// webSocketBotAPI.$chatMessage.subscribe((msg)=>{
//   console.log(msg.message)
// })
let botsInfo: Ref<BotInfo[]> = ref([])
onMounted(() => {
  onConnect(async () => {
    const data = await webSocketBotAPI.getAllBots()
    botsInfo.value = data.data.accounts
  })

  webSocketBotAPI.$eventBot.subscribe((data) => {
    if (data.state === "SPAWN") return
    const index = botsInfo.value.findIndex((info) => info.id === data.id)
    botsInfo.value[index].status = data.state as any
  })
})

</script>

<template>
  <div>
    <CreateBotFeature></CreateBotFeature>
    <BotsList
        @turn="async (data) => {
        const {action, id} = data;
        if(action === 'CONNECT') {
          console.log(await webSocketBotAPI.turnOn(id))
        }
        if(action === 'DISCONNECT') {
          console.log(await webSocketBotAPI.turnOff(id))
        }
      }"
        @select="nickname => router.push(`/${nickname}`)"
        :skeleton="isLazyNotConnect" :bots="botsInfo"></BotsList>
    <LostConnection
        :open="isLazyNotConnect"
        @reconnect="reconnect"
    ></LostConnection>
  </div>
</template>

<style scoped>

</style>