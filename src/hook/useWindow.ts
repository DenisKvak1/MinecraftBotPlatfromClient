import { onUnmounted, ref, Ref, watch } from 'vue';
import { useLoadBot } from '@/proccess/useLoadBot';
import { Item } from '../../env/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';

export const useWindow = (botID: Ref<string>) => {
	const { isLoad, onConnectBot, onDisconnectBot } = useLoadBot(botID);
	const slots: Ref<Item[]> = ref([]);

	const initSlots = async () => {
		const response = await webSocketBotAPI.getCurrentWindow(botID.value);
		if (response.status !== STATUS.SUCCESS) return;
		if (response.botID !== botID.value) return;

		slots.value = response.data.slots;
	};

	onConnectBot(initSlots);
	watch(() => botID, async ()=>{
		slots.value = []
		await initSlots()
	});

	onDisconnectBot(() => {
		slots.value = [];
	});

	const subscribe = webSocketBotAPI.$window.subscribe((data) => {
		if (data.id !== botID.value) return;

		if (data.action === 'OPEN') {
			slots.value = data.items;
		}
		if (data.action === 'UPDATE') {
			data.items.forEach((item) => {
				slots.value[item.slot] = item;
			});
		}
		if (data.action === 'CLOSE') {
			slots.value = [];
		}
	});

	const clickWindow = (slotIndex: number, mouse: number = 0) => {
		webSocketBotAPI.clickWindow(botID.value, slotIndex, mouse);
	};

	onUnmounted(() => subscribe.unsubscribe());
	return { clickWindow, slots };
};