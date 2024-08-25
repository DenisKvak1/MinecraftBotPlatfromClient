import { BotActions, BotScript, Item } from '../../env/types';
import { WindowEvent } from '@/API/WS-BOT-API';

export type standartEvent = 'CONNECT' | 'DISCONNECT' | 'SPAWN'

export enum BotStatus {
    CONNECT= "CONNECT",
    DISCONNECT = "DISCONNECT",
}
export enum BotFunctions {
    AUTO_FARM = "AUTO_FARM",
    AUTO_BUY = "AUTO_BUY",
    AUTO_CLICKER_ATTACK = 'AUTO_CLICKER_ATTACK',
    AUTO_CLICKER_USE = 'AUTO_CLICKER_USE',
    AUTO_FOOD = 'AUTO_FOOD',
}
export type AccountModel = {
    id: string
    nickname: string,
    server: string,
    version: string,
    port: number,
    status: BotStatus
    profile: string,
    whiteList: string[]
    autoReconnect: {
        "enable": boolean,
        "script": string
        "timeout": number
    }
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
    whiteList?: string[]
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
export type OutgoingSaveScriptMessage = OutgoingMessage<{
    actions: BotActions,
    name: string
}>
export type OutgoingDeleteScriptMessage = OutgoingMessage<{
    scriptId: string
}>
export type OutgoingGetScriptsMessage = OutgoingMessage
export type OutgoingClickWindowMessage = OutgoingMessage<{
    slotIndex: number
    mode: number
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
export type IncomingGetBotFunctionStatusReplayMessage = IncomingReplayMessage<{
    functionsStatus: Record<BotFunctions, toggleInfo>
}>
export type OutgoingGetCurrentWindow = OutgoingMessage
export type OutgoingGetBotFunctionsStateMessage = OutgoingMessage

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
export type IncomingGetScripts = IncomingReplayMessage<{
    scripts: BotScript[]
}>
export type IncomingDeleteScript = IncomingReplayMessage
export type IncomingSaveScript = IncomingReplayMessage<{
    script: BotScript
}>
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
export type IncomingBotFunctionsStatusMessage = {
    command: INCOMING_COMMAND_LIST.BOT_FUNCTIONS_ACTION,
    id: string,
    type: BotFunctions
    action: toggle
}

export type OutgoingGetABState = OutgoingMessage

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
    TOGGLE_AB = 'TOGGLE_AB',
    GET_BOT_FUNCTIONS_STATUS = 'GET_BOT_FUNCTIONS_STATUS',
    ROTATE_HEAD = 'ROTATE_HEAD',
    SET_HOTBAR_SLOT = 'SET_HOTBAR_SLOT',
    DROP_SLOT = 'DROP_SLOT',
    DROP_ALL_SLOT = 'DROP_ALL_SLOT',
    GOTO = 'GOTO',
    MOVEMENT_BOT = 'MOVEMENT_BOT',
    JUMP_BOT = 'JUMP_BOT',
    CLICK_WINDOW = 'CLICK_WINDOW',
    GET_INVENTORY_SLOTS = 'GET_INVENTORY_SLOTS',
    GET_CURRENT_WINDOW = 'GET_CURRENT_WINDOW',
    ACTIVATE_SLOT = 'ACTIVATE_SLOT',
    GET_SCRIPTS = 'GET_SCRIPTS',
    SAVE_SCRIPT = 'SAVE_SCRIPT',
    DELETE_SCRIPT = 'DELETE_SCRIPT'
}

export enum INCOMING_COMMAND_LIST {
    CONNECTING_BOT = 'CONNECTING_BOT',
    WINDOW = 'WINDOW',
    CHAT_MESSAGE = 'CHAT_MESSAGE',
    // POSITION_BOT = 'POSITION_BOT',
    LOAD_CAPTCHA = 'LOAD_CAPTCHA',
    INVENTORY_UPDATE = 'INVENTORY_UPDATE',
    BOT_FUNCTIONS_ACTION = 'BOT_FUNCTIONS_ACTION',
    // DAMAGE = 'DAMAGE',
    DEATH = 'DEATH'
}