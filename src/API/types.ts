import {Item} from "../../env/types";
import { WindowEvent } from '@/API/WS-BOT-API';

export type standartEvent = 'CONNECT' | 'DISCONNECT' | 'SPAWN'

export enum BotStatus {
    CONNECT= "CONNECT",
    DISCONNECT = "DISCONNECT",
}

export type AccountModel = {
    id: string
    nickname: string,
    server: string,
    version: string,
    port: number,
    status: BotStatus
    profile: string
}
export type toggle = "START" | "STOP"

export type MovementDirection = 'BACK' | 'FORWARD' | 'LEFT' | 'RIGHT'
export type HeadRotateDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type toggleInfo = 'ON' | 'OFF'

export type OutgoingMessage<T = any> = {
    command: UNIVERSAL_COMMAND_LIST
    botID: string
    data?: T
}
export type OutgoingGetFarmState = OutgoingMessage

export type IncomingGetFarmStatusMessage = IncomingReplayMessage<{
    status: toggleInfo
}>
export type IncomingReplayMessage<T = any> = {
    command: UNIVERSAL_COMMAND_LIST
    botID: string
    status: STATUS
    errorMessage?: errorMessage
    data?: T
}
export type errorMessage = string

export enum STATUS {
    SUCCESS = 'success',
    ERROR = 'error',
}

export type OutgoingCreateBotMessage = OutgoingMessage<{
    nickname: string,
    server: string,
    port: number,
    version: string,
}>
export type OutgoingDeleteBotMessage = OutgoingMessage
export type OutgoingUpdateBotOptionsMessage = OutgoingMessage<{
    profile?: string,
    server?: string,
    port?: number,
    version?: string,
}>
export type OutgoingConnectBotMessage = OutgoingMessage<{
    action: 'CONNECT' | 'DISCONNECT'
}>
export type OutgoingSendChatMessageMessage = OutgoingMessage<{
    message: string
}>
export type OutgoingAttackMessage = OutgoingMessage
export type OutgoingToggleClickerMessage = OutgoingMessage<{
    action: toggle
    type: 'ATTACK' | 'USEITEM',
    interval?: number
}>
export type OutgoingToggleFoodMessage = OutgoingMessage<{
    action: toggle
}>
export type OutgoingToggleFarmMessage = OutgoingMessage<{
    action: toggle
}>
export type OutgoingRotateHeadMessage = OutgoingMessage<{
    action: toggle
    direction: HeadRotateDirection,
}>
export type OutgoingMovementBotMessage = OutgoingMessage<{
    action: toggle,
    direction: MovementDirection,
}>
export type OutgoingSetHotBarSlotMessage = OutgoingMessage<{
    slotIndex: number
}>
export type OutgoingActivateSlotMessage = OutgoingMessage<{
    slotIndex: number
}>
export type OutgoingDropSlotMessage = OutgoingMessage<{
    slotIndex: number
}>
export type OutgoingDropAllSlotMessage = OutgoingMessage
export type OutgoingGotoMessage = OutgoingMessage<{
    x: number,
    y: number,
    z: number
}>
export type IncomingBotFarmStatusMessage = {
    command: INCOMING_COMMAND_LIST.FARM_ACTION,
    id: string,
    action: toggle
}
export type OutgoingClickWindowMessage = OutgoingMessage<{
    slotIndex: number
}>
export type OutgoingGetBotsMessage = OutgoingMessage
export type OutgoingJumpBotMessage = OutgoingMessage
export type OutgoingGetBotInfoIDMessage = OutgoingMessage<{
    id: string
}>
export type OutgoingGetBotInfoNameMessage = OutgoingMessage<{
    name: string
}>
export type IncomingGetBotInfoMessage = IncomingReplayMessage<{
    account: AccountModel
}>
export type IncomingGetBotsInfoMessage = IncomingReplayMessage<{
    accounts: AccountModel[]
}>
export type IncomingGetCurrentWindowReplayMessage = IncomingReplayMessage<{
    slots: (Item | null)[]
}>
export type OutgoingGetCurrentWindow = OutgoingMessage

