<script setup lang="ts">

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { ref, Ref, watch } from 'vue';
import { BotScript } from '../../env/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { Proxy } from '@/API/types';

const { onceConnect } = useBackendConnect();
const scripts: Ref<Proxy[]> = ref([]);
const selectId = ref('');

const emit = defineEmits<{
	(e: 'update', id: string)
}>();

onceConnect(async () => {
	const responseData = (await webSocketBotAPI.getAllProxies()).data;
	scripts.value = responseData.proxies;
});

watch(()=> selectId.value, ()=>{
	emit('update', selectId.value);
})
</script>

<template>
	<Select v-model="selectId">
		<SelectTrigger>
			<SelectValue
				placeholder="Выбрите выберите: "
			></SelectValue>
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem
					v-for="proxy in scripts"
					:value="proxy.id"
					:key="proxy.id"
				>
					{{ proxy.address }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<style scoped>

</style>