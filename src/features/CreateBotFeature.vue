<script setup lang="ts">

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateBotBlock from '@/components/CreateBotBlock.vue';
import { ref } from 'vue';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';
import { interceptServerWithASpecialVersion } from '../../env/helpers/interceptServerWithASpecialVersion';

const emit = defineEmits<{
	(e: 'submit')
}>();

type form = {
	nickname: string;
	server: string,
	version: string;
	port: number,
	autoReconnectScript: string,
	autoReconnectTimeout: number
}
const dialogIsOpen = ref(false);
const serverError = ref('');


async function onSubmit(form: form) {
	const formatForm: any = interceptServerWithASpecialVersion(form);
	formatForm.autoReconnect = {};
	if (form.autoReconnectScript || form.autoReconnectScript) {
		formatForm.autoReconnect.enable = true;
	}
	formatForm.autoReconnect.script = form.autoReconnectScript || '';
	formatForm.autoReconnect.timeout = form.autoReconnectTimeout | 5000;

	delete form.autoReconnectScript
	delete form.autoReconnectTimeout

	const response = await webSocketBotAPI.createBot(formatForm);
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
				<DialogTitle>Создание бота:</DialogTitle>
				<DialogDescription>
					Заполните форму для создание бота.
				</DialogDescription>
			</DialogHeader>
			<CreateBotBlock
				@submit="values => onSubmit(values)"
				:serverError="serverError"
			></CreateBotBlock>
		</DialogContent>
	</Dialog>
</template>

<style scoped>

</style>