export type OutgoingGetSlotsMessage = OutgoingMessage
export type IncomingCaptchaMessage = {
    command: INCOMING_COMMAND_LIST.LOAD_CAPTCHA
    id: string,
    imageBuffer: Buffer
}
export type IncomingConnecingBotMessage = {
    command: INCOMING_COMMAND_LIST.CONNECTING_BOT
    id: string,
    state: standartEvent
}
export type IncomingActionWindowBotMessage = WindowEvent & {
    command: INCOMING_COMMAND_LIST.WINDOW
}
export type IncomingChatBotMessage = {
    command: INCOMING_COMMAND_LIST.CHAT_MESSAGE
    id: string,
    message: string
}
export type IncomingGetSlotsReplayMessage = IncomingReplayMessage<{
    slots?: (Item | null)[]
    selectedSlot: number
}>
export type IncomingCreateBotReplayMessage = IncomingReplayMessage<{
    account: AccountModel
}>
export type IncomingInventoryUpdateBotMessage = {
    command: INCOMING_COMMAND_LIST.INVENTORY_UPDATE
    id: string,
    index: number,
    item: Item | null
}
// export type IncomingChangePositionBotMessage = {
//     command: INCOMING_COMMAND_LIST.POSITION_BOT
//     id: string,
//     pos: {
//         x: number,
//         y: number,
//         z: number
//     }
// }
// export type IncomingBotDamageMessage = {
//     command: INCOMING_COMMAND_LIST.DAMAGE
//     id: string
// }
export type IncomingBotDeathMessage = {
    command: INCOMING_COMMAND_LIST.DEATH
    id: string
}

export enum UNIVERSAL_COMMAND_LIST {
    CREATE_BOT = 'CREATE_BOT',
    DELETE_BOT = 'DELETE_BOT',
    GET_BOT_ID = 'GET_BOT_ID',
    GET_BOT_NAME = 'GET_BOT_NAME',
    GET_BOTS = 'GET_BOTS',
    UPDATE_BOT_OPTIONS = 'UPDATE_UPDATE_BOT_OPTIONS',
    CONNECT_DISCONNECT_BOT = 'CONNECT_DISCONNECT__BOT',
    SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',
    ATTACK = 'ATTACK',
    TOGGLE_CLICKER = 'TOGGLE_CLICKER',
    TOGGLE_FOOD = 'TOGGLE_FOOD',
    TOGGLE_FARM = 'TOGGLE_FARM',
    ROTATE_HEAD = 'ROTATE_HEAD',
    SET_HOTBAR_SLOT = 'SET_HOTBAR_SLOT',
    DROP_SLOT = 'DROP_SLOT',
    DROP_ALL_SLOT = 'DROP_ALL_SLOT',
    GOTO = 'GOTO',
    MOVEMENT_BOT = 'MOVEMENT_BOT',
    JUMP_BOT = 'JUMP_BOT',
    CLICK_WINDOW = 'CLICK_WINDOW',
    GET_FARM_STATUS = 'GET_FARM_STATUS',
    GET_CURRENT_WINDOW = 'GET_CURRENT_WINDOW',
    GET_INVENTORY_SLOTS = 'GET_INVENTORY_SLOTS',
    ACTIVATE_SLOT = 'ACTIVATE_SLOT'
}

export enum INCOMING_COMMAND_LIST {
    CONNECTING_BOT = 'CONNECTING_BOT',
    WINDOW = 'WINDOW',
    CHAT_MESSAGE = 'CHAT_MESSAGE',
    // POSITION_BOT = 'POSITION_BOT',
    LOAD_CAPTCHA = 'LOAD_CAPTCHA',
    INVENTORY_UPDATE = 'INVENTORY_UPDATE',
    // DAMAGE = 'DAMAGE',
    FARM_ACTION = 'FARM_ACTION',
    DEATH = 'DEATH'
}