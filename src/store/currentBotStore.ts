import {defineStore} from "pinia";
import { BotFunctions, BotStatus, Experience, toggleInfo } from '@/API/types';

type state = {
    id: string,
    name: string,
    state: BotStatus,
    server: string,
    functions: Record<BotFunctions, toggleInfo>
};
export const useCurrentBotStore = defineStore('currentBot', {
    state: (): state => ({
        id: '',
        name: '',
        state: BotStatus.DISCONNECT,
        server: '',
        functions: {
            AUTO_FARM: 'OFF',
            AUTO_BUY: 'OFF',
            AUTO_CLICKER_ATTACK: 'OFF',
            AUTO_CLICKER_USE: 'OFF',
            AUTO_FOOD: 'OFF',
        }
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
        },
        setFunctions(functions: Record<BotFunctions, toggleInfo>){
            for (const functionsKey in functions) {
                this.functions[functionsKey] = functions[functionsKey];
            }
        },
        setFunction(type:BotFunctions, value: toggleInfo){
            this.functions[type] = value;
        },
        setExperience(experience: Experience){
            this.experience = experience
        }
    },
});