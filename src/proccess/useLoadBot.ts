import {useCurrentBotStore} from "@/store/currentBotStore";
import {useRoute, useRouter} from "vue-router";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import {STATUS} from "@/API/types";
import { Ref, ref, watch } from 'vue';
import {useBackendConnect} from "@/proccess/useBackendConnect";


export const useLoadBotStore = ()=> {
    const route = useRoute()
    const router = useRouter()
    let botName = route.params.botName as string
    const {onceConnect} = useBackendConnect()
    const currentBotStore = useCurrentBotStore()
    const isLoad = ref(false)

    function load(){
        webSocketBotAPI.getBotByName(botName).then((botMessage) => {
            if (botMessage.status !== STATUS.SUCCESS) return router.push('/')

            currentBotStore.setID(botMessage.data.account.id)
            currentBotStore.setName(botName)
            currentBotStore.setBotState(botMessage.data.account.status)
            currentBotStore.setBotServer(botMessage.data.account.server)
            isLoad.value = true
        })
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

        webSocketBotAPI.$eventBot.subscribe((event)=>{
            if(event.state === "SPAWN") return
            if(event.id !== currentBotStore.id) return
            currentBotStore.setBotState(event.state as any)
        })
    })
    return {isLoad}
}

export const useLoadBot = (botID: Ref<string>) => {
    const { onceConnect } = useBackendConnect()
    const isLoad = ref(false)

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
        webSocketBotAPI.$eventBot.subscribe(handleEvent)
    })

    // Наблюдаем за изменением idRef
    watch(botID, (newId) => {
        // Обновляем данные при изменении idRef
        fetchBotData()
    })

    return { isLoad, onConnectBot, onDisconnectBot, onSpawnBot, idRef: botID }
}