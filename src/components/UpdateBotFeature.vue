<script setup lang="ts">

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import CreateBotBlock from '@/components/CreateBotBlock.vue';
import { onMounted, ref, watch } from 'vue';
import { interceptServerWithASpecialVersion } from '../../env/helpers/interceptServerWithASpecialVersion';
import { updateBotDTO, webSocketBotAPI } from '@/API/WS-BOT-API';
import { AccountModel, STATUS } from '@/API/types';
import { BotInfo } from '../../env/types';

const emit = defineEmits<{
	(e: 'submit'),
	(e: 'close')
}>();

type form = {
	nickname: string;
	server: string,
	version: string;
	port: number,
	autoReconnectScript: string,
	autoReconnectTimeout: number
}

const props = defineProps<{
	currentBot: BotInfo,
	open?: boolean
}>();
watch(() => props.open, () => {
	dialogIsOpen.value = props.open;
});

const dialogIsOpen = ref(false);
watch(() => dialogIsOpen.value, () => {
	if (!dialogIsOpen.value) emit('close');
});
const serverError = ref('');

async function onSubmit(form: form) {
	const updateDto: updateBotDTO = {};
	for (const formKey in form) {
		if (props.currentBot[formKey] !== form[formKey]) updateDto[formKey] = form[formKey];
	}
	updateDto.autoReconnect = {
		script: "",
		timeout: -1,
		enable: false
	};
	if (form.autoReconnectScript || form.autoReconnectScript) {
		updateDto.autoReconnect.enable = true;
	}
	updateDto.autoReconnect.script = form.autoReconnectScript || '';
	updateDto.autoReconnect.timeout = form.autoReconnectTimeout | 5000;

	delete form.autoReconnectScript;
	delete form.autoReconnectTimeout;


	console.log(updateDto);
	const response = await webSocketBotAPI.updateBotOptions(props.currentBot.id, updateDto);
	if (response.status !== STATUS.SUCCESS) {
		serverError.value = response.errorMessage;
	}

	if (response.status === STATUS.SUCCESS) {
		emit('submit');
		dialogIsOpen.value = false;
	}
}

</script>

<template>
	<Dialog v-model:open="dialogIsOpen">
		<DialogTrigger>
			<slot></slot>
		</DialogTrigger>
		<DialogContent class="max-h-screen  overflow-y-auto">
			<DialogHeader>
				<DialogTitle>Обновление данных бота:</DialogTitle>
				<DialogDescription>
					Заполните форму для создание бота.
				</DialogDescription>
			</DialogHeader>
			<CreateBotBlock
				@submit="values => onSubmit(values)"
				:default-form="currentBot"
				:serverError="serverError"
			></CreateBotBlock>
		</DialogContent>
	</Dialog>
</template>

<style scoped>

</style>