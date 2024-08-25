<script setup lang="ts">

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { ref, Ref, watch } from 'vue';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { BotScript } from '../../env/types';

const { onceConnect } = useBackendConnect();
const scripts: Ref<BotScript[]> = ref([]);
const selectId = ref('');


const emit = defineEmits<{
	(e: 'update', id: string)
}>();

onceConnect(async () => {
	const responseData = (await webSocketBotAPI.getAllScripts()).data;
	scripts.value = responseData.scripts;
});

watch(()=> selectId.value, ()=>{
	emit('update', selectId.value);
})

</script>

<template>
	<Select v-model="selectId">
		<SelectTrigger>
			<SelectValue
				placeholder="Выбрите скрипт: "
			></SelectValue>
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem
					v-for="script in scripts"
					:value="script.id"
					:key="script.id"
				>
					{{ script.name }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<style scoped>

</style>