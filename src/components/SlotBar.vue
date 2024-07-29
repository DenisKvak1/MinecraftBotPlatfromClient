<script setup lang="ts">
import { BackendURL } from '../../env/config';
import { Item } from '../../env/types';
import { ref } from 'vue';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TableCell } from '@/components/ui/table';

const props = defineProps<{
	slots: Item[],
	selectedSlot?: number,
	skeleton?: boolean
}>();

let selecedtSlot = ref(props.selectedSlot);

const emit = defineEmits<{
	(e: 'activateItem', slotIndex: number): void,
	(e: 'dropItem', slotIndex: number): void;
}>();

function activateItem(index: number, slot: Item) {
	if (!slot) return;

	selecedtSlot.value = index;
	emit('activateItem', index);
}

function dropItem(index: number, slot: Item) {
	if (!slot) return;

	selecedtSlot.value = 0;
	emit('dropItem', index);
}

</script>

<template>
	<div class="flex">
		<TooltipProvider v-if="!props?.skeleton" v-for="(slot, index) in props.slots">
			<Tooltip>
				<TooltipTrigger as-child>
					<button
						:class="{
          'cursor-default': !Boolean(slot),
          'selected': selecedtSlot === index
        }"
						class="slot"
						@click="activateItem(index, slot)"
						@contextmenu.prevent="dropItem(index, slot)"
					>
						<img v-if="slot" :src="`http://${BackendURL}/minecraftTextures/${slot.name}.png`" :alt="slot.name">
					</button>
				</TooltipTrigger>
				<TooltipContent class="bg-gray-700" v-if="slot?.customLore || slot?.customName">
					<span v-if="!slot.customName && !slot.customLore"> {{ slot.displayName }}</span>
					<span v-html="slot.customName"></span>
					<br>
					<span v-html="slot.customLore"></span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
		<Skeleton v-else class="slot rounded-none"
							v-if="props.skeleton"
							v-for="index in 9"
		></Skeleton>
	</div>
</template>


<style scoped>
.slot {
	@apply w-[40px] h-[40px] border-t border-l border-b last:border-r p-1;
	@apply sm:w-[50px] sm:h-[50px];
	@apply lg:border-t-2 lg:border-b-2 lg:border-l-2 last:lg:border-r-2;
	@apply xl:w-[60px] xl:h-[60px];

	img {
		@apply w-full m-auto;
	}
}

.selected {
	@apply outline rounded outline-gray-300;
}
</style>