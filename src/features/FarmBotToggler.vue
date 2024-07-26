<script setup lang="ts">
import {useBackendConnect} from "@/proccess/useBackendConnect";
import {Ref, ref} from "vue";
import {toggleInfo} from "@/API/types";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import {useLoadBot} from "@/proccess/useLoadBot";
import {Button} from "@/components/ui/button";

const props = defineProps<{
  botID: string,
}>()

const {onceConnect, onConnect} = useBackendConnect()
const {isLoad, onConnectBot} = useLoadBot(props.botID)

const status: Ref<toggleInfo> = ref('OFF')

onceConnect(() => {
  onConnectBot(async () => {
    status.value = (await webSocketBotAPI.getFarmState(props.botID)).data.status
  })
})

onConnect(async () => {
  status.value = (await webSocketBotAPI.getFarmState(props.botID)).data.status
})

webSocketBotAPI.$farm.subscribe((data) => {
  if (data.id !== props.botID) return

  switch (data.action) {
    case "START":
      status.value = "ON"
      break
    case "STOP":
      status.value = "OFF"
      break
  }
})

function toggleFarm() {
  switch (status.value) {
    case "ON":
      webSocketBotAPI.turnOffFarm(props.botID)
      break
    case "OFF":
      webSocketBotAPI.turnOnFarm(props.botID)
      break
  }
}
</script>

<template>
  <Button
      @click="toggleFarm"
      :class="{
      'on': status === 'OFF',
      'off': status === 'ON'
    }"
      class="h-[50px] w-[50px] p-3.5"
  >
    <font-awesome-icon class="icon" :icon="['fas', 'tractor']"/>
  </Button>
</template>

<style scoped>
.icon {
  @apply w-full h-full;
}

.on {
  background: #2faa00;
}

.off {
  background: #e80000;
}
</style>