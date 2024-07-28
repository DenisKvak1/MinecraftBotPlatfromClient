import {createBotDTO} from "@/API/WS-BOT-API";

export function interceptServerWithASpecialVersion (dto: createBotDTO){
    switch (dto.server) {
        case "mc.funtime.su":
            dto.version = '1.16.5'
            break
        case "mc.holyworld.io":
            dto.version = '1.18.2'
            break
        case "mc.holyworld.ru":
            dto.version = '1.18.2'
    }

    return dto
}