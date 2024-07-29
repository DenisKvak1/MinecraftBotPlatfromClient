import {
    HeadRotateDirection,
    INCOMING_COMMAND_LIST,
    IncomingActionWindowBotMessage,
    IncomingBotDeathMessage, IncomingBotFarmStatusMessage,
    IncomingCaptchaMessage,
    IncomingChatBotMessage,
    IncomingConnecingBotMessage,
    IncomingCreateBotReplayMessage, IncomingGetCurrentWindowReplayMessage, IncomingGetFarmStatusMessage,
    IncomingInventoryUpdateBotMessage,
    IncomingReplayMessage,
    MovementDirection,
    OutgoingActivateSlotMessage,
    OutgoingAttackMessage,
    OutgoingClickWindowMessage,
    OutgoingConnectBotMessage,
    OutgoingCreateBotMessage,
    OutgoingDeleteBotMessage,
    OutgoingDropAllSlotMessage,
    OutgoingDropSlotMessage,
    OutgoingGetBotInfoIDMessage,
    OutgoingGetBotInfoNameMessage,
    OutgoingGetBotsMessage, OutgoingGetCurrentWindow, OutgoingGetSlotsMessage,
    OutgoingGotoMessage,
    OutgoingJumpBotMessage,
    OutgoingMessage,
    OutgoingRotateHeadMessage,
    OutgoingSendChatMessageMessage,
    OutgoingSetHotBarSlotMessage,
    OutgoingToggleClickerMessage, OutgoingToggleFarmMessage, OutgoingUpdateBotOptionsMessage, standartEvent, toggle,
} from "@/API/types";
import {IObservable, Observable} from "../../env/helpers/observable";
import {BackendURL} from "../../env/config";
import {
    IncomingGetBotInfoMessage, IncomingGetBotsInfoMessage,
    IncomingGetSlotsReplayMessage,
    OutgoingMovementBotMessage,
    UNIVERSAL_COMMAND_LIST
} from "@/API/types";
import {Command as command} from "@/components/ui/command";
import {Item} from "../../env/types";
import {UnfoldVerticalIcon} from "lucide-vue-next";

type pos = {
    x: number,
    y: number
    z: number
}
export type createBotDTO = {
    nickname: string,
    server: string,
    port: number,
    version: string,
}
type updateBotDTO = {
    profile?: string,
    server?: string,
    port?: number,
    version?: string,
}
type mainEvent = {
    id: string,
    state: standartEvent
}
export type WindowEvent = {
    id: string,
    title?: string,
    action: "OPEN" | "CLOSE" | "UPDATE"
    items?: Item[]
    slotIndex?: number,
    oldItem?: Item
    newItem?: Item
}
type chatMessageEvent = {
    id: string,
    message: string
}
type captchaEvent = {
    id: string,
    imageBuffer: Buffer
}
type inventoryUpdateEvent = {
    id: string,
    index: number,
    item: Item
}
type farmEvent = {
    id: string,
    action: toggle
}
type deathEvent = {
    id: string,
}
interface BOT_API {
    $ready: IObservable<boolean>
    $eventBot: IObservable<mainEvent>
    $window: IObservable<WindowEvent>
    $chatMessage: IObservable<chatMessageEvent>
    $loadCaptcha: IObservable<captchaEvent>
    $inventoryUpdate: IObservable<inventoryUpdateEvent>
    $death: IObservable<deathEvent>

    createBot(dto: createBotDTO): Promise<IncomingCreateBotReplayMessage>
    deleteBot(id: string): Promise<IncomingReplayMessage>
    getBot(id: string): Promise<IncomingGetBotInfoMessage>
    getBotByName(name: string): Promise<IncomingGetBotInfoMessage>
    getAllBots(): Promise<IncomingGetBotsInfoMessage>
    updateBotOptions(id: string, dto: updateBotDTO): Promise<IncomingReplayMessage>
    turnOn(id: string): Promise<IncomingCreateBotReplayMessage>
    turnOff(id: string): Promise<IncomingCreateBotReplayMessage>
    sendChatMessage(id: string, message: string): Promise<IncomingReplayMessage>
    attack(id: string): Promise<IncomingReplayMessage>
    turnOnAttackClicker(id: string, interval: number): Promise<IncomingReplayMessage>
    turnOffAttackClicker(id: string): Promise<IncomingReplayMessage>
    turnOnUseClicker(id: string, interval: number): Promise<IncomingReplayMessage>
    turnOffUseClicker(id: string): Promise<IncomingReplayMessage>
    turnOnFarm(id: string): Promise<IncomingReplayMessage>
    turnOffFarm(id: string): Promise<IncomingReplayMessage>

