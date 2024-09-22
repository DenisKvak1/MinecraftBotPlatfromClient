import { BotStatus } from '@/API/types';

export type BotInfo = {
	id: string,
	status: BotStatus,
	nickname: string,
	server: string,
	version: string,
	whiteList: string[],
	autoReconnect: {
		"enable": boolean,
		"script": string
		"timeout": number
	}
}
export type Item = {
	name: string,
	count: number,
	displayName: string,
	slot: number
	customName?: string
	customNameHTML?: string,
	customLoreHTML?: string,
} | null;


export enum BOT_SCRIPT_ACTIONS {
	GOTO = 'GOTO',
	SEND_CHAT_ESSAGE = 'SEND_CHAT_MESSAGE',
	START_MASS_AUTOBUY = 'START_MASS_AUTOBUY',
	STOP_MASS_AUTOBUY = 'STOP_MASS_AUTOBUY',
	ADD_MASS_AUTOBUY_PLAYER = 'ADD_MASS_AUTOBUY_PLAYER',
	DELETE_MASS_AUTOBUY_PLAYER = 'DELETE_MASS_AUTOBUY_PLAYER',
	CLICK_WINDOW = 'CLICK_WINDOW',
	SET_HOTBOR_SLOT = 'SET_HOTBOR_SLOT',
	ACTIVATE_ITEM = 'ACTIVATE_ITEM',
	TOGGLE_AUTOBUY = 'TOGGLE_AUTOBUY',
	TOGGLE_FOOD = 'TOGGLE_FOOD',
	TOGGLE_FARM = 'TOGGLE_FARM',
	TOGGLE_ATTACK_CLICKER ='TOGGLE_ATTACK_CLICKER',
	TOGGLE_USE_CLICKER = 'TOGGLE_USE_CLICKER',
	DROP_SLOT = 'DROP_SLOT',
	SLEEP = 'SLEEP',
	ATTACK = 'ATTACK',
	DISCONNECT = 'DISCONNECT',
	CONNECT = 'CONNECT'
}

export type BotAction<T = any> = {
	command: BOT_SCRIPT_ACTIONS | '',
	value?: T
}

export type BotActions = BotAction[]

export type BotScript = {
	id: string
	name: string,
	botActions: BotActions
}

export const BotActionForm = {
	GOTO: [
		{
			placeholder: 'X',
			key: 'x',
		},
		{
			placeholder: 'Y',
			key: 'y',
		},
		{
			placeholder: 'Z',
			key: 'z',
		},
	],
	SEND_CHAT_MESSAGE: [{
		placeholder: 'Сообщение',
		key: 'message',
	}],
	CLICK_WINDOW: [
		{
			placeholder: 'Слот индекс',
			key: 'slotIndex',
		},
	],
	SET_HOTBAR_SLOT: [
		{
			placeholder: 'Слот индекс',
			key: 'slotIndex',
		},
	],
	ACTIVATE_ITEM: [],
	TOGGLE_AUTOBUY: [
		{
			placeholder: 'Действие',
			key: 'toggle',
		}
	],
	TOGGLE_FOOD: [
		{
			placeholder: 'Действие',
			key: 'toggle',
		}
	],
	TOGGLE_FARM: [
		{
			placeholder: 'Действие',
			key: 'toggle',
		}
	],
	TOGGLE_ATTACK_CLICKER: [
		{
			placeholder: 'Интервал (мс)',
			key: 'intervalTimeout',
		},
		{
			placeholder: 'Действие',
			key: 'toggle',
		}
	],
	TOGGLE_USE_CLICKER: [
		{
			placeholder: 'Интервал (мс)',
			key: 'intervalTimeout',
		},
		{
			placeholder: 'Действие',
			key: 'toggle',
		}
	],
	DROP_SLOT: [
		{
			placeholder: 'Слот индекс',
			key: 'slotIndex',
		},
	],
	SLEEP: [
		{
			placeholder: 'Интервал сна (мс)',
			key: 'sleepTimeout',
		},
	],
	ATTACK: [],
	DISCONNECT: [],
	CONNECT: [],
	START_MASS_AUTOBUY: [
		{
			placeholder: 'Ники игроков',
			key: 'botsNicknames'
		},
	],
	STOP_MASS_AUTOBUY: [
		{
			placeholder: 'id масс автобая',
			key: 'massId'
		}
	],
	ADD_MASS_AUTOBUY_PLAYER: [
		{
			placeholder: 'id масс автобая',
			key: 'massId'
		}
	],
	DELETE_MASS_AUTOBUY_PLAYER: [
		{
			placeholder: 'id масс автобая',
			key: 'massId'
		}
	]
};

export const BotActionsForm = {
	GOTO: 'Идти',
	SEND_CHAT_MESSAGE: 'Сообщение',
	CLICK_WINDOW: 'Клик по окну',
	SET_HOTBAR_SLOT: 'Выбор слота',
	ACTIVATE_ITEM: 'Активация предмета',
	TOGGLE_AUTOBUY: 'Авто-покупка',
	TOGGLE_FOOD: 'Авто еда',
	TOGGLE_FARM: 'Авто фарма',
	TOGGLE_ATTACK_CLICKER: 'Кликер атаки',
	TOGGLE_USE_CLICKER: 'Use кликер',
	DROP_SLOT: 'Выкинуть предмет',
	SLEEP: 'Сон',
	ATTACK: 'Аттака',
	DISCONNECT: 'Отключить',
	CONNECT: 'Подключить',
	START_MASS_AUTOBUY: 'Вкл масс автобай',
	STOP_MASS_AUTOBUY: 'Выкл масс автобай' ,
	ADD_MASS_AUTOBUY_PLAYER: '+ бот из AB',
	DELETE_MASS_AUTOBUY_PLAYER: '- бот из AB'
};