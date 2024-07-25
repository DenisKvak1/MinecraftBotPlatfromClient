<script setup lang="ts">
import {useCurrentBotStore} from "@/store/currentBotStore";
import {useLoadBotStore} from "@/proccess/useLoadBot";
import {useBackendConnect} from "@/proccess/useBackendConnect";
import {useDelay} from "@/hook/useDelay";
import LostConnection from "@/components/LostConnection.vue";
import ConnectBotSwitcher from "@/features/ConnectBotSwitcher.vue";
import HotbarFeature from "@/features/HotbarFeature.vue";
import BotWindowFeature from "@/features/BotWindowFeature.vue";
import ChatBotFeature from "@/features/ChatBotFeature.vue";
import BotWalkBlock from "@/components/BotWalkBlock.vue";
import BotWalkFeature from "@/features/BotWalkFeature.vue";
import BotHeadFeature from "@/features/BotHeadFeature.vue";

const {isLoad} = useLoadBotStore()
const currentBotStore = useCurrentBotStore()

const {isNotConnect, reconnect} = useBackendConnect()
const {isValue: isLazyNotConnect} = useDelay(isNotConnect, false)


</script>

<template>
  <div>
    <div v-if="isLoad" class="p-1.5 container">
      <div class="flex justify-between">
        <BotHeadFeature :bot-i-d="currentBotStore.id"></BotHeadFeature>
        <BotWalkFeature :bot-i-d="currentBotStore.id"></BotWalkFeature>
      </div>
      <ConnectBotSwitcher :bot-i-d="currentBotStore.id"></ConnectBotSwitcher>
      <div class="myContainer">
        <BotWindowFeature
            :bot-i-d="currentBotStore.id"
            class="bot-window"
        >
        </BotWindowFeature>
        <ChatBotFeature
            :bot-i-d="currentBotStore.id"
            class="bot-chat w-full sm:w-[360px]"
        ></ChatBotFeature>
        <HotbarFeature
            class="slot-bar"
            :bot-i-d="currentBotStore.id"
        ></HotbarFeature>
      </div>

    </div>
    <LostConnection
        :open="isLazyNotConnect"
        @reconnect="reconnect"
    ></LostConnection>
  </div>
</template>

<style scoped>
.myContainer {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: auto;
  justify-items: center;
}

.bot-window {
  order: 2;
}

.slot-bar {
  order: 3;
}

.bot-chat {
  order: 1;
}

@media (min-width: 1024px) {
  .myContainer {
    grid-template-rows: repeat(2, auto);
    grid-template-columns: repeat(2, auto);
    justify-items: initial;
  }

  .bot-window {
    grid-column: span 1;
    grid-row: span 1;
    align-self: self-end;
    order: 1;
  }

  .slot-bar {
    grid-column: span 1;
    grid-row: span 1;
    align-self: center;
    order: 3;
  }

  .bot-chat {
    grid-column: span 1;
    grid-row: span 2;
    order: 2;
  }
}
</style>