    getFarmState(id: string): Promise<IncomingGetFarmStatusMessage>

    turnOnAutoFood(id: string): Promise<IncomingReplayMessage>
    turnOffAutoFood(id: string): Promise<IncomingReplayMessage>

    startHeadUpRotate(id: string): Promise<IncomingReplayMessage>;
    startHeadDownRotate(id: string): Promise<IncomingReplayMessage>;
    startHeadRightRotate(id: string): Promise<IncomingReplayMessage>;
    startHeadLeftRotate(id: string): Promise<IncomingReplayMessage>;

    stopHeadRotateUp(id: string): Promise<IncomingReplayMessage>;
    stopHeadRotateDown(id: string): Promise<IncomingReplayMessage>;
    stopHeadRotateRight(id: string): Promise<IncomingReplayMessage>;
    stopHeadRotateLeft(id: string): Promise<IncomingReplayMessage>;

    setHotBarSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage>;
    dropSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage>;
    dropAllSlot(id: string): Promise<IncomingReplayMessage>;
    goto(id: string, pos: pos): Promise<IncomingReplayMessage>;

    forwardStart(id: string): Promise<IncomingReplayMessage>;
    backwardStart(id: string): Promise<IncomingReplayMessage>;
    leftStart(id: string): Promise<IncomingReplayMessage>;
    rightStart(id: string): Promise<IncomingReplayMessage>;

    forwardStop(id: string): Promise<IncomingReplayMessage>;
    backwardStop(id: string): Promise<IncomingReplayMessage>;
    leftStop(id: string): Promise<IncomingReplayMessage>;
    rightStop(id: string): Promise<IncomingReplayMessage>;

    jump(id: string): Promise<IncomingReplayMessage>;

    clickWindow(id: string, slotIndex:number): Promise<IncomingReplayMessage>;
    getCurrentWindow(id:string): Promise<IncomingGetCurrentWindowReplayMessage>
    getInventorySlots(id: string): Promise<IncomingGetSlotsReplayMessage>;
    activateSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage>;
}

export class WebsocketBotApi implements BOT_API{
    private webSocket:WebSocket
    private eventRoutes: Record<INCOMING_COMMAND_LIST, Function>
    private $message =  new Observable<IncomingReplayMessage>()
    $ready = new Observable(false)
    $chatMessage =  new Observable<chatMessageEvent>();
    $death =  new Observable<deathEvent>();
    $eventBot =  new Observable<mainEvent>();
    $inventoryUpdate =  new Observable<inventoryUpdateEvent>();
    $loadCaptcha =  new Observable<captchaEvent>();
    $window =  new Observable<WindowEvent>();
    $farm = new Observable<farmEvent>()

    constructor() {
        this.init()
    }

    private init(){
        this.connect()
        this.initEventRoutes()

    }

    private initEventRoutes(){
        this.eventRoutes = {
            [INCOMING_COMMAND_LIST.FARM_ACTION]: (message: IncomingBotFarmStatusMessage)=>{
                this.onFarmAction(message.id, message.action)
            },
            [INCOMING_COMMAND_LIST.CONNECTING_BOT]: (message: IncomingConnecingBotMessage)=> {
                this.onStandartBotEvent(message.id, message.state)
            },
            [INCOMING_COMMAND_LIST.CHAT_MESSAGE]: (message: IncomingChatBotMessage)=> {
                this.onChatMessage(message.id, message.message)
            },
            [INCOMING_COMMAND_LIST.DEATH]: (message: IncomingBotDeathMessage)=> {
                this.onDeath(message.id)
            },
            [INCOMING_COMMAND_LIST.INVENTORY_UPDATE]: (message: IncomingInventoryUpdateBotMessage)=> {
                this.onInventoryUpdate(message.id, message.index, message.item)
            },
            [INCOMING_COMMAND_LIST.LOAD_CAPTCHA]: (message: IncomingCaptchaMessage)=> {
                this.onLoadCaptcha(message.id, message.imageBuffer)
            },
            [INCOMING_COMMAND_LIST.WINDOW]: (message: IncomingActionWindowBotMessage)=> {
                this.onWindowAction(message)
            },
        }
    }

