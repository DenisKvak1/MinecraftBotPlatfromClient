<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger} from "@/components/ui/select";
import {useBackendConnect} from "@/proccess/useBackendConnect";
import {computed, ref, Ref, watch} from "vue";
import {AccountModel} from "@/API/types";
import {webSocketBotAPI} from "@/API/WS-BOT-API";

const {onceConnect} = useBackendConnect()
const props = defineProps<{
  botID: string,
}>()
const botID = ref(props.botID)
let name = ref('')

onceConnect(async ()=>{
  name.value = (await webSocketBotAPI.getBot(botID.value)).data.account.nickname
  watch(()=> botID, async()=> {
    name.value = (await webSocketBotAPI.getBot(botID.value)).data.account.nickname
  })
})

const bots:Ref<AccountModel[]> = ref([])

onceConnect(async ()=>{
  bots.value = (await webSocketBotAPI.getAllBots()).data.accounts
})
</script>

<template>
<Select v-model="botID">
  <SelectTrigger class="w-[200px]">
    {{ name }}
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem
          v-for="bot in bots"
          :value="bot.id"
      >
        {{bot.nickname}}
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
</template>

<style scoped>

</style>