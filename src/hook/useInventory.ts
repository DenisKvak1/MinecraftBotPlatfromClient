import { onUnmounted, ref, Ref, watch } from 'vue';
import { useLoadBot } from '@/proccess/useLoadBot';
import { Item } from '../../env/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';

export const useInventory = (botID: Ref<string>) => {
	const { onSpawnBot, onDisconnectBot } = useLoadBot(botID);
	const slots: Ref<Item[]> = ref([
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
	]);

	const initSlots = async () => {
		const response = await webSocketBotAPI.getInventorySlots(botID.value);
		if (response.status !== STATUS.SUCCESS) return;
		if (response.botID !== botID.value) return;
		slots.value = response.data.slots.slice(0, 36)
	};
	onSpawnBot(initSlots);
	watch(() => botID.value, initSlots);

	onDisconnectBot(() => {
		slots.value = [];
	});

	const subscribe = webSocketBotAPI.$inventoryUpdate.subscribe((data) => {
		if (data.index > 35 && data.index <= 44) return;
		if (data.id !== botID.value) return;

		const hotBarIndex = data.index;
		slots.value[hotBarIndex] = data.item;
	});

	const dropItem = (slotIndex: number) => {
		webSocketBotAPI.dropSlot(botID.value, slotIndex);
	};

	onUnmounted(()=> subscribe.unsubscribe());

	return { slots, dropItem };
}