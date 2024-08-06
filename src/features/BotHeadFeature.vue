<script setup lang="ts">
import BotWalkBlock from '@/components/BotWalkBlock.vue';
import { useHotbar } from '@/hook/useHotbar';
import { computed } from 'vue';
import { useHeadRotate } from '@/hook/useHeadRotate';


const props = defineProps<{
  botID: string
}>()
const computedBotID = computed(() => props.botID);
const {onAction} = useHeadRotate(computedBotID)
</script>

<template>
  <BotWalkBlock
      @action="data => onAction(data)"
  >
  </BotWalkBlock>
</template>

<style scoped>

</style>