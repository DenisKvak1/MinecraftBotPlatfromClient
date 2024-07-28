<script setup lang="ts">
import BotElement from "@/components/BotElement.vue";
import BotElementSkeleton from "@/view/BotElementSkeleton.vue";
import {BotInfo} from "../../env/types";

const props = defineProps<{
  bots: BotInfo[],
  skeleton?: boolean
}>()
const emit = defineEmits<{
  (e: 'turn', data: {id: string, action: 'CONNECT' | 'DISCONNECT'}): void,
  (e: 'delete', data: {id: string, nickname: string}): void,
  (e: 'select', data: {id: string, nickname: string}): void,
}>()
</script>

<template>
<div class="flex gap-4 flex-wrap">
  <BotElement
      v-if="!skeleton"
      v-for="bot in props.bots"
      @click="emit('select', {nickname: bot.nickname, id: bot.id})"
      @turn="(action)=> emit('turn', {id: bot.id, action})"
      @delete="() => emit('delete', {nickname: bot.nickname, id: bot.id})"
      :bot-info="bot"
  ></BotElement>
  <BotElementSkeleton v-else v-for="key in 10"></BotElementSkeleton>
</div>
</template>

<style scoped>

</style>