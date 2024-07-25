<script setup lang="ts">
import BotElement from "@/components/BotElement.vue";
import { BotInfo } from "env/types";
import BotElementSkeleton from "@/view/BotElementSkeleton.vue";

const props = defineProps<{
  bots: BotInfo[],
  skeleton?: boolean
}>()
const emit = defineEmits<{
  (e: 'turn', data: {id: string, action: 'CONNECT' | 'DISCONNECT'}): void,
  (e: 'delete', id: string): void,
  (e: 'select', nickname: string): void,
}>()
</script>

<template>
<div class="flex gap-4 flex-wrap">
  <BotElement
      v-if="!skeleton"
      v-for="bot in props.bots"
      @click="emit('select', bot.nickname)"
      @turn="(action)=> emit('turn', {id: bot.id, action})"
      @delete="() => emit('delete', bot.id)"
      :bot-info="bot"
  ></BotElement>
  <BotElementSkeleton v-else v-for="key in 10"></BotElementSkeleton>
</div>
</template>

<style scoped>

</style>