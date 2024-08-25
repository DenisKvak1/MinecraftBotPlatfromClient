<script setup lang="ts">
import { BotActionForm, BotActions, BotActionsForm, BotScript } from '../../env/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ref, ref, watch } from 'vue';

const props = defineProps<{
	botScript: BotScript
}>();
const emit = defineEmits<{
	(e: 'save', actions: BotActions): void,
	(e: 'delete'): void
}>();
watch(()=> props.botScript, ()=>{
	actions.value = [...props.botScript.botActions]
})
const actions: Ref<BotActions> = ref([...props.botScript.botActions]);

function deleteAction(index: number) {
	actions.value.splice(index, 1);
}

function pushAction() {
	actions.value.push({ command: '', value: {} });
}
</script>

<template>
	<div>
		<div class="flex justify-between">
			<h2 class="text-xl font-medium">Скрипт: {{props.botScript.name}}</h2>
			<Button @click="emit('delete')" class="ml-1">
				<font-awesome-icon :icon="['fas', 'trash']" />
			</Button>
		</div>
		<div class="flex flex-col gap-2 mt-2">
			<div class="flex" v-for="(action, index) in actions">
				<Select v-model="actions[index].command">
					<SelectTrigger class="w-[350px]">
						<SelectValue
							placeholder="Выбрите действие: "
						></SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem
								v-for="nameBotAction in Object.entries(BotActionsForm)"
								:value="nameBotAction[0]">
								{{ nameBotAction[1] }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div class="flex gap-1 ml-1 mr-auto">
					<Input
						v-for="actionParametr in BotActionForm[action.command]"
						:placeholder="actionParametr.placeholder"
						v-model="action.value[actionParametr.key]"
					></Input>
				</div>
				<Button @click="deleteAction(index)" class="ml-1">
					<font-awesome-icon :icon="['fas', 'trash']" />
				</Button>
			</div>
			<Button @click="pushAction" class="w-10 text-lg">+</Button>
			<Button @click="emit('save', actions)">Сохранить</Button>
		</div>
	</div>
</template>

<style scoped>

</style>