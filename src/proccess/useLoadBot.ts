import { useCurrentBotStore } from '@/store/currentBotStore';
import { useRoute, useRouter } from 'vue-router';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { IncomingGetBotInfoMessage, STATUS, toggleInfo } from '@/API/types';
import { onUnmounted, Ref, ref, watch } from 'vue';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { ToggleToToggleInfo } from '../../env/helpers/toggleToToggleInfo';
import { Subscribe } from '../../env/helpers/observable';

export const useLoadBotStore = () => {
	const route = useRoute();
	const router = useRouter();
	let botName = route.params.botName as string;
	const { onceConnect } = useBackendConnect();
	const currentBotStore = useCurrentBotStore();
	const isLoad = ref(false);
	const subscribes: Subscribe[] = [];

	let botInfoMessage: IncomingGetBotInfoMessage;

	async function load() {
		botInfoMessage = await webSocketBotAPI.getBotByName(botName);
		if (botInfoMessage.status !== STATUS.SUCCESS) return router.push('/');

		const botFunctionsMessage = await webSocketBotAPI.getFunctionsStatus(botInfoMessage.data.account.id);

		currentBotStore.setID(botInfoMessage.data.account.id);
		currentBotStore.setName(botName);
		currentBotStore.setBotState(botInfoMessage.data.account.status);
		currentBotStore.setBotServer(botInfoMessage.data.account.server);
		currentBotStore.setFunctions(botFunctionsMessage.data.functionsStatus);
		// currentBotStore.setExperience(botFunctionsMessage.data.experience);

		await webSocketBotAPI.subscribeEvents(botInfoMessage.data.account.id);

		isLoad.value = true;
	}

	watch(
		() => route.params.botName,
		(newValue: string) => {
			if (botInfoMessage) {
				webSocketBotAPI.unSubscribeEvents(botInfoMessage.data.account.id);
			}
			botName = newValue;
			load();
		},
	);

	webSocketBotAPI.$reconnect.subscribe(x => {
		if (!botInfoMessage) return;
		webSocketBotAPI.subscribeEvents(botInfoMessage.data.account.id);
	});

	if (!botName) {
		router.push('/');
		return { isLoad };
	}

	onceConnect(() => {
		load();

		subscribes.push(
			webSocketBotAPI.$eventBot.subscribe((event) => {
				if (event.state === 'SPAWN') return;
				if (event.id !== currentBotStore.id) return;
				currentBotStore.setBotState(event.state as any);
			}),
		);

		subscribes.push(
			webSocketBotAPI.$functionsEvent.subscribe((event) => {
				currentBotStore.setFunction(event.type, ToggleToToggleInfo(event.action));
			}),
		);
	});

	onUnmounted(() => {
		subscribes.forEach((subs) => subs.unsubscribe());
	});

	return { isLoad };
};

export const useLoadBot = (botID: Ref<string>) => {
	const { onceConnect } = useBackendConnect();
	const isLoad = ref(false);

	const store = useCurrentBotStore();
	const subscribes: Subscribe[] = [];

	const connectCallbacks: Function[] = [];
	const disconnectCallbacks: Function[] = [];
	const spawnCallbacks: Function[] = [];

	const onConnectBot = (callback: Function) => {
		if (store.state === 'CONNECT') {
			callback();
		}
		connectCallbacks.push(callback);
	};

	const onSpawnBot = (callback: Function) => {
		if (store.state === 'CONNECT') {
			callback();
		}
		spawnCallbacks.push(callback);
	};

	const onDisconnectBot = (callback: Function) => {
		disconnectCallbacks.push(callback);
	};

	const fetchBotData = async () => {
		if (store.state === 'CONNECT') {
			isLoad.value = true;
			connectCallbacks.forEach((callback) => callback());
			spawnCallbacks.forEach((callback) => callback());
		} else {
			isLoad.value = false;
		}
	};

	const handleEvent = (event: any) => {
		if (event.id !== botID.value) return;

		if (event.state === 'CONNECT') {
			isLoad.value = true;
			connectCallbacks.forEach((callback) => callback());
		}
		if (event.state === 'DISCONNECT') {
			isLoad.value = false;
			disconnectCallbacks.forEach((callback) => callback());
		}
		if (event.state === 'SPAWN') {
			spawnCallbacks.forEach((callback) => callback());
		}
	};

	onceConnect(() => {
		fetchBotData();

		subscribes.push(webSocketBotAPI.$eventBot.subscribe(handleEvent));
	});

	watch(botID, (newId) => {
		fetchBotData();
	});

	onUnmounted(() => {
		subscribes.forEach((subs) => subs.unsubscribe());
	});

	return { isLoad, onConnectBot, onDisconnectBot, onSpawnBot, idRef: botID };
};
