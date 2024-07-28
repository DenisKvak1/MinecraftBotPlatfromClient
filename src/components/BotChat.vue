<script setup lang="ts">

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {useImageBuffer} from "@/hook/useImageBuffer";
import {ref} from "vue";

type Message = {
  message?: string;
  photo?: Buffer
}

const props = defineProps<{
  messages: Message[],
	skeleton: boolean
}>()
const emit = defineEmits<{
  (e: 'sendMessage', data: string): void
}>()

const message = ref('')
function sendMessage(){
  if(!message.value) return
  emit('sendMessage', message.value)
  message.value = ''
}
</script>

<template>
<div class="myContainerChat">
  <div class="messageContainer">
    <span class="message"
      v-for="message in props.messages"
    >
      <span  v-if="message.message" class="whitespace-pre-wrap">{{message.message}}</span>
      <img
          v-if="message.photo"
          :src="useImageBuffer(message.photo).imageUrl.value"
          class="h-[180px]"
      >
    </span>
  </div>
  <div class="flex">
    <Input
				:disabled="props.skeleton"
				:class="{
					'disabled': props.skeleton
				}"
        @keydown="(e)=> {
          if (e.key === 'Enter') sendMessage()
        }"
        v-model="message"
        class="rounded-r-none"
    ></Input>
    <Button @click="sendMessage" class="rounded-l-none">
      <font-awesome-icon class=" w-full h-full" :icon="['fas', 'paper-plane']" />
    </Button>
  </div>
</div>
</template>

<style scoped>
.myContainerChat {
  @apply flex flex-col;
  @apply border  rounded-lg;
  min-height: 400px;
}
.messageContainer {
  @apply flex flex-col flex-grow p-6;
  height: 358px;
  overflow-y: auto;
}
.disabled {
	background: rgba(208, 208, 208, 0.17);
}
.message {

}
</style>