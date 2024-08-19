<script setup lang="ts">
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { computed, onUnmounted, Ref, ref, watch } from 'vue';
import { BotFunctions, toggleInfo } from '@/API/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { useLoadBot } from '@/proccess/useLoadBot';
import { Button } from '@/components/ui/button';
import { useCurrentBotStore } from '@/store/currentBotStore';

const currentBotStore = useCurrentBotStore();
const computedBotID = computed(() => currentBotStore.id);
const { isLoad, onConnectBot, onDisconnectBot } = useLoadBot(computedBotID);

const { onceConnect, onConnect } = useBackendConnect();

const farmStatus: Ref<toggleInfo> = ref('OFF');


const initToggle = async () => {
	farmStatus.value = currentBotStore.functions.AUTO_FARM;
};


onConnect(() => {
	onConnectBot(initToggle);
});
watch(() => currentBotStore.id, initToggle);

const subscribe = webSocketBotAPI.$functionsEvent.subscribe((data) => {
	if (data.id !== computedBotID.value) return;
	if (data.type !== BotFunctions.AUTO_FARM) return;

	switch (data.action) {
		case 'START':
			farmStatus.value = 'ON';
			break;
		case 'STOP':
			farmStatus.value = 'OFF';
			break;
	}
});
onUnmounted(()=>{
	subscribe.unsubscribe()
})
function toggleFarm() {
	switch (farmStatus.value) {
		case 'ON':
			webSocketBotAPI.turnOffFarm(computedBotID.value);
			break;
		case 'OFF':
			webSocketBotAPI.turnOnFarm(computedBotID.value);
			break;
	}
}
</script>

<template>
  <Button
      @click="toggleFarm"
			:class="{
      'on': farmStatus === 'OFF',
      'off': farmStatus === 'ON'
    }"
      class="h-[50px] w-[50px] p-3.5"
  >
    <font-awesome-icon class="icon" :icon="['fas', 'tractor']"/>
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