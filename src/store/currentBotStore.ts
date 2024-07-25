import {defineStore} from "pinia";
import { BotStatus} from "@/API/types";

type state = {
    id: string,
    name: string,
    state: BotStatus,
    server: string
};
export const useCurrentBotStore = defineStore('currentBot', {
    state: (): state => ({
        id: '',
        name: '',
        state: BotStatus.DISCONNECT,
        server: ''
    }),
    actions: {
        setID(id: string){
            this.id = id
        },
        setName(name: string){
            this.name = name
        },
        setBotState(state: BotStatus) {
            this.state = state
        },
        setBotServer(server: string) {
            this.server = server
        }
    },
});