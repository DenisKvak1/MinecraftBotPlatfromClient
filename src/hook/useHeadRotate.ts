import { toggle } from '@/API/types';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { Ref } from 'vue';

export const useHeadRotate = (botID: Ref<string>) =>{
	type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'CENTER'

	const onAction = (data: {action: toggle, direction: Direction})=> {
		const {action, direction} = data
		const id = botID.value
		switch (direction) {
			case "DOWN":
				if(action === "START"){
					webSocketBotAPI.startHeadDownRotate(id)
				}
				if(action === "STOP"){
					webSocketBotAPI.stopHeadRotateDown(id)
				}
				break
			case "UP":
				if(action === "START"){
					webSocketBotAPI.startHeadUpRotate(id)
				}
				if(action === "STOP"){
					webSocketBotAPI.stopHeadRotateUp(id)
				}
				break
			case "LEFT":
				if(action === "START"){
					webSocketBotAPI.startHeadLeftRotate(id)
				}
				if(action === "STOP"){
					webSocketBotAPI.stopHeadRotateLeft(id)
				}
				break
			case "RIGHT":
				if(action === "START"){
					webSocketBotAPI.startHeadRightRotate(id)
				}
				if(action === "STOP"){
					webSocketBotAPI.stopHeadRotateRight(id)
				}
				break
		}
	}
	return {onAction}
}