<script setup lang="ts">
import { useCurrentBotStore } from '@/store/currentBotStore';
import { useLoadBotStore } from '@/proccess/useLoadBot';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { useDelay } from '@/hook/useDelay';
import LostConnection from '@/components/LostConnection.vue';
import ConnectBotSwitcher from '@/features/ConnectBotSwitcher.vue';
import HotbarFeature from '@/features/HotbarFeature.vue';
import BotWindowFeature from '@/features/BotWindowFeature.vue';
import ChatBotFeature from '@/features/ChatBotFeature.vue';
import BotWalkFeature from '@/features/BotWalkFeature.vue';
import BotHeadFeature from '@/features/BotHeadFeature.vue';
import FarmBotToggler from '@/features/FarmBotToggler.vue';
import BotSwitcher from '@/features/BotSwitcher.vue';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/components/ui/tabs';
import AutobuyToggle from '@/features/AutobuyToggle.vue';
import BotInventoryFeature from '@/features/BotInventoryFeature.vue';
import DropAllFeature from '@/features/DropAllFeature.vue';

const { isLoad } = useLoadBotStore();
const currentBotStore = useCurrentBotStore();

const { isNotConnect, reconnect } = useBackendConnect();
const { isValue: isLazyNotConnect } = useDelay(isNotConnect, false);


</script>

<template>
	<div>
		<div v-if="isLoad" class="p-1.5 container">
			<header class="flex justify-between mt-3">
				<ConnectBotSwitcher :bot-i-d="currentBotStore.id"></ConnectBotSwitcher>
				<BotSwitcher :bot-i-d="currentBotStore.id"></BotSwitcher>
			</header>
			<div class="myContainer">
				<BotHeadFeature class="headMove" :bot-i-d="currentBotStore.id"></BotHeadFeature>
				<BotWalkFeature class="playerMove" :bot-i-d="currentBotStore.id"></BotWalkFeature>
				<div class="flex flex-col gap-4">
					<FarmBotToggler class="farmToggler" :bot-i-d="currentBotStore.id"></FarmBotToggler>
					<DropAllFeature  :bot-i-d="currentBotStore.id"></DropAllFeature>
				</div>
				<AutobuyToggle class="AB" :bot-i-d="currentBotStore.id"></AutobuyToggle>

				<Tabs default-value="window" class="bot-window">
					<TabsList class="grid w-full grid-cols-2">
						<TabsTrigger value="window">
							Текущие окно
						</TabsTrigger>
						<TabsTrigger value="inventory">
							Инвентарь
						</TabsTrigger>
					</TabsList>
					<TabsContent value="window">
						<BotWindowFeature
							:bot-i-d="currentBotStore.id"
						>
						</BotWindowFeature>

					</TabsContent>
					<TabsContent value="inventory">
						<BotInventoryFeature
							:bot-i-d="currentBotStore.id"
						></BotInventoryFeature>
					</TabsContent>
				</Tabs>
				<ChatBotFeature
					:bot-i-d="currentBotStore.id"
					class="bot-chat w-full sm:w-[360px]"
				></ChatBotFeature>
				<HotbarFeature
					class="slot-bar"
					:bot-i-d="currentBotStore.id"
				></HotbarFeature>
			</div>
		</div>
		<LostConnection
			:open="isLazyNotConnect"
			@reconnect="reconnect"
		></LostConnection>
	</div>
</template>

<style scoped>
.myContainer {
	display: grid;
	grid-template-rows: repeat(6, auto);
	grid-template-columns: repeat(2, auto);
	justify-items: center;
	row-gap: 10px;
	margin-top: 30px;
}

.bot-window {
	grid-row: 2;
	grid-column: 1 / span 2;
}

.slot-bar {
	grid-row: 3;
	grid-column: 1 / span 2;
}

.bot-chat {
	grid-row: 1;
	grid-column: 1 / span 2;
}

.headMove {
	justify-self: start;
}
.playerMove {
	justify-self: end;
}
.farmToggler {
	grid-row: 5;
	margin-top: 20px;
	justify-self: start;
}
@media (min-width: 1024px) {
	.myContainer {
		margin-top: 100px;
		grid-template-rows: repeat(2, auto);
		grid-template-columns: repeat(5, auto);
		justify-items: initial;
	}

	.bot-window {
		grid-row: initial;
		grid-column: 3;
		align-self: end;
		justify-self: center;
	}

	.slot-bar {
		grid-row: initial;
		grid-column: 3;
		justify-self: center;
	}

	.headMove {
		align-self: center;
		grid-column: 2;
		grid-row: 1 / span 2;
		justify-self: center;
	}

	.playerMove{
		align-self: center;
		grid-column: 4;
		grid-row: 1 / span 2;
		justify-self: center;
	}

	.bot-chat {
		grid-column: 5;
		grid-row: 1 / span 2;
	}

	.farmToggler{
		grid-column: 1;
		grid-row: 1;
		margin-top: 60px;
	}

	.AB {
		grid-column: 1;
		grid-row: 2;
	}
}
</style>

