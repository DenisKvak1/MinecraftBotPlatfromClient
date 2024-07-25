<script setup lang="ts">
import {useLoadBot} from "@/proccess/useLoadBot";
import BotWalkBlock from "@/components/BotWalkBlock.vue";
import {toggle} from "@/API/types";
import {webSocketBotAPI} from "@/API/WS-BOT-API";

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'CENTER'

const props = defineProps<{
  botID: string
}>()

function onAction(data: {action: toggle, direction: Direction}){
  const {action, direction} = data
  const id = props.botID
  switch (direction) {
    case "CENTER":
      if(action === "STOP") break
      webSocketBotAPI.jump(id)
      break
    case "DOWN":
      if(action === "START"){
        webSocketBotAPI.backwardStart(id)
      }
      if(action === "STOP"){
        webSocketBotAPI.backwardStop(id)
      }
      break
    case "UP":
      if(action === "START"){
        webSocketBotAPI.forwardStart(id)
      }
      if(action === "STOP"){
        webSocketBotAPI.forwardStop(id)
      }
      break
    case "LEFT":
      if(action === "START"){
        webSocketBotAPI.leftStart(id)
      }
      if(action === "STOP"){
        webSocketBotAPI.leftStop(id)
      }
      break
    case "RIGHT":
      if(action === "START"){
        webSocketBotAPI.rightStart(id)
      }
      if(action === "STOP"){
        webSocketBotAPI.rightStop(id)
      }
      break
  }
}
</script>

<template>
  <BotWalkBlock
    @action="data => onAction(data)"
  >
  </BotWalkBlock>
</template>

<style scoped>

</style>