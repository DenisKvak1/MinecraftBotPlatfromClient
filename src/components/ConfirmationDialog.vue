<script setup lang="ts">

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const emit = defineEmits<{
	(e: 'agree'),
	(e: 'disagree')
}>()

const props = defineProps<{
	open: boolean
}>()

</script>

<template>
	<Dialog :open="props.open" @close="emit('disagree')">
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Вы точно уверены?</DialogTitle>
				<DialogDescription>
					<slot></slot>
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button @click.prevent="emit('disagree')" class="w-full" variant="outline">Отмена</Button>
				<Button @click="emit('agree')" class="w-full">Подтвердить</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<style scoped>

</style>