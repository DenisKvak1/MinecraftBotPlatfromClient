<script setup lang="ts">
import { supportedVersions } from '../../env/config';
import { useField, useForm } from 'vee-validate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import ScriptSelectFeature from '@/features/ScriptSelectFeature.vue';

type form = {
	nickname: string;
	server: string,
	version: string;
	port: number,
	autoReconnectScript: string,
	autoReconnectTimeout: number
}

const emit = defineEmits<{
	(event: 'submit', values: form): void;
}>();

const props = defineProps<{
	serverError?: string
}>();

const validations = {
	nickname: (value: string) => {
		const usernicknameRegExp = /^[a-zA-Z0-9_]{3,16}$/;
		if (!value) return 'Введите никнейм';
		if (!usernicknameRegExp.test(value)) return 'Никнейм не корректен';

		return true;
	},
	server: (value: string) => {
		const serverHostRegExp = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?!-)(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$|^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		if (!value) return 'Введите IP адресс сервера';
		if (!serverHostRegExp.test(value)) return 'IP сервера не корректно';

		return true;
	},
	port: (value: number) => {
		const portRegExp = /^([0-9]{1,5})$/;
		if (!value) return 'Введите порта сервера';
		if (!portRegExp.test(value.toString())) return 'Порт не корректен';

		return true;
	},
	version: (value: string) => {
		if (!value) return 'Выберите версию';

		return true;
	},
	whiteList: (value: string[])=>{
		return true
	},
	autoReconnectScript: (value: string)=>{
		return true
	},
	autoReconnectTimeout: (value: number)=>{
		return true
	}
};

const { handleSubmit, resetForm } = useForm({
	validationSchema: validations,
});

const { value: nickname, errorMessage: nicknameError } = useField<string>('nickname');
const { value: server, errorMessage: serverError } = useField<string>('server');
const { value: port, errorMessage: portError } = useField<number>('port');
const { value: version, errorMessage: versionError } = useField<string>('version');
const {value: whiteList, errorMessage: whiteListError}= useField<string[]>('whiteList')
const {value: autoReconnectScript, errorMessage: autoReconnectScriptError}= useField<string>('autoReconnectScript')
const {value: autoReconnectTimeout, errorMessage: autoReconnectTimeoutError}= useField<number>('autoReconnectTimeout')


const onSubmit = handleSubmit((values) => {
	resetForm();
	emit('submit', values as form);
});
</script>

<template>
	<form class="flex flex-col gap-4">
		<div class="form">
			<Label for="nickname">
				Никнейм:
			</Label>
			<Input
				v-model="nickname"
				type="text"
				id="nickname"
				placeholder="Никнейм бота"
			></Input>
			<span class="error">{{ nicknameError }}</span>
		</div>
		<div class="form">
			<Label for="version">
				Версия:
			</Label>
			<Select v-model="version">
				<SelectTrigger>
					<SelectValue placeholder="Версия клиента  бота"></SelectValue>
				</SelectTrigger>
				<SelectContent class="max-h-[300px] 2xl:max-h-[350px]">
					<SelectGroup>
						<SelectItem
							v-for="version in supportedVersions"
							:value="version"
						>{{ version }}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<span class="error">{{ versionError }}</span>
		</div>
		<div class="form">
			<Label for="server">
				IP сервера:
			</Label>
			<Input
				v-model="server"
				id="server"
				placeholder="Адресс"
			></Input>
			<span class="error">{{ serverError }}</span>
		</div>
		<div class="form">
			<Label for="port">
				Порт сервера:
			</Label>
			<Input
				v-model="port"
				type="number"
				id="port"
				placeholder="25565"
			></Input>
			<span class="error">{{ portError }}</span>
		</div>
		<div class="form">
			<Label for="whiteList">
				Вайтлист для комманд в лс
			</Label>
			<TagsInput v-model="whiteList">
				<TagsInputItem v-for="item in whiteList" :key="item" :value="item">
					<TagsInputItemText />
					<TagsInputItemDelete />
				</TagsInputItem>

				<TagsInputInput placeholder="Ники..." />
			</TagsInput>
			<span class="error">{{ whiteListError }}</span>
		</div>
		<div class="form">
			<Label for="reconnectScript">
				Скрипт реконнекта
			</Label>
			<ScriptSelectFeature
				id="reconnectScript"
				v-model="autoReconnectScript"
			></ScriptSelectFeature>
			<span class="error">{{ autoReconnectScriptError }}</span>
		</div>
		<div class="form">
			<Label for="autoReconnectTimeout">
				Интервал реконнекта (мс):
			</Label>
			<Input
				v-model="autoReconnectTimeout"
				type="number"
				id="autoReconnectTimeout"
				placeholder="10000"
			></Input>
			<span class="error">{{ autoReconnectTimeoutError }}</span>
		</div>
		<span class="error">{{ props.serverError }}</span>
		<Button @click="onSubmit">Создать</Button>
	</form>
</template>

<style scoped>
.form {
	@apply flex flex-col gap-1;
}

.error {
	color: #a50000;
}
</style>