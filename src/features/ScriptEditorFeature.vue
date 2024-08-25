<script setup lang="ts">

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { BotActions, BotScript } from '../../env/types';
import { Ref, ref, watch } from 'vue';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import ScriptEditor from '@/components/ScriptEditor.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const { onceConnect } = useBackendConnect();
const scripts: Ref<BotScript[]> = ref([]);
const selectId = ref('');
const script: Ref<BotScript> = ref(null);
const newScriptName = ref('');

onceConnect(async () => {
	const responseData = (await webSocketBotAPI.getAllScripts()).data;
	scripts.value = responseData.scripts;
});

watch(() => selectId.value, () => {
	script.value = scripts.value.find((item) => item.id === selectId.value);
});

function onSave(botActions: BotActions) {
	const index = scripts.value.findIndex((item) => item.id === selectId.value);
	scripts.value[index].botActions = botActions;
	const currentScript = scripts.value[index];
	webSocketBotAPI.saveScript(botActions, currentScript.name);
	script.value = null;
	selectId.value = '';
}

function onDelete() {
	scripts.value = scripts.value.filter((item) => item.id !== selectId.value);
	script.value = null;
	webSocketBotAPI.deleteScript(selectId.value);
}

function onCreate() {
	if (!newScriptName.value) return;

	const newScript = {
		id: window.crypto.randomUUID(),
		name: newScriptName.value,
		botActions: [],
	} as BotScript;

	selectId.value = newScript.id;
	scripts.value.push(newScript);
	script.value = newScript;
	webSocketBotAPI.saveScript(newScript.botActions, newScriptName.value);
	newScriptName.value = '';
}
</script>

<template>
	<div>
		<div class="flex">
			<Select v-model="selectId">
				<SelectTrigger class="w-[350px]">
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
			<Input v-model="newScriptName" class="ml-auto w-36" />
			<Button @click="onCreate" class="w-10 text-lg ml-2">+</Button>
		</div>
		<ScriptEditor
			class="mt-3"
			v-if="script"
			@save="onSave"
			@delete="onDelete"
			:botScript="script"
		></ScriptEditor>
	</div>
</template>

<style scoped>

</style>