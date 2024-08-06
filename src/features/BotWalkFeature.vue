<script setup lang="ts">
import BotWalkBlock from '@/components/BotWalkBlock.vue';
import { computed } from 'vue';
import { useWalk } from '@/hook/useWalk';

const props = defineProps<{
  botID: string
}>()
const computedBotID = computed(() => props.botID);
const { onAction } = useWalk(computedBotID)

</script>

<template>
  <BotWalkBlock
    @action="data => onAction(data)"
  >
  </BotWalkBlock>
</template>

<style scoped>

</style>