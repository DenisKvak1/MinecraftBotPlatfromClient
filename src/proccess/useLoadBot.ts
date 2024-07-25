import {useCurrentBotStore} from "@/store/currentBotStore";
import {useRoute, useRouter} from "vue-router";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import {STATUS} from "@/API/types";
import {ref} from "vue";
import {useBackendConnect} from "@/proccess/useBackendConnect";


export const useLoadBotStore = ()=> {
    const route = useRoute()
    const router = useRouter()
    const botName = route.params.botName as string
    const {onceConnect} = useBackendConnect()
    const currentBotStore = useCurrentBotStore()
    const isLoad = ref(false)

    if (!botName) {
        router.push('/')
        return {isLoad}
    }
    onceConnect(() => {
        webSocketBotAPI.getBotByName(botName).then((botMessage) => {
            if (botMessage.status !== STATUS.SUCCESS) return router.push('/')

            currentBotStore.setID(botMessage.data.account.id)
            currentBotStore.setName(botName)
            currentBotStore.setBotState(botMessage.data.account.status)
            currentBotStore.setBotServer(botMessage.data.account.server)
            isLoad.value = true
        })

        webSocketBotAPI.$eventBot.subscribe((event)=>{
            if(event.state === "SPAWN") return
            if(event.id !== currentBotStore.id) return
            currentBotStore.setBotState(event.state as any)
        })
    })
    return {isLoad}
}

export const useLoadBot = (id: string) => {
    const { onceConnect } = useBackendConnect()
    const isLoad = ref(false)

    const connectCallbacks: Function[] = []
    const disconnectCallbacks: Function[] = []

    const onConnectBot = (callback: Function) => {
        connectCallbacks.push(callback)
    }

    const onDisconnectBot = (callback: Function) => {
        disconnectCallbacks.push(callback)
    }

    onceConnect(() => {
        webSocketBotAPI.getBot(id).then((botMessage) => {
            if(botMessage.data.account.status === "CONNECT"){
                isLoad.value = true
                connectCallbacks.forEach((callback) => callback())
            }
        })

        webSocketBotAPI.$eventBot.subscribe((event)=>{
            if(event.state === "SPAWN") return
            if(event.id !== id) return

            if(event.state === "CONNECT"){
                isLoad.value = true
                connectCallbacks.forEach((callback) => callback())
            }
            if(event.state === "DISCONNECT"){
                isLoad.value = false
                disconnectCallbacks.forEach((callback) => callback())
            }
        })
    })


    return {isLoad, onConnectBot, onDisconnectBot}
}