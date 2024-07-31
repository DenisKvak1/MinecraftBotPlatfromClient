<script setup lang="ts">
import { computed } from 'vue';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { BackendURL } from '../../env/config';
import { Item } from '../../env/types';
import { Skeleton } from '@/components/ui/skeleton';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip'

const props = defineProps<{
	slots: Item[],
	skeleton?: boolean
}>();
const emit = defineEmits<{
	(e: 'clickWindow', slotIndex: number): void
}>();

const row = computed(() => Math.ceil(props.slots.length / 9));

function getRow(indexRow: number) {
	const startIndex = indexRow * 9;
	const endIndex = startIndex + 9;

	return props.slots.slice(startIndex, endIndex);
}

const rows = computed(() => {
	return Array.from({ length: row.value }, (_, indexRow) => getRow(indexRow));
});

function clickWindow(colIndex: number, rowIndex: number, slot) {
	if (!slot) return;
	const index = (9 * colIndex) + rowIndex;
	emit('clickWindow', index);
}

</script>

<template>
	<div>
		<Table class="w-auto">
			<TableBody v-if="!props?.skeleton">
				<TableRow v-for="(slots, colIndex) in rows" :key="colIndex">
					<TooltipProvider v-for="(slot, rowIndex) in slots">
						<Tooltip>
							<TooltipTrigger as-child>
								<TableCell
									class="slot"
									:class="{
                'cursor-pointer': slot
              }"
									@click="clickWindow(colIndex, rowIndex, slot)"
								>
									<div>
										<img v-if="slot" :src="`http://${BackendURL}/minecraftTextures/${slot.name}.png`">
										<span v-if="slot && slot?.count !== 1" class="count">{{ slot.count }}</span>
									</div>

								</TableCell>
							</TooltipTrigger>
							<TooltipContent class="bg-gray-700" v-if="slot?.customLoreHTML || slot?.customNameHTML">
								<span v-if="!slot.customNameHTML"  class="text-white"> {{ slot.displayName }}</span>
								<span v-html="slot.customNameHTML"></span>
								<br>
								<span v-html="slot.customLoreHTML"></span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>


				</TableRow>
			</TableBody>

			<TableBody v-else>
				<TableRow v-for="index in 3">
					<TableCell v-for="index in 9" class="border-none p-0 md:p-0">
						<Skeleton class="slot skeleton"></Skeleton>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<style scoped>
.skeleton {
	@apply rounded-none border-t border-l border-b last:border-r p-1;
}

.slot {
	@apply w-[40px] h-[40px] p-1 relative;
	@apply sm:w-[50px] sm:h-[50px];
	@apply lg:border-t-2 lg:border-b-2 lg:border-l-2 lg:last:border-r-2;
	@apply xl:w-[60px] xl:h-[60px];

	img {
		@apply w-full m-auto;
	}
}

.count {
	font-weight: 600;
	position: absolute;
	bottom: 0;
	right: 0;
	color: #cccccc;
}
</style>
