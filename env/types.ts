import {BotStatus} from "@/API/types";

export type BotInfo = {
    id: string,
    status: BotStatus,
    nickname: string,
    server: string,
    version: string
}
export type Item = {
    name: string,
    count: number,
    displayName: string,

    customName?: string,
    customLore?: string,
} | null;
