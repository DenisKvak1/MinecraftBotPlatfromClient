<script setup lang="ts">
import BotElement from '@/components/BotElement.vue';
import BotElementSkeleton from '@/view/BotElementSkeleton.vue';
import { BotInfo } from '../../env/types';
import CreateBotFeature from '@/features/CreateBotFeature.vue';
import UpdateBotFeature from '@/components/UpdateBotFeature.vue';
import { ref } from 'vue';

const props = defineProps<{
	bots: BotInfo[],
	skeleton?: boolean
}>();

const emit = defineEmits<{
	(e: 'turn', data: { id: string, action: 'CONNECT' | 'DISCONNECT' }): void,
	(e: 'delete', data: { id: string, nickname: string }): void,
	(e: 'select', data: { id: string, nickname: string }): void,
	(e: 'update', data: BotInfo)
	(e: 'create')
}>();



</script>

<template>
	<div class="flex gap-4 flex-wrap">
		<BotElement
			v-if="!skeleton"
			v-for="bot in props.bots"
			@update="emit('update', bot)"
			@click="emit('select', {nickname: bot.nickname, id: bot.id})"
			@turn="(action)=> emit('turn', {id: bot.id, action})"
			@delete="() => emit('delete', {nickname: bot.nickname, id: bot.id})"
			:bot-info="bot"
		></BotElement>
		<CreateBotFeature
			@submit="emit('create')"
		>
			<button class="element flex items-center justify-center bg-gray-100">
				<div class="font-bold text-6xl lg:text-8xl">
					<font-awesome-icon :icon="['fas', 'plus']" />
				</div>
			</button>
		</CreateBotFeature>
		<BotElementSkeleton v-if="skeleton" v-for="key in 10"></BotElementSkeleton>
	</div>
</template>

<style scoped>
.element {
	@apply w-44 h-44 border shadow-md rounded-2xl p-4 flex flex-col items-center cursor-pointer;
	@apply 2xl:w-60 2xl:h-60 2xl:p-6;
}

.nickname {
	@apply font-medium text-xl;
	@apply 2xl:text-[25px];
}

.info {
	@apply mt-2 self-start flex flex-col;
	@apply 2xl:mt-3 text-xl;
}

.connectMenu {
	@apply mt-auto flex justify-between w-full;
	@apply 2xl:justify-between 2xl:items-center 2xl:text-xl
}

.connectButton {
	@apply w-7 h-7;
	@apply 2xl:w-10 2xl:h-10;
}

.icon {
	@apply w-full h-full;
}
</style>