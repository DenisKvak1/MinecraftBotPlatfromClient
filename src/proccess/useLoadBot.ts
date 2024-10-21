import {useCurrentBotStore} from "@/store/currentBotStore";
import {useRoute, useRouter} from "vue-router";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import { STATUS, toggleInfo } from '@/API/types';
import { onUnmounted, Ref, ref, watch } from 'vue';
import {useBackendConnect} from "@/proccess/useBackendConnect";
import { ToggleToToggleInfo } from '../../env/helpers/toggleToToggleInfo';
import { Subscribe } from '../../env/helpers/observable';


export const useLoadBotStore = ()=> {
    const route = useRoute()
    const router = useRouter()
    let botName = route.params.botName as string
    const {onceConnect} = useBackendConnect()
    const currentBotStore = useCurrentBotStore()
    const isLoad = ref(false)
    const subscribes:Subscribe[] = []

    async function load(){
        const botInfoMessage = await webSocketBotAPI.getBotByName(botName)
        if (botInfoMessage.status !== STATUS.SUCCESS) return router.push('/')

        const botFunctionsMessage = await webSocketBotAPI.getFunctionsStatus(botInfoMessage.data.account.id)

        currentBotStore.setID(botInfoMessage.data.account.id)
        currentBotStore.setName(botName)
        currentBotStore.setBotState(botInfoMessage.data.account.status)
        currentBotStore.setBotServer(botInfoMessage.data.account.server)
        currentBotStore.setFunctions(botFunctionsMessage.data.functionsStatus)
        currentBotStore.setExperience(botInfoMessage.data.experience)
        isLoad.value = true
    }

    watch(()=> route.params.botName, (newValue: string)=>{
        botName = newValue
        load()
    })

    if (!botName) {
        router.push('/')
        return {isLoad}
    }
    onceConnect(() => {
        load()

        subscribes.push(webSocketBotAPI.$eventBot.subscribe((event)=>{
            if(event.state === "SPAWN") return
            if(event.id !== currentBotStore.id) return
            currentBotStore.setBotState(event.state as any)
        }))

        subscribes.push(webSocketBotAPI.$functionsEvent.subscribe((event)=>{
            currentBotStore.setFunction(event.type, ToggleToToggleInfo(event.action))
        }))
    })
    onUnmounted(()=>{
        subscribes.forEach((subs)=>subs.unsubscribe())
    })
    return {isLoad}
}

export const useLoadBot = (botID: Ref<string>) => {
    const { onceConnect } = useBackendConnect()
    const isLoad = ref(false)

    const subscribes:Subscribe[] = []

    const connectCallbacks: Function[] = []
    const disconnectCallbacks: Function[] = []
    const spawnCallbacks: Function[] = []

    const onConnectBot = (callback: Function) => {
        connectCallbacks.push(callback)
    }

    const onSpawnBot = (callback: Function) => {
        spawnCallbacks.push(callback)
    }

    const onDisconnectBot = (callback: Function) => {
        disconnectCallbacks.push(callback)
    }

    const fetchBotData = async () => {
        const botMessage = await webSocketBotAPI.getBot(botID.value)
        if (botMessage.data.account.status === "CONNECT") {
            isLoad.value = true
            connectCallbacks.forEach(callback => callback())
            spawnCallbacks.forEach(callback => callback())
        } else {
            isLoad.value = false
        }
    }

    const handleEvent = (event: any) => {
        if (event.id !== botID.value) return

        if (event.state === "CONNECT") {
            isLoad.value = true
            connectCallbacks.forEach(callback => callback())
        }
        if (event.state === "DISCONNECT") {
            isLoad.value = false
            disconnectCallbacks.forEach(callback => callback())
        }

        if (event.state === "SPAWN") {
            spawnCallbacks.forEach(callback => callback())
        }
    }

    // Выполняется при первоначальной установке
    onceConnect(() => {
        fetchBotData()

        // Подписка на события
        subscribes.push(webSocketBotAPI.$eventBot.subscribe(handleEvent))
    })

    // Наблюдаем за изменением idRef
    watch(botID, (newId) => {
        // Обновляем данные при изменении idRef
        fetchBotData()
    })

    onUnmounted(()=>{
        subscribes.forEach((subs)=>subs.unsubscribe())
    })
    return { isLoad, onConnectBot, onDisconnectBot, onSpawnBot, idRef: botID }
}