    private connect(){
        this.webSocket = new WebSocket(`ws://${BackendURL}`)
        this.webSocket.onmessage = (message)=> {
            const parsed = JSON.parse(message.data)
            this.onMessage(parsed)
            this.$message.next(parsed)
        }
        this.webSocket.onopen = ()=> this.$ready.next(true)
        this.webSocket.onclose = (event) => setTimeout(() => {
            this.$ready.next(false);
            if (!event.wasClean) {
                this.wsReconnect();
            }
        }, 3000);
    }

    private onMessage(message: OutgoingMessage){
        const myFunction =  this.eventRoutes[message.command]
        if(myFunction) myFunction(message)
    }

    private onFarmAction(id: string, action: toggle) {
        this.$farm.next({id, action})
    }
    private onChatMessage(id: string, message: string){
        this.$chatMessage.next({id, message});
    }

    private onDeath(id: string){
        this.$death.next({id});
    }

    private onStandartBotEvent(id: string, state: standartEvent){
        this.$eventBot.next({id, state});
    }

    private onInventoryUpdate(id: string, index: number, item: Item | null) {
        this.$inventoryUpdate.next({id, index, item})
    }

    private onLoadCaptcha(id: string, imageBuffer: Buffer){
        this.$loadCaptcha.next({id, imageBuffer})
    }

    private onWindowAction(message: IncomingActionWindowBotMessage){
        this.$window.next({
            ...message
        })
    }

    private send<T = OutgoingMessage>(message: T){
        this.webSocket.send(JSON.stringify(message))
    }

    private replay(command: UNIVERSAL_COMMAND_LIST | INCOMING_COMMAND_LIST, botID?: string): Promise<IncomingReplayMessage>{
        return new Promise<IncomingReplayMessage>((resolve) => {
            this.$message.once((message)=> {
                resolve(message)
            }, (message)=> {
                let isNeedMessage =
                    message.command === command &&
                    message.botID === botID
                if(!botID) {
                    isNeedMessage = message.command === command
                }
                return isNeedMessage
            })
        });
    }

    private toggleMovement(id: string,  action: toggle, direction: MovementDirection){
        this.send<OutgoingMovementBotMessage>({
            command: UNIVERSAL_COMMAND_LIST.MOVEMENT_BOT,
            botID: id,
            data: {
                direction,
                action
            }
        })
        return this.replay(UNIVERSAL_COMMAND_LIST.MOVEMENT_BOT, id)
    }

    activateSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage> {
        this.send<OutgoingActivateSlotMessage>({
            command: UNIVERSAL_COMMAND_LIST.ACTIVATE_SLOT,
            botID: id,
            data: {
                slotIndex: slotIndex,
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.ACTIVATE_SLOT, id)
    }

    attack(id: string): Promise<IncomingReplayMessage> {
        this.send<OutgoingAttackMessage>({
            command: UNIVERSAL_COMMAND_LIST.ATTACK,
            botID: id,
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.ATTACK, id)
    }


    backwardStart(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "START", "BACK")
    }

    backwardStop(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "STOP", "BACK")
    }

    clickWindow(id: string, slotIndex: number): Promise<IncomingReplayMessage> {
        this.send<OutgoingClickWindowMessage>({
            command: UNIVERSAL_COMMAND_LIST.CLICK_WINDOW,
            botID: id,
            data: {
                slotIndex
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.CLICK_WINDOW, id)
    }

    createBot(dto: createBotDTO): Promise<IncomingCreateBotReplayMessage>{
        this.send<OutgoingCreateBotMessage>({
            command: UNIVERSAL_COMMAND_LIST.CREATE_BOT,
            botID: '',
            data: {
                ...dto
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.CREATE_BOT)
    }

    deleteBot(id: string): Promise<IncomingReplayMessage> {
        this.send<OutgoingDeleteBotMessage>({
            command: UNIVERSAL_COMMAND_LIST.DELETE_BOT,
            botID: id,
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.DELETE_BOT, id)
    }

    dropAllSlot(id: string): Promise<IncomingReplayMessage> {
        this.send<OutgoingDropAllSlotMessage>({
            command: UNIVERSAL_COMMAND_LIST.DROP_ALL_SLOT,
            botID: id,
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.DROP_ALL_SLOT, id)
    }

    dropSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage> {
        this.send<OutgoingDropSlotMessage>({
            command: UNIVERSAL_COMMAND_LIST.DROP_SLOT,
            botID: id,
            data: {
                slotIndex
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.DROP_SLOT, id)
    }

    forwardStart(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "START", "FORWARD")
    }

    forwardStop(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "STOP", "FORWARD")
    }

    getAllBots(): Promise<IncomingGetBotsInfoMessage> {
        this.send<OutgoingGetBotsMessage>({
            command: UNIVERSAL_COMMAND_LIST.GET_BOTS,
            botID: '',
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_BOTS)
    }

    getBot(id: string): Promise<IncomingGetBotInfoMessage> {
        this.send<OutgoingGetBotInfoIDMessage>({
            command: UNIVERSAL_COMMAND_LIST.GET_BOT_ID,
            botID: id,
            data: {
                id
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_BOT_ID, id)
    }

    getBotByName(name: string): Promise<IncomingGetBotInfoMessage> {
        this.send<OutgoingGetBotInfoNameMessage>({
            command: UNIVERSAL_COMMAND_LIST.GET_BOT_NAME,
            botID: '',
            data: {
                name
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_BOT_NAME)
    }

    getInventorySlots(id: string): Promise<IncomingGetSlotsReplayMessage> {
        this.send<OutgoingGetSlotsMessage>({
            command: UNIVERSAL_COMMAND_LIST.GET_INVENTORY_SLOTS,
            botID: id,
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_INVENTORY_SLOTS, id)
    }

    goto(id: string, pos: pos): Promise<IncomingReplayMessage> {
        this.send<OutgoingGotoMessage>({
            command: UNIVERSAL_COMMAND_LIST.GOTO,
            botID: id,
            data: {
                ...pos
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GOTO, id)
    }

    jump(id: string): Promise<IncomingReplayMessage> {
        this.send<OutgoingJumpBotMessage>({
            command: UNIVERSAL_COMMAND_LIST.JUMP_BOT,
            botID: id
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.JUMP_BOT, id)
    }

    leftStart(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "START", "LEFT")
    }

    leftStop(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "STOP", "LEFT")
    }

    rightStart(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "START", "RIGHT")
    }

    rightStop(id: string): Promise<IncomingReplayMessage> {
        return this.toggleMovement(id,  "STOP", "RIGHT")
    }

    sendChatMessage(id: string, message: string): Promise<IncomingReplayMessage> {
        this.send<OutgoingSendChatMessageMessage>({
            command: UNIVERSAL_COMMAND_LIST.SEND_CHAT_MESSAGE,
            botID: id,
            data: {
                message
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.SEND_CHAT_MESSAGE, id)
    }

    setHotBarSlot(id: string, slotIndex: number): Promise<IncomingReplayMessage> {
        this.send<OutgoingSetHotBarSlotMessage>({
            command: UNIVERSAL_COMMAND_LIST.SET_HOTBAR_SLOT,
            botID: id,
            data: {
                slotIndex
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.SET_HOTBAR_SLOT, id)
    }

    private toggleHeadRotate(id: string, action: toggle, direction: HeadRotateDirection): Promise<IncomingReplayMessage>{
        this.send<OutgoingRotateHeadMessage>({
            command: UNIVERSAL_COMMAND_LIST.ROTATE_HEAD,
            botID: id,
            data: {
                direction,
                action
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.ROTATE_HEAD, id)
    }

    startHeadDownRotate(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "START", "DOWN")
    }

    startHeadLeftRotate(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "START", "LEFT")
    }

    startHeadRightRotate(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "START", "RIGHT")
    }

    startHeadUpRotate(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "START", "UP")
    }

    stopHeadRotateDown(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "STOP", "DOWN")
    }

    stopHeadRotateLeft(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "STOP", "LEFT")
    }

    stopHeadRotateRight(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "STOP", "RIGHT")
    }

    stopHeadRotateUp(id: string): Promise<IncomingReplayMessage> {
        return this.toggleHeadRotate(id,  "STOP", "UP")
    }

    toggleConnect(id: string, action: 'CONNECT' | 'DISCONNECT') {
        this.send<OutgoingConnectBotMessage>({
            command: UNIVERSAL_COMMAND_LIST.CONNECT_DISCONNECT_BOT,
            botID: id,
            data: {
                action
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.CONNECT_DISCONNECT_BOT, id)
    }

    turnOff(id: string): Promise<IncomingCreateBotReplayMessage> {
        return this.toggleConnect(id,  "DISCONNECT")
    }

    turnOn(id: string): Promise<IncomingCreateBotReplayMessage> {
        return this.toggleConnect(id,  "CONNECT")
    }

    private toggleClicker(id: string, action: toggle, type: 'ATTACK' | 'USEITEM', interval?: number){
        this.send<OutgoingToggleClickerMessage>({
            command: UNIVERSAL_COMMAND_LIST.TOGGLE_CLICKER,
            botID: id,
            data: {
                action,
                type,
                interval
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.TOGGLE_CLICKER, id)
    }

    turnOffAttackClicker(id: string): Promise<IncomingReplayMessage> {
        return this.toggleClicker(id, "START", "ATTACK")
    }

    turnOffUseClicker(id: string): Promise<IncomingReplayMessage> {
        return this.toggleClicker(id, "STOP", "USEITEM")
    }

    turnOnAttackClicker(id: string, interval: number): Promise<IncomingReplayMessage> {
        return this.toggleClicker(id, "START", "ATTACK", interval)
    }

    turnOnUseClicker(id: string, interval: number): Promise<IncomingReplayMessage> {
        return this.toggleClicker(id, "START", "USEITEM", interval)
    }

    private toggleFarm(id: string, action: toggle): Promise<IncomingReplayMessage>{
        this.send<OutgoingToggleFarmMessage>({
            command: UNIVERSAL_COMMAND_LIST.TOGGLE_FARM,
            botID: id,
            data: {
                action,
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.TOGGLE_FARM, id)
    }

    turnOffFarm(id: string): Promise<IncomingReplayMessage> {
        return this.toggleFarm(id,  "STOP")
    }

    turnOnFarm(id: string): Promise<IncomingReplayMessage> {
        return this.toggleFarm(id,  "START")
    }

    updateBotOptions(id: string, dto: updateBotDTO): Promise<IncomingReplayMessage> {
        this.send<OutgoingUpdateBotOptionsMessage>({
            command: UNIVERSAL_COMMAND_LIST.UPDATE_BOT_OPTIONS,
            botID: id,
            data: {
                ...dto,
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.UPDATE_BOT_OPTIONS, id)
    }

    private toggleAutoFood(id: string, action: toggle): Promise<IncomingReplayMessage>{
        this.send<OutgoingToggleFarmMessage>({
            command: UNIVERSAL_COMMAND_LIST.TOGGLE_FOOD,
            botID: id,
            data: {
                action,
            }
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.TOGGLE_FOOD, id)
    }

    turnOnAutoFood(id: string): Promise<IncomingReplayMessage> {
        return this.toggleAutoFood(id,  "START")
    }

    turnOffAutoFood(id: string): Promise<IncomingReplayMessage>{
        return this.toggleAutoFood(id,  "STOP")
    }

    getCurrentWindow(id: string): Promise<IncomingGetCurrentWindowReplayMessage> {
        this.send<OutgoingGetCurrentWindow>({
            command: UNIVERSAL_COMMAND_LIST.GET_CURRENT_WINDOW,
            botID: id
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_CURRENT_WINDOW, id)
    }


    getFarmState(id: string): Promise<IncomingGetFarmStatusMessage> {
        this.send<OutgoingGetCurrentWindow>({
            command: UNIVERSAL_COMMAND_LIST.GET_FARM_STATUS,
            botID: id
        })

        return this.replay(UNIVERSAL_COMMAND_LIST.GET_FARM_STATUS)
    }

    wsReconnect(): Promise<boolean> {
        this.webSocket.close();
        this.connect()

        this.webSocket.onclose = (event) => setTimeout(() => {
            if (!event.wasClean) {
                this.wsReconnect();
            }
        }, 3000);

        return new Promise((resolve)=>{
            this.$ready.once((state)=>{
                resolve(state)
            })
        })
    }
}
export const webSocketBotAPI = new WebsocketBotApi()