<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { computed, ref } from 'vue';
import { useLoadBot } from '@/proccess/useLoadBot';

const props = defineProps<{
	botID: string
}>()
const computedBotID = computed(()=> props.botID)
const {isLoad} = useLoadBot(computedBotID)


function onAgreeDropAll(){
	webSocketBotAPI.dropAllSlot(props.botID)
	isConfirmDialogOpen.value = false
}
function onDisagreeDropAll(){
	isConfirmDialogOpen.value = false
}
function onButtonClick(){
	if(!isLoad.value) return
	isConfirmDialogOpen.value = true
}

const isConfirmDialogOpen = ref(false)
</script>

<template>
<div>
	<ConfirmationDialog
		:open="isConfirmDialogOpen"
		@agree="onAgreeDropAll"
		@disagree="onDisagreeDropAll"
	>
		Бот выкинет все предметы из инвентаря.
	</ConfirmationDialog>
	<Button @click="onButtonClick">
		<font-awesome-icon :icon="['fas', 'trash']" />
	</Button>
</div>
</template>

<style scoped>

</style>