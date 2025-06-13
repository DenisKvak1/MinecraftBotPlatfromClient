<script setup lang="ts">

import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {BotStatus, toggle} from "@/API/types";
import {reactive} from "vue";
import BotElementSkeleton from "@/view/BotElementSkeleton.vue";
import {BotInfo} from "../../env/types";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import UpdateBotFeature from '@/components/UpdateBotFeature.vue';

const props = defineProps<{
  botInfo: BotInfo,
}>()

const emit = defineEmits<{
  (e: 'turn', action: 'CONNECT' | 'DISCONNECT'): void,
	(e: 'update'): void
  (e: 'delete'): void
}>()

const stateNames = reactive({
  [BotStatus.CONNECT]: "Подключен",
  [BotStatus.DISCONNECT]: "Отключен"
})

function onTurn(){
  if(props.botInfo.status == BotStatus.CONNECT){
    emit('turn', 'DISCONNECT')
  }
  if(props.botInfo.status == BotStatus.DISCONNECT){
    emit('turn', 'CONNECT')
  }
}
</script>

<template>
  <div class="element">
    <div class="flex items-center justify-end gap-4 w-full">
      <span class="nickname self-center">{{props.botInfo.nickname}}</span>
      <DropdownMenu>
        <DropdownMenuTrigger class="h-5 w-5" as-child>
          <button @click.stop>
            <font-awesome-icon class="icon" :icon="['fas', 'bars']" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
						<button @click="emit('update')">Настройки</button>
          </DropdownMenuItem>
          <DropdownMenuItem  @click="emit('delete')" class="cursor-pointer">
            <button>Удалить</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="info">
      <span>{{ props.botInfo.server }}</span>
      <span>{{ props.botInfo.version }}</span>
    </div>
    <div class="connectMenu">
      <button
          @click.stop="onTurn"
          :class="{
            'connect': props.botInfo.status === BotStatus.DISCONNECT,
            'disconnect': props.botInfo.status === BotStatus.CONNECT,
          }"
          class="connectButton"
      >
        <font-awesome-icon class="icon" :icon="['fas', 'power-off']"/>
      </button>
      <span
          :class="{
            'connect': props.botInfo.status === BotStatus.CONNECT,
            'disconnect': props.botInfo.status === BotStatus.DISCONNECT,
          }"
          class="font-medium"
      >
        {{ stateNames[props.botInfo.status] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.element {
  @apply w-44 h-44 border shadow-md rounded-2xl p-4 flex flex-col items-center cursor-pointer;
  @apply 2xl:w-60 2xl:h-60 2xl:p-6;
}
.nickname {
  @apply font-medium text-xl;
  @apply xl:text-[20px];
}
.info {
  @apply mt-2 self-start flex flex-col;
  @apply 2xl:mt-3 text-xl;
}
.connectMenu {
  @apply mt-auto flex justify-between w-full;
  @apply 2xl:justify-between 2xl:items-center 2xl:text-xl
}
.connectButton {
  @apply w-7 h-7;
  @apply 2xl:w-10 2xl:h-10;
}
.icon {
  @apply w-full h-full;
}

.connect {
  color: #2faa00;
}
.disconnect {
  color: #e80000;
}
</style>