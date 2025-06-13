<script setup lang="ts">
import BotWindow from '@/components/BotWindow.vue';
import { computed, ref, Ref, watch } from 'vue';
import { Item } from '../../env/types';
import { useLoadBot } from '@/proccess/useLoadBot';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';
import { useWindow } from '@/hook/useWindow';
import { useInventory } from '@/hook/useInventory';
import SlotBar from '@/components/SlotBar.vue';

const props = defineProps<{
	botID: string
}>()

const computedBotID = computed(()=> props.botID)
const { isLoad } = useLoadBot(computedBotID);
const {slots, dropItem} = useInventory(computedBotID)
</script>

<template>
	<BotWindow
		@drop-item="dropItem"
		:slots="slots"
		:skeleton="!isLoad"
	>
	</BotWindow>
</template>

<style scoped>

</style>