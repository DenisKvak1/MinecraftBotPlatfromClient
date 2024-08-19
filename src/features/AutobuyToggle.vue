<script setup lang="ts">
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { computed, onUnmounted, Ref, ref, watch } from 'vue';
import { BotFunctions, toggleInfo } from '@/API/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { useLoadBot } from '@/proccess/useLoadBot';
import { Button } from '@/components/ui/button';
import { useCurrentBotStore } from '@/store/currentBotStore';

const currentBotStore = useCurrentBotStore();
const computedBotID = computed(()=> currentBotStore.id)
const {isLoad, onConnectBot, onDisconnectBot} = useLoadBot(computedBotID)

const {onceConnect, onConnect} = useBackendConnect()

const status: Ref<toggleInfo> = ref('OFF')


const initToggle = async () => {
	status.value = currentBotStore.functions.AUTO_BUY
}


onConnect(() => {
	onConnectBot(initToggle)
})
watch(()=> currentBotStore.id, initToggle)

const subscribe = webSocketBotAPI.$functionsEvent.subscribe((data) => {
	if (data.id !== computedBotID.value) return
	if (data.type !== BotFunctions.AUTO_BUY) return

	switch (data.action) {
		case "START":
			status.value = "ON"
			break
		case "STOP":
			status.value = "OFF"
			break
	}
})


onUnmounted(()=> subscribe.unsubscribe())

function toggleAB() {
	switch (status.value) {
		case "ON":
			webSocketBotAPI.turnOffAutoBuy(computedBotID.value)
			break
		case "OFF":
			webSocketBotAPI.turnOnAutoBuy(computedBotID.value)
			break
	}
}
</script>

<template>
	<Button
		@click="toggleAB"
		:class="{
      'on': status === 'OFF',
      'off': status === 'ON'
    }"
		class="h-[50px] w-[50px] p-3.5"
	>
		<font-awesome-icon :icon="['fas', 'cart-shopping']" />
	</Button>
</template>

<style scoped>
.icon {
	@apply w-full h-full;
}

.on {
	background: #2faa00;
}

.off {
	background: #e80000;
}
</style>