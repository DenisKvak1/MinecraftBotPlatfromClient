<script setup lang="ts">
import BotWindow from '@/components/BotWindow.vue';
import { computed, ref, Ref, watch } from 'vue';
import { Item } from '../../env/types';
import { useLoadBot } from '@/proccess/useLoadBot';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';
import { useWindow } from '@/hook/useWindow';

const props = defineProps<{
	botID: string
}>()

const computedBotID = computed(()=> props.botID)
const {slots, clickWindow} = useWindow(computedBotID)

</script>

<template>
  <BotWindow
		@drop-item="(index)=>clickWindow(index, 1)"
    @click-window="(index)=> clickWindow(index, 0)"
    :slots="slots"
    :skeleton="slots.length === 0"
  >
  </BotWindow>
</template>

<style scoped>

</style>