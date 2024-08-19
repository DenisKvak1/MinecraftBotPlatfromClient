<script setup lang="ts">
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import BotsList from '@/components/BotsList.vue';
import { onMounted, onUnmounted, reactive, Reactive, Ref, ref } from 'vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import { useRouter } from 'vue-router';
import { useBackendConnect } from '@/proccess/useBackendConnect';
import { BotInfo } from '../../env/types';
import CreateBotFeature from '@/features/CreateBotFeature.vue';
import { useDelay } from '@/hook/useDelay';
import { Subscribe } from '../../env/helpers/observable';

const router = useRouter()
const {isConnect, isNotConnect, reconnect, onConnect} = useBackendConnect()
const {isValue: isLazyNotConnect} = useDelay(isNotConnect, false)


const botsInfo: Ref<BotInfo[]> = ref([])
let subscribe:Subscribe
onMounted(() => {
	onConnect(async () => {
		const response = await webSocketBotAPI.getAllBots()
		botsInfo.value = response.data.accounts
	})

	subscribe = webSocketBotAPI.$eventBot.subscribe((data) => {
		if (data.state === "SPAWN") return
		const index = botsInfo.value.findIndex((info) => info.id === data.id)
		if(!botsInfo.value[index]) return
		botsInfo.value[index].status = data.state as any
	})
})

onUnmounted(()=> subscribe.unsubscribe())

const confirmDialogDeleteBot = ref(false)
const currentDeletedBotInfo:Reactive<{
	id: string,
	nickname: string
}> = reactive({
	id: '',
	nickname: ''
})

async function updateBotList(){
	const response = await webSocketBotAPI.getAllBots()
	botsInfo.value = response.data.accounts
}

function onBotDelete(data: {id: string, nickname: string}){
	currentDeletedBotInfo.id = data.id
	currentDeletedBotInfo.nickname = data.nickname
	confirmDialogDeleteBot.value = true
}
async function onAgreeBotDelete(){
	await webSocketBotAPI.deleteBot(currentDeletedBotInfo.id)
	confirmDialogDeleteBot.value = false
	await updateBotList()
}
function onDisagreeBotDelete(){
	confirmDialogDeleteBot.value = false
}

</script>

<template>
	<div>
		<CreateBotFeature
			@submit="updateBotList"
		></CreateBotFeature>
		<ConfirmationDialog
			:open="confirmDialogDeleteBot"
			@agree="onAgreeBotDelete"
			@disagree="onDisagreeBotDelete"
		>
			Это действие удалит бота {{ currentDeletedBotInfo.nickname }}
		</ConfirmationDialog>
		<BotsList
			@delete="onBotDelete"
			@turn="async (data) => {
        const {action, id} = data;
        if(action === 'CONNECT') {
          console.log(await webSocketBotAPI.turnOn(id))
        }
        if(action === 'DISCONNECT') {
          console.log(await webSocketBotAPI.turnOff(id))
        }
      }"
			@select="data => router.push(`/bots/${data.nickname}`)"
			:skeleton="isLazyNotConnect" :bots="botsInfo">
		</BotsList>
	</div>
</template>

<style scoped>

</style>