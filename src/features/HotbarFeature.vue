<script setup lang="ts">
import SlotBar from '@/components/SlotBar.vue';
import { computed, Ref, ref, watch } from 'vue';
import { Item } from '../../env/types';
import { useLoadBot } from '@/proccess/useLoadBot';
import { webSocketBotAPI } from '@/API/WS-BOT-API';
import { STATUS } from '@/API/types';

const props = defineProps<{
  botID: string
}>()

const computedBotID = computed(()=> props.botID)
const {isLoad, onSpawnBot, onDisconnectBot} = useLoadBot(computedBotID)

const slots: Ref<Item[]> = ref([
	null, null, null,
	null, null, null,
	null, null, null
])

const initSlots = async () => {
	const response = await webSocketBotAPI.getInventorySlots(props.botID);
	if (response.status !== STATUS.SUCCESS) return

	slots.value = response.data.slots.slice(36, 45)
}

onSpawnBot(initSlots)
watch(()=> props.botID, initSlots)

onDisconnectBot(() => {
  slots.value = []
})

webSocketBotAPI.$inventoryUpdate.subscribe((data) => {
  if (data.index <= 35 || data.index > 44) return
  const hotBarIndex = data.index - 36
  slots.value[hotBarIndex] = data.item
})

function activateItem(slotIndex: number) {
  webSocketBotAPI.activateSlot(props.botID, slotIndex).then((data)=>{
    console.log(data, slotIndex)
  })
}

function dropItem(slotIndex: number) {
  webSocketBotAPI.dropSlot(props.botID, slotIndex + 36)
}

</script>

<template>
  <slot-bar
      @activate-item="slotIndex => activateItem(slotIndex)"
      @drop-item="slotIndex => dropItem(slotIndex)"
      :slots="slots"
      :skeleton="!isLoad"
  >
  </slot-bar>
</template>

<style scoped>

</style>