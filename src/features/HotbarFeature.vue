<script setup lang="ts">
import SlotBar from '@/components/SlotBar.vue';
import { computed, Ref, ref, watch } from 'vue';
import { Item } from '../../env/types';
import { useLoadBot } from '@/proccess/useLoadBot';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';
import { useHotbar } from '@/hook/useHotbar';
import ExpProgressBarFeature from '@/features/ExpProgressBarFeature.vue';

const props = defineProps<{
	botID: string
}>();

const computedBotID = computed(() => props.botID);
const { isLoad } = useLoadBot(computedBotID);
const { slots, activateItem, dropItem } = useHotbar(computedBotID);

</script>

<template>
	<div class="flex flex-col">
		<slot-bar
			@activate-item="slotIndex => activateItem(slotIndex)"
			@drop-item="slotIndex => dropItem(slotIndex)"
			:slots="slots"
			:skeleton="!isLoad"
		>
		</slot-bar>
		<ExpProgressBarFeature
			class="self-center"
			:bot-i-d="props.botID"
		></ExpProgressBarFeature>
	</div>
</template>

<style scoped>

</style>