<script setup lang="ts">

import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BotStatus } from '@/API/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { onUnmounted, ref, watch } from 'vue';
import { useBackendConnect } from '@/proccess/useBackendConnect';

const { onConnect } = useBackendConnect();
const props = defineProps<{
	botID: string,
}>();
const status = ref('');

const initToggle = async () => {
	status.value = (await webSocketBotAPI.getBot(props.botID)).data.account.status;
};

onConnect(initToggle);
watch(() => props.botID, initToggle);

const subscribe = webSocketBotAPI.$eventBot.subscribe((data) => {
	if (data.id !== props.botID) return;
	if (data.state === 'SPAWN') return;
	status.value = data.state as any;
});

function onTurn() {
	if (status.value === BotStatus.CONNECT) {
		webSocketBotAPI.turnOff(props.botID);
	}
	if (status.value == BotStatus.DISCONNECT) {
		webSocketBotAPI.turnOn(props.botID);
	}
}

onUnmounted(()=> subscribe.unsubscribe())

</script>

<template>
	<div>
		<button
			class="w-10 h-10"
			@click="onTurn"
			:class="{
            'connect': status === BotStatus.DISCONNECT,
            'disconnect': status === BotStatus.CONNECT,
          }"
		>
			<font-awesome-icon class="icon" :icon="['fas', 'power-off']" />
		</button>
	</div>
</template>

<style scoped>
.icon {
	@apply w-full h-full;
}

.connect {
	color: #2faa00;
}

.disconnect {
	color: #e80000;
}
</style>