import {webSocketBotAPI} from "@/API/WS-BOT-API";
import {computed, onUnmounted, ref} from "vue";
import { Subscribe } from '../../env/helpers/observable';

export function useBackendConnect() {
    const isConnect = ref(false)
    const isNotConnect = computed(() => !isConnect.value)
    const isReady = webSocketBotAPI.$ready.getValue()
    const collector:Subscribe[] = []

    const reconnect = async () => {
        isConnect.value = await webSocketBotAPI.wsReconnect()
    }
    const onConnect = (callback: ()=> void)=> {
        if(webSocketBotAPI.$ready.getValue()) callback()
        collector.push(
            webSocketBotAPI.$ready.subscribe((value)=>{
                if(!value) return
                callback()
            })
        )
    }

    const onceConnect = (callback: ()=> void)=> {
        if(webSocketBotAPI.$ready.getValue()) return callback()
        webSocketBotAPI.$ready.once(()=>{
            callback()
        }, (value)=> Boolean(value))
    }

    isConnect.value = isReady
    collector.push(
        webSocketBotAPI.$ready.subscribe((value)=>{
            isConnect.value = value
        })
    )
    onUnmounted(()=> collector.forEach((subs)=> subs.unsubscribe()))

    return {isConnect, isNotConnect, reconnect, onConnect, onceConnect}
}