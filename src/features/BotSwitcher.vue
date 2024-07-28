<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {useBackendConnect} from "@/proccess/useBackendConnect";
import {computed, ref, Ref, watch} from "vue";
import {AccountModel} from "@/API/types";
import {webSocketBotAPI} from "@/API/WS-BOT-API";
import { useRouter } from 'vue-router';
import { useCurrentBotStore } from '@/store/currentBotStore';

const {onConnect} = useBackendConnect()
const router = useRouter()
const props = defineProps<{
  botID: string,
}>()
const botID = ref(props.botID)
let name = ref('')

onConnect(async ()=>{
  name.value = (await webSocketBotAPI.getBot(botID.value)).data.account.nickname
})

const bots:Ref<AccountModel[]> = ref([])

onConnect(async ()=>{
  bots.value = (await webSocketBotAPI.getAllBots()).data.accounts
})

async function onSelect(value: string){
	await router.push(`/bots/${value}`)
}
</script>

<template>
<Select v-model="name" :default-value="name" @update:modelValue="onSelect">
  <SelectTrigger class="w-[200px]">
		<SelectValue></SelectValue>
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem
          v-for="bot in bots"
          :value="bot.nickname"
      >
        {{bot.nickname}}
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
</template>

<style scoped>

</style>